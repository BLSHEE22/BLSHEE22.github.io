import pandas as pd
import sqlite3
from collections import defaultdict
from time import sleep
import sys

# path to database
DB_PATH = "data/nfl.db"

# flag to enable creating new roster table
create_new_roster_table = False


def get_historical_rosters(start_season=2002, end_season=2026):
    """
    Get historical rosters from @start_season to @end_season.
    """
    dfs = []
    
    for season in range(start_season, end_season + 1):
        url = (
            f"https://github.com/nflverse/nflverse-data/"
            f"releases/download/rosters/roster_{season}.parquet"
        )

        print(f"Getting all rosters from the {season} season...")

        try:
            dfs.append(pd.read_parquet(url))
        except Exception:
            continue

        sleep(1)

    return pd.concat(dfs, ignore_index=True)


def get_rosters(season=2026):
    """
    Get rosters from @season.
    """
    dfs = []
    
    url = (
        f"https://github.com/nflverse/nflverse-data/"
        f"releases/download/rosters/roster_{season}.parquet"
    )

    print(f"Getting all rosters from the {season} season...")

    try:
        dfs.append(pd.read_parquet(url))
    except Exception:
        print("ERROR")

    return pd.concat(dfs, ignore_index=True)


def get_player_history(player_id, player_name, start_season=2000, end_season=2026):
    """
    Find all teams/seasons for which @player_name appears in the roster database.
    """

    # print(f"Finding all rosters containing {player_name}...")

    conn2 = sqlite3.connect(DB_PATH)

    query = """
        SELECT DISTINCT team, season, headshot_url
        FROM rosters
        WHERE gsis_id = ?
          AND season BETWEEN ? AND ?
        ORDER BY season
    """

    rows = conn2.execute(
        query,
        (player_id, start_season, end_season)
    ).fetchall()

    conn2.close()

    season_history = defaultdict(list)
    #print(season_history)
    headshot_history = defaultdict(list)
    #print(headshot_history)

    for team, season, headshot_url in rows:
        #print(team)
        #print(season)
        #print(headshot_url)
        if team in team_align.keys():
            team = team_align[team]
        season_history[team].append(str(season))
        #print(season_history)
        headshot_history[team] = str(headshot_url)  
        #print(headshot_history)      
    
    return (dict(season_history), dict(headshot_history))


def format_height(inches):
    """
    Translate float height (e.g. 73.0) to 'F-I' string representation (e.g. 6-1).
    """
    # if player height is unknown, mark as 'Unknown'
    if pd.isna(inches):
        return 'Unknown'
    feet, remaining_inches = divmod(int(inches), 12)
    return f"{feet}-{remaining_inches}"


def format_weight(lbs):
    """
    Translate float weight in lbs. to INTEGER.
    """
    # if player weight is unknown, mark as 'Unknown'
    if pd.isna(lbs):
        return 999
    return int(lbs)


def format_position(pos):
    """
    Translate football position to readble string representation.
    """
    # if player weight is unknown, mark as 'Unknown'
    if pd.isna(pos):
        return 'Unknown'
    return pos


def format_bday(birth_date):
    """
    Translate birthday datetime to readable string representation.
    """
    # if player bday is unknown, mark as 'Unknown'
    if pd.isna(birth_date):
        return 'Unknown'
    return birth_date.strftime("%Y-%m-%d")


### MAIN ###

# setup sqlite connection
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

#create_table()

#quit()

# get rosters
if create_new_roster_table:
    rosters = get_historical_rosters()
else:
    rosters = get_rosters()

player_data = []

# get latest rosters for each team
teams = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE",
         "DAL", "DEN", "DET", "GB", "HOU", "IND", "JAX", "KC", "LA", "LAC",
         "LV", "MIA", "MIN", "NE", "NO", "NYG", "NYJ", "PHI", "PIT",
         "SEA", "SF", "TB", "TEN", "WAS"]

# ARI->CRD, GB->GNB, HST->HOU, IND->CLT, KC->KAN, LA->RAM, LV->LVR, NE->NWE, NO->NOR, OAK->LVR, SD->LAC, SF->SFO, SL->RAM, TB->TAM
team_align = {"ARI": "CRD", "BAL": "RAV", "GB": "GNB", "HST": "HTX", "HOU": "HTX", "IND": "CLT", "KC": "KAN", "LA": "RAM", "LV": "RAI", 
              "LVR": "RAI", "NE": "NWE", "NO": "NOR", "OAK": "LVR", "SD": "SDG", "SF": "SFO", "SL": "RAM", "TB": "TAM", "TEN": "OTI"}

for team_abbrv in teams:
    team = rosters[
        rosters["team"] == team_abbrv
    ].copy()

    team_info = team[['season', 'team', 'position', 'full_name', 'gsis_id', 'status', 'height', 'weight', 'birth_date', 'draft_club', 'headshot_url']]
    players_2026 = list(team_info.loc[team_info['season'] == 2026, 
                                      ['team', 'full_name', 'gsis_id', 'height', 'weight', 'position', 'birth_date', 'draft_club', 'headshot_url']].itertuples(index=False, name=None))

    # print(players_2026)

    # get all individual data per player on latest roster
    for player_team, player_name, player_id, player_ht, player_wt, player_pos, player_bday, player_init_team, player_headshot in players_2026:
        player_dict = dict()
        if player_team in team_align.keys():
            player_team = team_align[player_team]
        player_dict["team"] = player_team
        player_dict["name"] = player_name
        player_dict["gsis_id"] = player_id
        player_dict["height"] = format_height(player_ht)
        player_dict["weight"] = format_weight(player_wt)
        player_dict["position"] = format_position(player_pos)
        player_dict["birth_date"] = format_bday(player_bday)
        # get playing history
        if create_new_roster_table:
            season_history = {}
            headshot_history = {}
        else:
            season_history, headshot_history = get_player_history(player_id, player_name)
            # if draft club not found, calculate initial team from season history
            if pd.isna(player_init_team):
                player_init_team = min(season_history, key=lambda team: int(season_history[team][0]))
                if player_init_team in team_align.keys():
                    player_init_team = team_align[player_init_team]
        player_dict["team_history"] = season_history            
        player_dict["initial_team"] = player_init_team
        # add current headshot url for player to photo dict
        headshot_history[player_team] = player_headshot
        player_dict["headshot_url"] = headshot_history
        # add data dict to global list 
        player_data.append(player_dict)

    # print(player_data)

# get all existing data EXCEPT 2026
if not create_new_roster_table:
    old_rosters = pd.read_sql_query(
        "SELECT * FROM rosters WHERE season != 2026",
        conn
    )

    # Combine old seasons with fresh 2026 data
    rosters = pd.concat(
        [old_rosters, rosters],
        ignore_index=True
    )

# replace the entire table
rosters.to_sql(
    "rosters",
    conn,
    if_exists="replace",
    index=create_new_roster_table
)
conn.commit()


### ### ###
print("Creating new table...")
# delete old table
cur.execute('''DROP TABLE IF EXISTS players''')
# create new table
cur.execute('''CREATE TABLE players (
                    id INTEGER PRIMARY KEY,
                    team TEXT,
                    name TEXT,
                    gsis_id TEXT,
                    height TEXT,
                    weight TEXT,
                    position TEXT,
                    birth_date DATETIME,
                    team_history TEXT,
                    initial_team TEXT,
                    headshot_url TEXT
            )''')
print("New table created.")
# insert each player
cur.executemany("""INSERT INTO players (team, name, gsis_id, height, weight, position, birth_date, 
                                        team_history, initial_team, headshot_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                [(p["team"], p['name'], p['gsis_id'], p['height'], p['weight'], p['position'], 
                    p['birth_date'], str(p["team_history"]), p['initial_team'], str(p['headshot_url'])) for p in player_data])
# remove duplicate players
cur.execute('''DELETE FROM players WHERE id NOT IN 
                (SELECT MAX(id) FROM players GROUP BY gsis_id)''')
conn.commit()
print("Done.")