import os
import re
import ssl
import sys
import asyncio
import sqlite3
import utils
import aiohttp
import requests
from time import sleep
from pyquery import PyQuery as pq
from urllib.error import HTTPError

# path to database
DB_PATH = "data/players.db"

# format for roster/player page urls
ROSTER_URL = 'https://www.pro-football-reference.com/teams/%s/%s_roster.htm'
PLAYER_URL = 'https://www.pro-football-reference.com/players/%s/%s.htm'

# Example: list of player ids
PLAYER_IDS = ['MayeDr00']

# constants for web scraping
WORKER_COUNT = 1          # how many workers run at once
DELAY_BETWEEN = 3         # seconds between requests (per worker)
REQUEST_TIMEOUT = 15   
username = os.environ.get('BD_USER')
password = os.environ.get('BD_PASS')
host = os.environ.get('P_HOST')
port = os.environ.get('P_PORT')
PROXY_URL = f"http://{username}:{password}@{host}:{port}"
SSL_PATH = "ssl/bd.crt"

# maps field to its .items() index
field_map = {'height':0, 'weight':1, 'birth_date':2, 'position':2}

# maps full team name to its abbreviation
nflTeamTranslator = {"Atlanta Falcons":"ATL", "Buffalo Bills":"BUF", 
                     "Carolina Panthers":"CAR", "Chicago Bears":"CHI", 
                     "Cincinnati Bengals":"CIN", "Cleveland Browns":"CLE", 
                     "Indianapolis Colts":"CLT", "Arizona Cardinals":"CRD", 
                     "Dallas Cowboys":"DAL", "Denver Broncos":"DEN", 
                     "Detroit Lions":"DET", "Green Bay Packers":"GNB", 
                     "Houston Texans":"HTX", "Jacksonville Jaguars":"JAX", 
                     "Kansas City Chiefs":"KAN", "Miami Dolphins":"MIA", 
                     "Minnesota Vikings":"MIN", "New Orleans Saints":"NOR", 
                     "New England Patriots":"NWE", "New York Giants":"NYG",
                     "New York Jets":"NYJ", "Tennessee Titans":"OTI", 
                     "Philadelphia Eagles":"PHI", "Pittsburgh Steelers":"PIT", 
                     "Las Vegas Raiders":"RAI", "Los Angeles Rams":"RAM", 
                     "Baltimore Ravens":"RAV", "Los Angeles Chargers":"SDG", 
                     "Seattle Seahawks":"SEA", "San Francisco 49ers":"SFO", 
                     "Tampa Bay Buccaneers":"TAM", "Washington Commanders":"WAS"}


## ROSTER OBJECT ##
class Roster:
    def __init__(self, team, dbConn, year=None):
        self._team = team
        self._dbConn = dbConn
        self._coach = None
        self._players = []
        player_ids = self._get_all_player_ids(year)
        print(f"Player Ids: {player_ids}")
        if player_ids:
            # Run scraping in the context of this instance
            asyncio.run(self.run_scraping(player_ids))

        if self._players:
            self._save_to_db()

        # DEBUGGING
        # self._save_to_db()

    async def run_scraping(self, player_ids):
        """Top-level async runner for fetching all players"""
        await self.fetch_player_html(player_ids)

    async def fetch_player_html(self, player_ids):
        queue = asyncio.Queue()
        for player_id in player_ids:
            await queue.put(player_id)

        async with aiohttp.ClientSession() as session:
            workers = [asyncio.create_task(self.worker(f"W{i+1}", session, queue))
                       for i in range(WORKER_COUNT)]
            await queue.join()
            for _ in workers:
                await queue.put(None)
            await asyncio.gather(*workers)

    async def worker(self, name, session, queue):
        while True:
            player_id = await queue.get()
            if player_id is None:
                break
            try:
                await self.scrape_player(session, player_id)
            finally:
                await asyncio.sleep(DELAY_BETWEEN)
                queue.task_done()

    async def scrape_player(self, session, player_id):
        """Fetch and parse one player page"""

        def parse_team_history(soup):
            """
            Parse the set of all teams the player has played for.

            Pull the player's team history from the player information and set the
            'team_history' attribute with the value prior to returning.

            Parameters
            ----------
            soup : PyQuery object
                A PyQuery object containing the HTML from the player's stats page.
            """
            # track team history via 'Snap Counts' data
            team_hist = [item.text() for item in soup('[id="snap_counts"] td[data-stat="team"]').items()]
            for i in range(0, len(team_hist)-1):
                if team_hist[i] == '':
                    team_hist[i] = team_hist[i+1]
            years_played = [item.text().replace('*', '') for item in soup('[id="snap_counts"] th[data-stat="year_id"]').items()][1:]
            for i in range(1, len(years_played)):
                if years_played[i] == '':
                    years_played[i] = years_played[i-1]
            if team_hist:
                if "LAR" in team_hist:
                    team_hist = [team.replace("LAR", "RAM") for team in team_hist]
                if "STL" in team_hist:
                    team_hist = [team.replace("STL", "RAM") for team in team_hist]
                if "LAC" in team_hist:
                    team_hist = [team.replace("LAC", "SDG") for team in team_hist]
                if "IND" in team_hist:
                    team_hist = [team.replace("IND", "CLT") for team in team_hist]
                if "OAK" in team_hist:
                    team_hist = [team.replace("OAK", "RAI") for team in team_hist]
                if "LVR-OAK" in team_hist:
                    team_hist = [team.replace("LVR-OAK", "RAI") for team in team_hist]
                if "LVR" in team_hist:
                    team_hist = [team.replace("LVR", "RAI") for team in team_hist]
                if "TEN" in team_hist:
                    team_hist = [team.replace("TEN", "OTI") for team in team_hist]
                if "ARI" in team_hist:
                    team_hist = [team.replace("ARI", "CRD") for team in team_hist]
                if "BAL" in team_hist:
                    team_hist = [team.replace("BAL", "RAV") for team in team_hist]
                if "HOU" in team_hist:
                    team_hist = [team.replace("HOU", "HTX") for team in team_hist]
                initial_team = team_hist[0]
            else:
                initial_team = None
            team_hist_full = set([(team_hist[i], years_played[i]) for i in range(len(team_hist))])
            team_hist_dict = dict()
            for team, yr in team_hist_full:
                if 'TM' not in team and team != '':
                    try:
                        team_hist_dict[team]
                    except:
                        team_hist_dict[team] = []
                    team_hist_dict[team].append(yr)
                    team_hist_dict[team] = sorted([yr for yr in team_hist_dict[team] if all(char.isnumeric() or char == '*' for char in yr)])

            return (team_hist_dict, initial_team)
        
        # SCRAPE_PLAYER 
        # sleep(3)
        print(f"Scraping {player_id} player page...")
        if not player_id:
            return 'no_player_page'
        first_character = player_id[0]
        url =  PLAYER_URL % (first_character, player_id)
        try:
            async with session.get(url) as resp:
                print(f"{url} → {resp.status}")
                # Force timeout on reading body
                html = await asyncio.wait_for(resp.read(), timeout=REQUEST_TIMEOUT)
                soup = pq(html)
                # create player information dict
                player_info = {'team': None,
                            'name': None,
                            'player_id': player_id,
                            'height': None,
                            'weight': None,
                            'position': None,
                            'birth_date': None,
                            'team_history': None,
                            'initial_team': None,
                            'fantasy_pos_rk': None,
                            'headshot_url': None}
                # name
                player_info['name'] = soup("h1").text().strip()
                # team
                narrowedSoup = [item.text().strip() for item in soup('#meta div a').items()]
                if narrowedSoup:
                    if narrowedSoup[0] in nflTeamTranslator.keys():
                        player_info['team'] = str(nflTeamTranslator[narrowedSoup[0]])
                # height, weight
                for field in ['height', 'weight']:
                    value = None
                    narrowedSoup = [item.text().strip() for item in soup("#meta div p span").items()]
                    if narrowedSoup:
                        if any(char.isalpha() for char in narrowedSoup[0]):
                            narrowedSoup = narrowedSoup[1:]
                        value = narrowedSoup[field_map[field]]
                    if " " in value:
                        print('Skipping ' + field + ' because illegal value \'' + value + '\' found.')
                        continue
                    if value and field == 'weight':
                        value = value[:-2]
                    player_info[field] = value
                # position
                meta_text = "".join([item.text() for item in soup("#meta div p").items()])
                if 'Position: ' in meta_text:
                    pos_index = meta_text.index('Position: ')
                    pos_text = meta_text[pos_index:]
                    numeric_indices = []
                    for ft in ['Throws:', '5', '6', '7']:
                        first_num_index = pos_text.find(ft)
                        if first_num_index > 0:
                            numeric_indices.append(first_num_index)
                    numeric_index = min(numeric_indices)
                    value = pos_text[10:numeric_index]
                else:
                    value = 'Unknown'
                player_info['position'] = value.strip()
                # birth_date
                birth_date = soup('#necro-birth').attr('data-birth')
                if birth_date:
                    player_info['birth_date'] = birth_date
                # team_history, initial_team
                team_history, initial_team = parse_team_history(soup)
                player_info['team_history'] = team_history
                player_info['initial_team'] = initial_team
                # fantasy_pos_rk
                value = None
                fantasy_element = 'td[data-stat="fantasy_rank_pos"]'
                fantasy_pos_rk_field = [item.text() for item in soup(fantasy_element).items()]
                if fantasy_pos_rk_field:
                    value = fantasy_pos_rk_field[-2]
                player_info['fantasy_pos_rk'] = value
                # headshot_url
                value = None
                headshot_element = '#meta div[class="media-item"] img'
                headshot_field = [item.attr['src'] for item in soup(headshot_element).items()]
                if headshot_field:
                    value = headshot_field[0]
                player_info['headshot_url'] = value
                # only append player object if team exists
                if player_info['team']:
                    self._players.append(player_info)
                return player_info
        except asyncio.TimeoutError:
            print(f"Timeout fetching {url}")
            return None
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None


    def _get_all_player_ids(self, year):
        """Form player_id list to be converted to URLs"""
        if not year:
            year = utils._find_year_for_season('nfl')
            # If stats for the requested season do not exist yet (as is the
            # case right before a new season begins), attempt to pull the
            # previous year's stats. If it exists, use the previous year
            # instead.
            if not utils._url_exists(self._create_url(year)) and \
            utils._url_exists(self._create_url(str(int(year) - 1))):
                year = str(int(year) - 1)
        print("Creating roster page url...")
        url = self._create_url(year)
        print(f"URL: {url}")
        print("Fetching roster page...")
        page = self._pull_team_page(url)
        if not page:
            output = ("Can't pull requested team page. Ensure the following "
                    "URL exists: %s" % url)
            raise ValueError(output)
        
        # get all player ids from roster table
        print("Getting all players from roster table...")
        player_ids = [self._get_player_id(player) for player in page('table#roster tbody tr').items()]
        if not player_ids:
            player_ids = PLAYER_IDS
        return player_ids
    

    def _create_url(self, year):
        """
        Build the team URL.

        Build a URL given a team's abbreviation and the 4-digit year.

        Parameters
        ----------
        year : string
            The 4-digit string representing the year to pull the team's roster
            from.

        Returns
        -------
        string
            Returns a string of the team's season page for the requested team
            and year.
        """
        return ROSTER_URL % (self._team.lower(), year)


    def _pull_team_page(self, url):
        """
        Download the team page.

        Download the requested team's season page and create a PyQuery object.

        Parameters
        ----------
        url : string
            A string of the built URL for the requested team and season.

        Returns
        -------
        PyQuery object
            Returns a PyQuery object of the team's HTML page.
        """
        try:
            resp = requests.get(url, timeout=30)
            soup = pq(utils._remove_html_comment_tags(resp.text))
            return soup
        except HTTPError:
            return None


    def _get_player_id(self, player):
        """
        Parse the player ID.

        Given a PyQuery object representing a single player on the team roster,
        parse the player ID and return it as a string.

        Parameters
        ----------
        player : PyQuery object
            A PyQuery object representing the player information from the
            roster table.

        Returns
        -------
        string
            Returns a string of the player ID.
        """
        name_tag = player('td[data-stat="player"] a')
        name = re.sub(r'.*/players/./', '', str(name_tag))
        return re.sub(r'\.htm.*', '', name)


    def _save_to_db(self):
        """
        Store all player information in database.

        1. Insert all player objects from self._players
        2. Delete duplicates
        """
        print(f"Storing new {self._team} roster in database...")
        cur = self._dbConn.cursor()
        cur.execute(f"DELETE FROM players WHERE team = ?", (self._team,))

        # DEBUGGING
        # cur.executemany("""INSERT INTO players (team, name, player_id, height, weight, position, birth_date, 
        #                                         team_history, initial_team, fantasy_pos_rk, headshot_url) 
        #                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", 
        #                 [('DAL', 'Miles Sanders', 'SandMi01', '6-7', '104', 'FB', '2002-10-01', "{'PHI': ['2019', '2020', '2021', '2022'], 'CAR': ['2023', '2024']}", 'PHI', '1', 'https://www.pro-football-reference.com/req/20230307/images/headshots/SandMi01_2023.jpg'), 
        #                  ('PHI', 'Jakobi Meyers', 'MeyeJa01', '5-2', '495', 'WR', '1961-01-05', "{'DAL': ['2022'], 'MIN': ['2018', '2019', '2020', '2021', '2023', '2024']}", 'DAL', '99', 'https://www.pro-football-reference.com/req/20230307/images/headshots/MeyeJa01_2023.jpg')])

        # insert each player
        cur.executemany("""INSERT INTO players (team, name, player_id, height, weight, position, birth_date, 
                                                team_history, initial_team, fantasy_pos_rk, headshot_url) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                        [(player['team'], player['name'], player['player_id'], player['height'],
                          player['weight'], player['position'], player['birth_date'], 
                          str(player['team_history']), player['initial_team'], player['fantasy_pos_rk'],
                          player['headshot_url']) for player in self._players])
        # remove duplicate players
        cur.execute('''DELETE FROM players WHERE id NOT IN 
                        (SELECT MAX(id) FROM players GROUP BY player_id)''')
        self._dbConn.commit()
        print("Done.")


    @property
    def players(self):
        """
        Returns a ``list`` of player instances for each player on the requested
        team's roster.
        """
        return self._players

    @property
    def coach(self):
        """
        Returns a ``string`` of the coach's name, such as 'Sean Payton'.
        """
        return self._coach


if __name__ == "__main__":
    # create db
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    # print("Creating new table...")
    # # delete old table
    # cur.execute('''DROP TABLE IF EXISTS players''')
    # # create new table
    # cur.execute('''CREATE TABLE players (
    #                     id INTEGER PRIMARY KEY,
    #                     team TEXT,
    #                     name TEXT,
    #                     player_id TEXT,
    #                     height TEXT,
    #                     weight TEXT,
    #                     position TEXT,
    #                     birth_date DATETIME,
    #                     team_history TEXT,
    #                     initial_team TEXT,
    #                     fantasy_pos_rk TEXT,
    #                     headshot_url TEXT
    #             )''')
    # print("New table created.")
    conn.commit()
    print("Establishing SSL...")
    # ssl_context = ssl.create_default_context(cafile=SSL_PATH)
    # ssl_context.check_hostname = True
    # ssl_context.verify_mode = ssl.CERT_REQUIRED
    print("SSL established.")
    teams_to_fetch = list(nflTeamTranslator.values())[int(sys.argv[1]):int(sys.argv[2])]
    for team in teams_to_fetch:
        print(f">>> Getting latest {team} roster...")
        try:
            roster = Roster(team, conn)
            print(f">>>Successfully updated {team} roster!")
            sleep(10)
        except Exception as e:
            import traceback
            print(f">>> Failed to create {team} roster: {e}")
            traceback.print_exc()
    conn.close()
    print("All done!")
