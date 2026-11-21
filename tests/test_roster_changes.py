import sqlite3
import unittest
from datetime import datetime, timedelta, timezone

from roster_changes import record_roster_update, snapshot_players


class RosterChangesTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.addCleanup(self.db.close)
        self.db.execute(
            "CREATE TABLE players (gsis_id TEXT, name TEXT, position TEXT, team TEXT)"
        )

    def test_records_additions_removals_and_moves(self):
        self.db.executemany("INSERT INTO players VALUES (?, ?, ?, ?)", [
            ("1", "Stayed", "QB", "NE"),
            ("2", "Left", "RB", "DAL"),
            ("3", "Moved", "WR", "LAC"),
        ])
        previous = snapshot_players(self.db)
        self.db.execute("DELETE FROM players")
        self.db.executemany("INSERT INTO players VALUES (?, ?, ?, ?)", [
            ("1", "Stayed", "QB", "NE"),
            ("3", "Moved", "WR", "SFO"),
            ("4", "Joined", "TE", "NE"),
        ])
        current = snapshot_players(self.db)
        timestamp = datetime(2026, 11, 21, 8, 0, tzinfo=timezone(timedelta(hours=-5)))
        self.assertEqual(record_roster_update(self.db, previous, current, timestamp), 3)
        self.assertEqual(self.db.execute(
            "SELECT gsis_id, from_team, to_team FROM roster_changes ORDER BY gsis_id"
        ).fetchall(), [("2", "DAL", None), ("3", "LAC", "SFO"), ("4", None, "NE")])
        self.assertEqual(self.db.execute(
            "SELECT updated_at FROM roster_update_runs"
        ).fetchone()[0], "2026-11-21T13:00:00+00:00")

    def test_unchanged_run_and_repeated_updates_are_recorded(self):
        players = {"1": ("Player", "QB", "NWE")}
        timestamp = datetime(2026, 11, 21, tzinfo=timezone.utc)
        self.assertEqual(record_roster_update(self.db, players, players, timestamp), 0)
        self.assertEqual(record_roster_update(self.db, players, players, timestamp), 0)
        self.assertEqual(self.db.execute("SELECT COUNT(*) FROM roster_update_runs").fetchone()[0], 2)
        self.assertEqual(self.db.execute("SELECT COUNT(*) FROM roster_changes").fetchone()[0], 0)

    def test_rejects_empty_missing_and_duplicate_ids(self):
        with self.assertRaises(ValueError):
            snapshot_players(self.db)
        self.db.execute("INSERT INTO players VALUES (NULL, 'Player', 'QB', 'NE')")
        with self.assertRaises(ValueError):
            snapshot_players(self.db)
        self.db.execute("DELETE FROM players")
        self.db.executemany("INSERT INTO players VALUES (?, ?, ?, ?)", [
            ("1", "Player", "QB", "NE"),
            ("1", "Player", "QB", "DAL"),
        ])
        with self.assertRaises(ValueError):
            snapshot_players(self.db)

    def test_update_log_and_player_changes_roll_back_together(self):
        self.db.execute("INSERT INTO players VALUES ('1', 'Player', 'QB', 'NE')")
        self.db.commit()
        previous = snapshot_players(self.db)
        self.db.execute("BEGIN")
        self.db.execute("UPDATE players SET team = 'DAL'")
        record_roster_update(self.db, previous, snapshot_players(self.db))
        self.db.rollback()
        self.assertEqual(snapshot_players(self.db)["1"][2], "NE")
        self.assertIsNone(self.db.execute(
            "SELECT name FROM sqlite_master WHERE name = 'roster_update_runs'"
        ).fetchone())

    def test_naive_timestamp_is_rejected(self):
        with self.assertRaises(ValueError):
            record_roster_update(self.db, {}, {}, datetime(2026, 11, 21))


if __name__ == "__main__":
    unittest.main()
