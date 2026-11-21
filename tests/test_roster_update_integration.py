import os
import runpy
import sqlite3
import tempfile
import unittest
from datetime import date
from pathlib import Path
from unittest.mock import patch

import pandas as pd


SCRIPT = Path(__file__).resolve().parents[1] / "update_rosters.py"


class RosterUpdateIntegrationTests(unittest.TestCase):
    def test_updater_records_changes_and_repeated_no_change_update(self):
        roster = pd.DataFrame([
            {
                "season": 2026, "team": team, "position": "QB", "full_name": name,
                "gsis_id": player_id, "status": "ACT", "height": 72, "weight": 200,
                "birth_date": date(1995, 1, 1), "draft_club": "NE",
                "years_exp": 5, "headshot_url": "https://example.com/photo.png",
            }
            for player_id, name, team in [
                ("1", "Stayed", "NE"), ("2", "Moved", "NE"), ("3", "Added", "DAL")
            ]
        ])
        with tempfile.TemporaryDirectory() as directory:
            data_dir = Path(directory) / "data"
            data_dir.mkdir()
            db_path = data_dir / "nfl.db"
            with sqlite3.connect(db_path) as db:
                roster.to_sql("rosters", db, index=False)
                db.execute("CREATE TABLE players (gsis_id TEXT, name TEXT, position TEXT, team TEXT)")
                db.executemany("INSERT INTO players VALUES (?, ?, ?, ?)", [
                    ("1", "Stayed", "QB", "NWE"),
                    ("2", "Moved", "QB", "DAL"),
                    ("4", "Removed", "QB", "DAL"),
                ])

            old_cwd = os.getcwd()
            try:
                os.chdir(directory)
                with patch("pandas.read_parquet", return_value=roster):
                    runpy.run_path(str(SCRIPT), run_name="__main__")
                    runpy.run_path(str(SCRIPT), run_name="__main__")
            finally:
                os.chdir(old_cwd)

            with sqlite3.connect(db_path) as db:
                self.assertEqual(db.execute(
                    "SELECT gsis_id, from_team, to_team FROM roster_changes ORDER BY gsis_id"
                ).fetchall(), [
                    ("2", "DAL", "NWE"), ("3", None, "DAL"), ("4", "DAL", None)
                ])
                self.assertEqual(db.execute(
                    "SELECT COUNT(*) FROM roster_update_runs"
                ).fetchone()[0], 2)
                self.assertEqual(db.execute(
                    "SELECT COUNT(*) FROM players"
                ).fetchone()[0], 3)


if __name__ == "__main__":
    unittest.main()
