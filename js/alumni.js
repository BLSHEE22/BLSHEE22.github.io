import {teams} from './data.js';

const teamNameMap = {LAC: 'SDG', TEN: 'OTI', NE: 'NWE'};
const teamColors = {
  ATL: ['#a71930', '#fff'], BUF: ['#00338d', '#fff'], CAR: ['#0085ca', '#fff'], CHI: ['#0b162a', '#fff'],
  CIN: ['#fb4f14', '#111'], CLE: ['#311d00', '#fff'], CLT: ['#002c5f', '#fff'], CRD: ['#97233f', '#fff'],
  DAL: ['#041e42', '#fff'], DEN: ['#fb4f14', '#111'], DET: ['#0076b6', '#fff'], GNB: ['#203731', '#fff'],
  HTX: ['#03202f', '#fff'], JAX: ['#006778', '#fff'], KAN: ['#e31837', '#fff'], LAC: ['#0080c6', '#fff'],
  MIA: ['#008e97', '#fff'], MIN: ['#4f2683', '#fff'], NE: ['#002244', '#fff'], NOR: ['#d3bc8d', '#111'],
  NYG: ['#0b2265', '#fff'], NYJ: ['#125740', '#fff'], PHI: ['#004c54', '#fff'], PIT: ['#ffb81c', '#111'],
  RAI: ['#a5acaf', '#111'], RAM: ['#003594', '#fff'], RAV: ['#241773', '#fff'], SEA: ['#002244', '#fff'],
  SFO: ['#aa0000', '#fff'], TAM: ['#d50a0a', '#fff'], TEN: ['#0c2340', '#fff'], WAS: ['#5a1414', '#fff']
};

function parseJson(value) {
  try {
    return JSON.parse((value || '{}').replace(/'/g, '"'));
  } catch {
    return {};
  }
}

function renderCountChart(alumni, columns, originFilter, selectedCode) {
  const chart = document.getElementById('alumniCountBars');
  const allCounts = getTeamCounts(alumni, columns, originFilter);
  const counts = selectedCode === 'all'
    ? allCounts
    : allCounts.filter(column => column.code === selectedCode);
  const maxCount = Math.max(...counts.map(team => team.count), 1);
  const tickStep = Math.max(1, Math.ceil(maxCount / 5));
  const ticks = Array.from({length: Math.ceil(maxCount / tickStep) + 1}, (_, index) => index * tickStep).reverse();

  chart.innerHTML = `<div class="alumni-axis-chart ${counts.length === 1 ? 'alumni-axis-chart-single' : ''}">
    <div class="alumni-y-axis"><span class="alumni-axis-title">Active ex-players</span><div class="alumni-y-ticks">${ticks.map(tick => `<span>${tick}</span>`).join('')}</div></div>
    <div class="alumni-plot-area">
      <div class="alumni-grid-lines">${ticks.map(() => '<i></i>').join('')}</div>
      <div class="alumni-chart-columns">${counts.map(column => {
    const logo = `https://cdn.ssref.net/req/202508011/tlogo/pfr/${column.logo}.png`;
    return `<div class="alumni-count-column" title="${column.name}: ${column.count} active ex-players">
      <strong class="alumni-count-value">${column.count}</strong>
      <div class="alumni-count-bar" style="height: ${Math.round((column.count / maxCount) * 100)}%; background: ${column.color}"></div>
      <div class="alumni-count-category"><img src="${logo}" alt="${column.name} logo" loading="lazy"><span>${column.code}</span></div>
    </div>`;
  }).join('')}</div>
    </div>
      <span class="alumni-x-axis-title">Teams, sorted descending</span>
  </div>`;
  return counts;
}

function getTeamCounts(alumni, columns, originFilter) {
  return columns.map(column => ({
    ...column,
    count: alumni.filter(player => player.team !== column.databaseCode
      && Object.hasOwn(player.history, column.databaseCode)
      && (originFilter === 'all'
        || (originFilter === 'started' && player.initial_team === column.databaseCode)
        || (originFilter === 'later' && player.initial_team !== column.databaseCode))).length
  })).sort((teamA, teamB) => teamB.count - teamA.count || teamA.name.localeCompare(teamB.name));
}

function renderMap(players) {
  const heatmap = document.getElementById('alumniHeatmap');
  const displayTeams = Object.keys(teams);
  const columns = displayTeams.map(code => ({
    code,
    name: teams[code].name,
    databaseCode: teamNameMap[code] || code,
    color: teamColors[code]?.[0] || '#333',
    textColor: teamColors[code]?.[1] || '#fff',
    logo: teams[code].logo
  }));
  const alumni = players.map(player => ({
    ...player,
    history: parseJson(player.team_history),
    headshots: parseJson(player.headshot_url)
  }));
  const selector = document.getElementById('alumniTeamSelect');
  const originButtons = document.querySelectorAll('[data-origin-filter]');
  let originFilter = 'all';
  const updateTeamOptions = () => {
    const currentTeam = selector.value;
    const sortedTeams = getTeamCounts(alumni, columns, originFilter);
    selector.innerHTML = `<option value="all">All teams</option>${sortedTeams.map(column => `<option value="${column.code}">${column.name}</option>`).join('')}`;
    selector.value = currentTeam === 'all' || sortedTeams.some(column => column.code === currentTeam)
      ? currentTeam || 'all'
      : sortedTeams[0].code;
  };
  updateTeamOptions();
  renderCountChart(alumni, columns, originFilter, selector.value);

  const getCurrentTeam = player => {
    const currentCode = Object.keys(teams).find(code => (teamNameMap[code] || code) === player.team) || player.team;
    return columns.find(column => column.code === currentCode);
  };

  const renderPlayerCard = (player, selected, maxSeasons) => {
    const currentTeam = getCurrentTeam(player);
    const headshot = player.headshots[player.team] || '';
    const tenure = selected ? player.history[selected.databaseCode]?.length || 0 : 0;
    const tenureClass = tenure >= 5 ? 'tenure-long' : tenure >= 3 ? 'tenure-mid' : 'tenure-short';
    const startedHere = selected && player.initial_team === selected.databaseCode;
    const formerTeams = columns.filter(column => Object.hasOwn(player.history, column.databaseCode));
    return `<article class="alumni-player-card ${tenureClass} ${startedHere ? 'started-here' : 'joined-later'}">
      ${headshot ? `<img class="alumni-player-photo" src="${headshot}" alt="${player.name}" loading="lazy" onerror="this.style.display='none'">` : '<div class="alumni-player-photo alumni-player-photo-empty">?</div>'}
      <div class="alumni-player-card-info"><div class="alumni-player-name-row"><h3>${player.name}</h3>${selected ? `<span class="alumni-origin-badge">${startedHere ? 'Started here' : 'Joined later'}</span>` : ''}</div><p>${player.position || 'Position unknown'} · Now with ${currentTeam?.name || player.team}</p>
        <div class="alumni-experience">${player.years_exp ?? 'N/A'} total league ${Number(player.years_exp) === 1 ? 'season' : 'seasons'}</div>
        ${selected ? `<div class="alumni-tenure"><strong>${tenure} ${tenure === 1 ? 'season' : 'seasons'}</strong> with ${selected.name}<span><i style="width: ${Math.round((tenure / maxSeasons) * 100)}%"></i></span></div>` : `<div class="alumni-former-teams">Formerly: ${formerTeams.map(team => team.name).join(', ')}</div>`}
      </div>
      ${currentTeam ? `<img class="alumni-current-team-logo" src="https://cdn.ssref.net/req/202508011/tlogo/pfr/${currentTeam.logo}.png" alt="${currentTeam.name} logo" loading="lazy">` : ''}
    </article>`;
  };

  const renderSelectedTeam = selectedCode => {
    if (selectedCode === 'all') {
      const allPlayers = alumni.filter(player => {
        const formerTeams = columns.filter(column => Object.hasOwn(player.history, column.databaseCode));
        return formerTeams.length > 0 && (originFilter === 'all'
          || (originFilter === 'started' && formerTeams.some(team => player.initial_team === team.databaseCode))
          || (originFilter === 'later' && formerTeams.some(team => player.initial_team !== team.databaseCode)));
      }).sort((playerA, playerB) => Number(playerB.years_exp) - Number(playerA.years_exp)
        || playerA.name.localeCompare(playerB.name)).slice(0, 20);
      const cards = allPlayers.map(player => renderPlayerCard(player, null, 1)).join('');
      heatmap.innerHTML = `<div class="alumni-selected-team alumni-all-teams">
        <div class="alumni-selected-team-heading"><div><span>League-wide view</span><h2>Top 20 active ex-players</h2><p>Sorted by overall league experience${originFilter === 'all' ? '' : ` · ${originFilter === 'started' ? 'Started w/team' : 'Joined later'}`}</p></div></div>
        <div class="alumni-player-grid">${cards || '<p class="alumni-heatmap-empty">No active ex-players found for this filter.</p>'}</div>
      </div>`;
      return;
    }
    const selected = columns.find(column => column.code === selectedCode);
    const exPlayers = alumni.filter(player => player.team !== selected.databaseCode
      && Object.hasOwn(player.history, selected.databaseCode)
      && (originFilter === 'all'
        || (originFilter === 'started' && player.initial_team === selected.databaseCode)
        || (originFilter === 'later' && player.initial_team !== selected.databaseCode)))
      .map(player => ({
        ...player,
        seasonsWithSelectedTeam: player.history[selected.databaseCode].length
      }))
      .sort((playerA, playerB) => playerB.seasonsWithSelectedTeam - playerA.seasonsWithSelectedTeam
        || playerA.name.localeCompare(playerB.name));
    const maxSeasons = Math.max(...exPlayers.map(player => player.seasonsWithSelectedTeam), 1);
    const selectedLogo = `https://cdn.ssref.net/req/202508011/tlogo/pfr/${selected.logo}.png`;
    const cards = exPlayers.map(player => renderPlayerCard(player, selected, maxSeasons)).join('');
    heatmap.innerHTML = `<div class="alumni-selected-team" style="--team-color: ${selected.color}; --team-text-color: ${selected.textColor}">
      <div class="alumni-selected-team-heading"><img src="${selectedLogo}" alt="${selected.name} logo"><div><span>Ex-players of</span><h2>${selected.name}</h2><p>${exPlayers.length} active ${exPlayers.length === 1 ? 'ex-player' : 'ex-players'} · Sorted by time spent with this team</p></div></div>
      <div class="alumni-player-grid">${cards || '<p class="alumni-heatmap-empty">No active ex-players found for this team.</p>'}</div>
    </div>`;
  };

  selector.addEventListener('change', event => {
    renderCountChart(alumni, columns, originFilter, event.target.value);
    renderSelectedTeam(event.target.value);
  });
  originButtons.forEach(button => {
    button.addEventListener('click', () => {
      originFilter = button.dataset.originFilter;
      originButtons.forEach(filterButton => filterButton.classList.toggle('active', filterButton === button));
      updateTeamOptions();
      renderCountChart(alumni, columns, originFilter, selector.value);
      renderSelectedTeam(selector.value);
    });
  });
  renderSelectedTeam(selector.value);
}

initSqlJs({locateFile: file => `https://sql.js.org/dist/${file}`}).then(async SQL => {
  const response = await fetch('/data/nfl.db');
  const buffer = await response.arrayBuffer();
  const db = new SQL.Database(new Uint8Array(buffer));
  const result = db.exec('SELECT gsis_id, name, position, team, team_history, initial_team, years_exp, headshot_url FROM players;')[0];
  const players = result.values.map(row => ({
    gsis_id: row[0], name: row[1], position: row[2], team: row[3], team_history: row[4],
    initial_team: row[5], years_exp: row[6], headshot_url: row[7]
  }));
  renderMap(players);
});