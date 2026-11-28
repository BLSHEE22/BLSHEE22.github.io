import csv
import io
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import urlopen


CORE_URL = "https://sports.core.api.espn.com/v2/sports/football/leagues/nfl"
TEAMS_URL = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams?limit=100"
SCHEDULE_URL = "https://github.com/nflverse/nflverse-data/releases/download/schedules/games.csv"
OUTPUT = Path("data/coaches.json")
TEAM_CODES = {
    "ARI": "CRD", "BAL": "RAV", "GB": "GNB", "HOU": "HTX", "IND": "CLT",
    "KC": "KAN", "LA": "RAM", "LAR": "RAM", "LV": "RAI", "OAK": "RAI",
    "NO": "NOR", "SD": "LAC", "SF": "SFO", "STL": "RAM", "TB": "TAM",
    "WSH": "WAS",
}


def fetch_json(url):
    with urlopen(url, timeout=30) as response:
        return json.load(response)


def team_code(code):
    return TEAM_CODES.get(code, code)


def team_id(reference):
    match = re.search(r"/teams/(\d+)(?:[?/]|$)", reference)
    if not match:
        raise ValueError(f"Invalid ESPN team reference: {reference}")
    return match.group(1)


def build_coach_data(coaches, games, today):
    histories = {}
    for game in games:
        if not game["gameday"] or game["gameday"] > today or not game["home_score"] or not game["away_score"]:
            continue
        season = int(game["season"])
        for side in ("home", "away"):
            name = game[f"{side}_coach"]
            team = team_code(game[f"{side}_team"])
            if name and team:
                histories.setdefault(name, {}).setdefault(team, set()).add(season)

    result = []
    for coach in coaches:
        history = histories.get(coach["name"], {})
        former = [
            {"team": team, "seasons": sorted(seasons)}
            for team, seasons in sorted(history.items())
            if team != coach["team"]
        ]
        result.append({**coach, "former_teams": former})
    return sorted(result, key=lambda coach: coach["team"])


def main():
    today = datetime.now(timezone.utc).date().isoformat()
    season = int(today[:4])
    team_list = fetch_json(TEAMS_URL)["sports"][0]["leagues"][0]["teams"]
    team_ids = {
        item["team"]["id"]: team_code(item["team"]["abbreviation"])
        for item in team_list
    }
    if len(team_ids) != 32:
        raise ValueError(f"Expected 32 ESPN teams, received {len(team_ids)}")

    coach_list = fetch_json(f"{CORE_URL}/seasons/{season}/coaches?limit=100")
    if coach_list["count"] != 32 or len(coach_list["items"]) != 32:
        raise ValueError("ESPN did not return 32 current head coaches")

    coaches = []
    for item in coach_list["items"]:
        match = re.search(r"/coaches/(\d+)(?:[?/]|$)", item["$ref"])
        if not match:
            raise ValueError(f"Invalid ESPN coach reference: {item['$ref']}")
        coach = fetch_json(f"{CORE_URL}/seasons/{season}/coaches/{match.group(1)}")
        current_team = team_ids[team_id(coach["team"]["$ref"])]
        coaches.append({"name": f"{coach['firstName']} {coach['lastName']}", "team": current_team})

    if len({coach["team"] for coach in coaches}) != 32:
        raise ValueError("ESPN did not return exactly one head coach per team")

    with urlopen(SCHEDULE_URL, timeout=60) as response:
        games = csv.DictReader(io.TextIOWrapper(response, encoding="utf-8", newline=""))
        data = build_coach_data(coaches, games, today)

    OUTPUT.write_text(json.dumps({"season": season, "updated": today, "coaches": data}, indent=2) + "\n")
    print(f"Updated {len(data)} head coaches in {OUTPUT}")


if __name__ == "__main__":
    main()
