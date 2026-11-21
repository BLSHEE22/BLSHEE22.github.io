from datetime import datetime, timezone


def snapshot_players(connection):
    rows = connection.execute(
        "SELECT gsis_id, name, position, team FROM players"
    ).fetchall()
    players = {}
    for player_id, name, position, team in rows:
        if not player_id or not name or not team or player_id in players:
            raise ValueError(f"Invalid or duplicate active-roster player ID: {player_id!r}")
        players[player_id] = (name, position, team)
    if not players:
        raise ValueError("Active-roster snapshot is empty")
    return players


def record_roster_update(connection, previous, current, updated_at=None):
    timestamp = updated_at or datetime.now(timezone.utc)
    if timestamp.tzinfo is None or timestamp.utcoffset() is None:
        raise ValueError("Roster update timestamp must have a timezone")
    timestamp = timestamp.astimezone(timezone.utc).isoformat(timespec="seconds")

    connection.execute("""
        CREATE TABLE IF NOT EXISTS roster_update_runs (
            id INTEGER PRIMARY KEY,
            updated_at TEXT NOT NULL
        )
    """)
    connection.execute("""
        CREATE TABLE IF NOT EXISTS roster_changes (
            update_id INTEGER NOT NULL REFERENCES roster_update_runs(id),
            gsis_id TEXT NOT NULL,
            name TEXT NOT NULL,
            position TEXT,
            from_team TEXT,
            to_team TEXT,
            PRIMARY KEY (update_id, gsis_id)
        )
    """)
    update_id = connection.execute(
        "INSERT INTO roster_update_runs (updated_at) VALUES (?)", (timestamp,)
    ).lastrowid

    changes = []
    for player_id in sorted(previous.keys() | current.keys()):
        before = previous.get(player_id)
        after = current.get(player_id)
        old_team = before[2] if before else None
        new_team = after[2] if after else None
        if old_team != new_team:
            name, position, _ = after if after else before
            changes.append((update_id, player_id, name, position, old_team, new_team))

    connection.executemany("""
        INSERT INTO roster_changes
            (update_id, gsis_id, name, position, from_team, to_team)
        VALUES (?, ?, ?, ?, ?, ?)
    """, changes)
    return len(changes)
