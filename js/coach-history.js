export async function fetchCoachHistory() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch('data/coaches.json', {signal: controller.signal});
    if (!response.ok) throw new Error(`Coach data request failed: ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.coaches) || !data.updated || !data.season ||
        !data.coaches.every(coach => typeof coach.name === 'string' && typeof coach.team === 'string' &&
          Array.isArray(coach.former_teams) && coach.former_teams.every(entry =>
            typeof entry.team === 'string' && Array.isArray(entry.seasons)))) {
      throw new Error('Coach data is incomplete.');
    }
    return data;
  } finally {
    clearTimeout(timeout);
  }
}
