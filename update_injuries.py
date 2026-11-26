import pandas as pd
import sqlite3
from datetime import datetime
import sys

DB_PATH = "data/nfl.db"
CURRENT_SEASON = 2026


def setup_injuries_table(conn):
    """Create injuries table if it doesn't exist."""
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS injuries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gsis_id TEXT,
            player_name TEXT,
            position TEXT,
            team TEXT,
            injury_type TEXT,
            status TEXT,
            week INTEGER,
            season INTEGER,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(gsis_id, week, season, status)
        )
    ''')
    conn.commit()


def get_injury_data(season=CURRENT_SEASON):
    """
    Fetch injury data from nflverse for the given season.
    Returns a DataFrame with injury information.
    """
    try:
        from nflreadpy import load_injuries
        
        print(f"Fetching injury data for {season} season...")
        
        # Load injuries data
        injuries_df = load_injuries(seasons=season)
        
        if injuries_df is not None and len(injuries_df) > 0:
            # Select relevant columns
            # Available columns: gsis_id, player_name, position, team, 
            # injury_type, status, week, season
            relevant_cols = [col for col in injuries_df.columns 
                           if col in ['gsis_id', 'player_name', 'position', 'team', 
                                     'injury_type', 'status', 'week', 'season']]
            return injuries_df[relevant_cols]
        else:
            print(f"No injury data available for {season}")
            return pd.DataFrame()
            
    except ImportError:
        print("Error: nflreadpy not installed. Install with: pip install nflreadpy")
        return pd.DataFrame()
    except Exception as e:
        print(f"Error fetching injury data: {e}")
        return pd.DataFrame()


def store_injuries(conn, injuries_df):
    """Store injury data in the database."""
    if injuries_df is None or (hasattr(injuries_df, 'empty') and injuries_df.empty) or len(injuries_df) == 0:
        print("No injury data to store.")
        return 0
    
    cursor = conn.cursor()
    rows_inserted = 0
    
    # Handle polars DataFrame
    if hasattr(injuries_df, 'to_dicts'):
        # It's a polars DataFrame
        for row_dict in injuries_df.to_dicts():
            try:
                cursor.execute('''
                    INSERT OR REPLACE INTO injuries 
                    (gsis_id, player_name, position, team, injury_type, status, week, season)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    row_dict.get('gsis_id'),
                    row_dict.get('player_name'),
                    row_dict.get('position'),
                    row_dict.get('team'),
                    row_dict.get('injury_type'),
                    row_dict.get('status'),
                    row_dict.get('week'),
                    row_dict.get('season')
                ))
                rows_inserted += 1
            except Exception as e:
                print(f"Error inserting injury for {row_dict.get('player_name')}: {e}")
                continue
    else:
        # It's a pandas DataFrame
        for _, row in injuries_df.iterrows():
            try:
                cursor.execute('''
                    INSERT OR REPLACE INTO injuries 
                    (gsis_id, player_name, position, team, injury_type, status, week, season)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    row.get('gsis_id'),
                    row.get('player_name'),
                    row.get('position'),
                    row.get('team'),
                    row.get('injury_type'),
                    row.get('status'),
                    row.get('week'),
                    row.get('season')
                ))
                rows_inserted += 1
            except Exception as e:
                print(f"Error inserting injury for {row.get('player_name')}: {e}")
                continue
    
    conn.commit()
    return rows_inserted


def clear_old_injuries(conn, season=CURRENT_SEASON):
    """Clear injuries from previous seasons to keep database clean."""
    cursor = conn.cursor()
    cursor.execute('DELETE FROM injuries WHERE season < ?', (season,))
    deleted = cursor.rowcount
    conn.commit()
    return deleted


def update_injuries():
    """Main function to update injury data."""
    try:
        conn = sqlite3.connect(DB_PATH)
        
        print(f"Starting injury update for {CURRENT_SEASON} season...")
        
        # Setup table
        setup_injuries_table(conn)
        
        # Get injury data
        injuries_df = get_injury_data(CURRENT_SEASON)
        
        # Store in database
        rows_inserted = store_injuries(conn, injuries_df)
        print(f"Inserted/updated {rows_inserted} injury records")
        
        # Clean up old seasons
        deleted = clear_old_injuries(conn, CURRENT_SEASON)
        if deleted > 0:
            print(f"Cleaned up {deleted} old injury records")
        
        # Show current injury count
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*) FROM injuries WHERE season = ?', (CURRENT_SEASON,))
        total = cursor.fetchone()[0]
        print(f"Database now contains {total} total injury records for {CURRENT_SEASON}")
        
        conn.close()
        print("✓ Injury update complete")
        return 0
        
    except Exception as e:
        print(f"✗ Error during injury update: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(update_injuries())
