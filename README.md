# NFL Revenge Game Finder
What is a revenge game?
- A “revenge game” occurs when a player faces off against his former team.

Types of Revenge Games
- Primary → Against the team where the player played their first snap
- Secondary → Against any other team the player played for previously

Examples
- Saquon Barkley holds a primary grudge against the New York Giants and does not hold any secondary grudges.
- JuJu Smith-Schuster holds a primary grudge against the Pittsburgh Steelers and a secondary grudge against the New England Patriots.
- Sam Darnold holds a primary grudge against the New York Jets and secondary grudges against the Carolina Panthers, San Francisco 49ers, and Minnesota Vikings.

Players are ranked first by whether the opponent was their original team, then by the number of seasons spent there, and then by how recently they played for that team.

## Active roster changes

Each successful roster update compares active players by their GSIS ID and records additions, removals, and moves between teams. Changes reflect roster snapshots, not confirmed signings or releases.

The scheduled GitHub Actions update runs at 03:00 UTC, and can also be run manually. Change history is retained in `data/nfl.db`.

## Coach matchups

Matchup cards highlight current head coaches facing a team they previously coached as head coach. The Head Coach section between Fantasy and Other lists such matchups in the current week's upcoming games, or shows "No head coach revenge games this week" if there are none. Current coaches come from ESPN; previous head-coaching stops are matched by name from completed games in the [nflverse schedule data](https://github.com/nflverse/nfldata), maintained by Lee Sharpe. The history starts in 1999 and may be incomplete or affected by identical names. Assistant and coordinator roles are not included, so Ben Johnson's time with Detroit is not currently detected.

The coach snapshot in `data/coaches.json` is updated daily at 05:00 UTC by GitHub Actions. Run `python3 update_coaches.py` to refresh it manually.

On Alumni Statistics, a white outline marks a current-team pie slice when that team's head coach previously coached the selected former team. A note identifies each matching coach; the same head-coach-only history limitations apply.