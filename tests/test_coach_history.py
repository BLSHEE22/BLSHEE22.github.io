import unittest

from update_coaches import build_coach_data


class CoachHistoryTests(unittest.TestCase):
    def test_completed_games_build_former_head_coaching_history(self):
        coaches = [{"name": "Coach One", "team": "LAC"}]
        games = [
            {"season": "2022", "gameday": "2022-10-01", "home_score": "0", "away_score": "7",
             "home_coach": "Coach One", "home_team": "OAK", "away_coach": "Other", "away_team": "SD"},
            {"season": "2023", "gameday": "2023-10-01", "home_score": "3", "away_score": "7",
             "home_coach": "Other", "home_team": "LAR", "away_coach": "Coach One", "away_team": "LV"},
            {"season": "2024", "gameday": "2024-10-01", "home_score": "3", "away_score": "7",
             "home_coach": "Coach One", "home_team": "SD", "away_coach": "Other", "away_team": "LAR"},
            {"season": "2025", "gameday": "2025-11-02", "home_score": "", "away_score": "",
             "home_coach": "Coach One", "home_team": "DEN", "away_coach": "Other", "away_team": "LAR"},
        ]
        result = build_coach_data(coaches, games, "2025-11-01")
        self.assertEqual(result[0]["former_teams"], [{"team": "RAI", "seasons": [2022, 2023]}])

    def test_coach_without_recorded_history_is_retained(self):
        coaches = [{"name": "New Coach", "team": "CHI"}]
        self.assertEqual(build_coach_data(coaches, [], "2026-11-27"), [
            {"name": "New Coach", "team": "CHI", "former_teams": []}
        ])


if __name__ == "__main__":
    unittest.main()
