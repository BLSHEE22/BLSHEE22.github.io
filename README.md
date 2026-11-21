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

Each successful roster update compares active players by their GSIS ID and records additions, removals, and moves between teams. The home page displays update dates and times in Eastern time and shows updates from the last seven Eastern calendar days, including updates with no changes. Tracking starts with the first update after this feature is deployed; older updates are not backfilled. Changes reflect roster snapshots, not confirmed signings or releases.

The scheduled GitHub Actions update runs at 03:00 UTC, and can also be run manually. Change history is retained in `data/nfl.db`.