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

function renderCountChart(alumni, columns, originFilter, selectedCode, chartMetric, highlightedTeam = null) {
  const chart = document.getElementById('alumniCountBars');
  const chartTitle = document.getElementById('alumniCountChartTitle');
  const allCounts = getTeamCounts(alumni, columns, originFilter, chartMetric);
  const counts = selectedCode === 'all'
    ? allCounts
    : allCounts.filter(column => column.code === selectedCode);
  const metricLabel = chartMetric === 'experience' ? 'Total experience years' : 'Active ex-players';
  if (originFilter === 'started') {
    chartTitle.textContent = 'Which Teams Are Most Responsible for League-Wide Talent?';
  } else if (originFilter === 'later') {
    chartTitle.textContent = 'Which Teams Have the Most Non-Homegrown Alumni?';
  } else {
    chartTitle.textContent = 'Most Well-Represented Teams';
  }
  const maxValue = Math.max(...counts.map(team => getMetricValue(team, chartMetric)), 1);
  const tickStep = Math.max(1, Math.ceil(maxValue / 5));
  const ticks = Array.from({length: Math.ceil(maxValue / tickStep) + 1}, (_, index) => index * tickStep).reverse();

  chart.innerHTML = `<div class="alumni-axis-chart ${counts.length === 1 ? 'alumni-axis-chart-single' : ''}">
    <div class="alumni-y-axis"><span class="alumni-axis-title">${metricLabel}</span><div class="alumni-y-ticks">${ticks.map(tick => `<span>${tick}</span>`).join('')}</div></div>
    <div class="alumni-plot-area">
      <div class="alumni-grid-lines">${ticks.map(() => '<i></i>').join('')}</div>
      <div class="alumni-chart-columns">${counts.map(column => {
    const logo = `https://cdn.ssref.net/req/202508011/tlogo/pfr/${column.logo}.png`;
    const primaryValue = getMetricValue(column, chartMetric);
    return `<div class="alumni-count-column ${column.code === highlightedTeam ? 'selected-bar' : ''}" data-team="${column.code}" role="button" tabindex="0" aria-label="Select ${column.name}" title="${column.name}: ${column.count} active ex-players, ${column.experienceYears} total league seasons">
      <strong class="alumni-count-value">${primaryValue}</strong>
      <div class="alumni-count-bar" style="height: ${Math.round((primaryValue / maxValue) * 100)}%; background: ${column.color}"></div>
      <div class="alumni-count-category"><img src="${logo}" alt="${column.name} logo" loading="lazy"><span>${column.code}</span></div>
    </div>`;
  }).join('')}</div>
    </div>
  </div>`;
  return counts;
}

function getMetricValue(team, chartMetric) {
  return chartMetric === 'experience' ? team.experienceYears : team.count;
}

function getTeamCounts(alumni, columns, originFilter, chartMetric = 'count') {
  return columns.map(column => ({
    ...column,
    matchingPlayers: alumni.filter(player => player.team !== column.databaseCode
      && Object.hasOwn(player.history, column.databaseCode)
      && (originFilter === 'all'
        || (originFilter === 'started' && player.initial_team === column.databaseCode)
        || (originFilter === 'later' && player.initial_team !== column.databaseCode))),
  })).map(column => ({
    ...column,
    count: column.matchingPlayers.length,
    experienceYears: column.matchingPlayers.reduce((total, player) => total + (Number(player.years_exp) || 0), 0)
  })).sort((teamA, teamB) => getMetricValue(teamB, chartMetric) - getMetricValue(teamA, chartMetric)
    || teamA.name.localeCompare(teamB.name));
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
  const chartContainer = document.getElementById('alumniCountBars');
  const originButtons = document.querySelectorAll('[data-origin-filter]');
  const metricButtons = document.querySelectorAll('[data-chart-metric]');
  let originFilter = 'all';
  let chartMetric = 'count';
  let playerSort = 'tenure';
  const updateTeamOptions = () => {
    const currentTeam = selector.value || 'all';
    const sortedTeams = getTeamCounts(alumni, columns, originFilter, chartMetric);
    selector.innerHTML = `<option value="all">All teams</option>${sortedTeams.map(column => `<option value="${column.code}">${column.name}</option>`).join('')}`;
    selector.value = currentTeam === 'all' || sortedTeams.some(column => column.code === currentTeam)
      ? currentTeam
      : sortedTeams[0].code;
  };
  updateTeamOptions();
  renderCountChart(alumni, columns, originFilter, selector.value, chartMetric);

  const getCurrentTeam = player => {
    const currentCode = Object.keys(teams).find(code => (teamNameMap[code] || code) === player.team) || player.team;
    return columns.find(column => column.code === currentCode);
  };

  const renderPlayerCard = (player, selected, maxSeasons) => {
    const currentTeam = getCurrentTeam(player);
    const headshot = player.headshots[player.team] || '';
    const tenure = selected ? player.history[selected.databaseCode]?.length || 0 : 0;
    const overallExperience = Number(player.years_exp) || 0;
    const shadeValue = playerSort === 'experience' ? overallExperience : tenure;
    const shadeClass = playerSort === 'experience'
      ? (shadeValue >= 15 ? 'tenure-long' : shadeValue >= 10 ? 'tenure-mid' : 'tenure-short')
      : (shadeValue >= 5 ? 'tenure-long' : shadeValue >= 3 ? 'tenure-mid' : 'tenure-short');
    const startedHere = selected && player.initial_team === selected.databaseCode;
    const formerTeams = columns.filter(column => Object.hasOwn(player.history, column.databaseCode));
    return `<article class="alumni-player-card ${shadeClass} ${startedHere ? 'started-here' : 'joined-later'}">
      ${headshot ? `<img class="alumni-player-photo" src="${headshot}" alt="${player.name}" loading="lazy" onerror="this.style.display='none'">` : '<div class="alumni-player-photo alumni-player-photo-empty">?</div>'}
      <div class="alumni-player-card-info"><div class="alumni-player-name-row"><h3>${player.name}</h3>${selected ? `<span class="alumni-origin-badge">${startedHere ? 'Started here' : 'Joined later'}</span>` : ''}</div><p>${player.position || 'Position unknown'} · Now with ${currentTeam?.name || player.team}</p>
        <div class="alumni-experience">${player.years_exp ?? 'N/A'} total league ${Number(player.years_exp) === 1 ? 'season' : 'seasons'}</div>
        ${selected ? `<div class="alumni-tenure"><strong>${tenure} ${tenure === 1 ? 'season' : 'seasons'}</strong> with ${selected.name}<span><i style="width: ${Math.round((tenure / maxSeasons) * 100)}%"></i></span></div>` : `<div class="alumni-former-teams">Formerly: ${formerTeams.map(team => team.name).join(', ')}</div>`}
      </div>
      ${currentTeam ? `<img class="alumni-current-team-logo" src="https://cdn.ssref.net/req/202508011/tlogo/pfr/${currentTeam.logo}.png" alt="${currentTeam.name} logo" loading="lazy">` : ''}
    </article>`;
  };

  const renderSelectedTeam = selectedCode => {
    const topTeam = getTeamCounts(alumni, columns, originFilter, chartMetric)[0];
    const rosterTeamCode = selectedCode === 'all' ? topTeam?.code : selectedCode;
    const selected = columns.find(column => column.code === rosterTeamCode);
    if (!selected) return;
    const exPlayers = alumni.filter(player => player.team !== selected.databaseCode
      && Object.hasOwn(player.history, selected.databaseCode)
      && (originFilter === 'all'
        || (originFilter === 'started' && player.initial_team === selected.databaseCode)
        || (originFilter === 'later' && player.initial_team !== selected.databaseCode)))
      .map(player => ({
        ...player,
        seasonsWithSelectedTeam: player.history[selected.databaseCode].length
      }))
      .sort((playerA, playerB) => {
        const valueA = playerSort === 'experience' ? Number(playerA.years_exp) || 0 : playerA.seasonsWithSelectedTeam;
        const valueB = playerSort === 'experience' ? Number(playerB.years_exp) || 0 : playerB.seasonsWithSelectedTeam;
        return valueB - valueA || playerA.name.localeCompare(playerB.name);
      });
    const maxSeasons = Math.max(...exPlayers.map(player => player.seasonsWithSelectedTeam), 1);
    const selectedLogo = `https://cdn.ssref.net/req/202508011/tlogo/pfr/${selected.logo}.png`;
    const cards = exPlayers.map(player => renderPlayerCard(player, selected, maxSeasons)).join('');
    heatmap.innerHTML = `<div class="alumni-selected-team" style="--team-color: ${selected.color}; --team-text-color: ${selected.textColor}">
      <div class="alumni-selected-team-heading"><img src="${selectedLogo}" alt="${selected.name} logo"><div><span>Ex-players of</span><h2>${selected.name}</h2><p>${exPlayers.length} active ${exPlayers.length === 1 ? 'ex-player' : 'ex-players'} · Sorted by ${playerSort === 'experience' ? 'overall experience' : 'time spent with this team'}</p></div><div class="alumni-player-sort" role="group" aria-label="Sort players"><span>Sort By:</span><div class="alumni-origin-filter-buttons"><button type="button" class="${playerSort === 'tenure' ? 'active' : ''}" data-player-sort="tenure">Seasons with team</button><button type="button" class="${playerSort === 'experience' ? 'active' : ''}" data-player-sort="experience">Overall experience years</button></div></div></div>
      <div class="alumni-player-grid">${cards || '<p class="alumni-heatmap-empty">No active ex-players found for this team.</p>'}</div>
    </div>`;
  };

  const selectChartTeam = event => {
    const bar = event.target.closest('[data-team]');
    if (!bar || !chartContainer.contains(bar)) return;
    selector.value = bar.dataset.team;
    renderCountChart(alumni, columns, originFilter, 'all', chartMetric, selector.value);
    renderSelectedTeam(selector.value);
  };

  chartContainer.addEventListener('click', selectChartTeam);
  chartContainer.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectChartTeam(event);
    }
  });

  selector.addEventListener('change', event => {
    renderCountChart(alumni, columns, originFilter, event.target.value, chartMetric);
    renderSelectedTeam(event.target.value);
  });
  originButtons.forEach(button => {
    button.addEventListener('click', () => {
      originFilter = button.dataset.originFilter;
      originButtons.forEach(filterButton => filterButton.classList.toggle('active', filterButton === button));
      updateTeamOptions();
      renderCountChart(alumni, columns, originFilter, 'all', chartMetric, selector.value);
      renderSelectedTeam(selector.value);
    });
  });
  metricButtons.forEach(button => {
    button.addEventListener('click', () => {
      chartMetric = button.dataset.chartMetric;
      metricButtons.forEach(metricButton => metricButton.classList.toggle('active', metricButton === button));
      updateTeamOptions();
      renderCountChart(alumni, columns, originFilter, 'all', chartMetric, selector.value);
      renderSelectedTeam(selector.value);
    });
  });
  heatmap.addEventListener('click', event => {
    const button = event.target.closest('[data-player-sort]');
    if (!button) return;
    playerSort = button.dataset.playerSort;
    renderSelectedTeam(selector.value);
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