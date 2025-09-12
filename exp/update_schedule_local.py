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
from playwright.sync_api import sync_playwright
from urllib.error import HTTPError

# path to database
DB_PATH = "data/players.db"

# format for schedule page url
SCHEDULE_URL = 'https://operations.nfl.com/gameday/nfl-schedule/2025-nfl-schedule/'

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

# map division to list of teams
nflDivisions = {"afc_east": ['BUF', 'MIA', 'NYJ', 'NWE'],
                "afc_north": ['CIN', 'CLE', 'PIT', 'RAV'],
                "afc_south": ['CLT', 'HTX', 'JAX', 'OTI'],
                "afc_west": ['DEN', 'KAN', 'RAI', 'SDG'],
                "nfc_east": ['DAL', 'NYG', 'PHI', 'WAS'],
                "nfc_north": ['CHI', 'DET', 'GNB', 'MIN'],
                "nfc_south": ['ATL', 'CAR', 'NOR', 'TAM'],
                "nfc_west": ['CRD', 'RAM', 'SEA', 'SFO']}

## MATCHUP SLATE OBJECT ##
class MatchupSlate:
    def __init__(self, week, dbConn, year=None):
        self._week = week
        self._matchups = {}
        self._dbConn = dbConn

        # player_ids = self._get_all_player_ids(year)

        asyncio.run(self.run_scraping(week))

        #self._save_to_db()

        # DEBUGGING
        # self._save_to_db()

    async def run_scraping(self, week):
        """Top-level async runner for fetching all players"""
        await self.fetch_schedule_html(week)

    async def fetch_schedule_html(self, week):
        queue = asyncio.Queue()
        await queue.put(week)

        async with aiohttp.ClientSession() as session:
            workers = [asyncio.create_task(self.worker(f"W{i+1}", session, queue))
                       for i in range(WORKER_COUNT)]
            await queue.join()
            for _ in workers:
                await queue.put(None)
            await asyncio.gather(*workers)

    async def worker(self, name, session, queue):
        while True:
            week = await queue.get()
            if week is None:
                break
            try:
                await self.scrape_week(session, week)
            finally:
                await asyncio.sleep(DELAY_BETWEEN)
                queue.task_done()

    async def scrape_week(self, session, week):
        """Fetch and parse one week page"""

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
        print(f"Scraping week {week} page...")
        if not week:
            return 'no_player_page'
        url =  SCHEDULE_URL
        try:
            async with session.get(url) as resp:
                print(f"{url} → {resp.status}")
                # Force timeout on reading body
                html = await asyncio.wait_for(resp.read(), timeout=REQUEST_TIMEOUT)
                soup = pq(html)

                # form JSON object
                schedule = []
                weeks = []
                
                # grab all matchup information                
                dates = "td p strong"
                gameDates = [item.text().strip().replace(u'\xa0', u' ') for item in soup(dates).items()]
                # teams
                # test_data = [item.text().strip() for item in soup('p[align="left"]').items()]
                # tables
                test_data = [x.split("\n") for x in [item.text().strip().replace(u'\xa0', u' ') for item in soup('div[class="full-width"]').items()]]
                #print(test_data)

                result = {"0": {}}

                for row in test_data[1:]:
                    week_label = row[0]
                    week_num = week_label.split()[1]
                    items = row[1:]

                    if week_num not in result:
                        result[week_num] = {}

                    current_date = None
                    i = 0
                    while i < len(items):
                        # if this looks like a date marker (not a matchup), treat as new date
                        if " at " not in items[i] and " vs " not in items[i]: 
                            current_date = items[i]
                            if current_date not in result[week_num]:
                                result[week_num][current_date] = []
                            i += 1
                        else:
                            matchup = items[i]
                            time_et = items[i+1]
                            time_local = items[i+2]
                            channel = items[i+3]
                            teams = matchup.split(" at ")
                            # neutral site matchup
                            if len(teams) == 1:
                                teams = matchup.split(" vs ")
                            away_team = teams[0]
                            home_team = teams[1]
                            stripSuffix = True
                            try:
                                locationSuffix = home_team.index("(")
                            except:
                                stripSuffix = False
                            if stripSuffix:
                                home_team = home_team[:locationSuffix-1]
                            awayTeamAbbr = nflTeamTranslator[away_team]
                            homeTeamAbbr = nflTeamTranslator[home_team]
                            result[week_num][current_date].append({
                                "time": time_et,
                                "awayTeam": awayTeamAbbr,
                                "homeTeam": homeTeamAbbr,
                                "time_local": time_local,
                                "channel": channel
                            })
                            i += 4

                self._matchups = result
                return
            
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
        Store all information in database.

        1. Remove entries for current week 
        2. Insert matchup list object from self._matchups for current week
        """
        print(f"Storing new week {self._week} matchups in database...")
        cur = self._dbConn.cursor()
        cur.execute(f"DELETE FROM schedule WHERE week = ?", (week,))

        # insert matchup list
        cur.executemany("""INSERT INTO schedule (week, matchups) VALUES (?, ?)""", [(key, value) for key, value in self._matchups])

        # DEBUGGING
        # cur.executemany("""INSERT INTO players (team, name, player_id, height, weight, position, birth_date, 
        #                                         team_history, initial_team, fantasy_pos_rk, headshot_url) 
        #                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", 
        #                 [('DAL', 'Miles Sanders', 'SandMi01', '6-7', '104', 'FB', '2002-10-01', "{'PHI': ['2019', '2020', '2021', '2022'], 'CAR': ['2023', '2024']}", 'PHI', '1', 'https://www.pro-football-reference.com/req/20230307/images/headshots/SandMi01_2023.jpg'), 
        #                  ('PHI', 'Jakobi Meyers', 'MeyeJa01', '5-2', '495', 'WR', '1961-01-05', "{'DAL': ['2022'], 'MIN': ['2018', '2019', '2020', '2021', '2023', '2024']}", 'DAL', '99', 'https://www.pro-football-reference.com/req/20230307/images/headshots/MeyeJa01_2023.jpg')])

        self._dbConn.commit()
        print("Done.")


    @property
    def matchups(self):
        """
        Returns the dictionary of matchups per week.
        """
        return self._matchups

    @property
    def coach(self):
        """
        Returns a ``string`` of the coach's name, such as 'Sean Payton'.
        """
        return self._coach


if __name__ == "__main__":
    # gather command line argument 
    division = sys.argv[1]
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
    # print("Creating new table...")
    # cur.execute('''DROP TABLE IF EXISTS schedule''')
    # # create new table
    # cur.execute('''CREATE TABLE schedule (
    #                     id INTEGER PRIMARY KEY,
    #                     week INTEGER,
    #                     matchups JSON
    #             )''')
    # for week in range(19):
    #     MatchupSlate(week, conn)
    conn.commit()
    print("Establishing SSL...")
    # ssl_context = ssl.create_default_context(cafile=SSL_PATH)
    # ssl_context.check_hostname = True
    # ssl_context.verify_mode = ssl.CERT_REQUIRED
    print("SSL established.")
    # teams_to_fetch = nflDivisions[division]
    # for team in teams_to_fetch:
    #     print(f">>> Getting latest {team} roster...")
    #     try:
    #         roster = Roster(team, conn)
    #         print(f">>>Successfully updated {team} roster!")
    #         sleep(10)
    #     except Exception as e:
    #         import traceback
    #         print(f">>> Failed to create {team} roster: {e}")
    #         traceback.print_exc()

    matchupSlate = MatchupSlate(1, conn)
    print(matchupSlate._matchups)
    conn.close()
    print("All done!")
