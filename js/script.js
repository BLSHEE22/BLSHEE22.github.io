import {teams, weekLengthInfo} from './data.js';

let db = null;

// Initialize SQL.js
initSqlJs({
  locateFile: file => `https://sql.js.org/dist/${file}` // Point to wasm file
}).then(async SQL => {
  // Fetch the pre-hosted .db file
  const response = await fetch('/data/nfl.db');
  const buffer = await response.arrayBuffer();

  // Load the database from the buffer
  db = new SQL.Database(new Uint8Array(buffer));
  console.log("Database loaded successfully.");

  // broadcast db ready
  document.dispatchEvent(new Event("db-ready"));
});

// Handle query execution
document.getElementById('run').addEventListener('click', () => {
  if (!db) {
    alert("Database not loaded yet.");
    return;
  }
  const query = document.getElementById('query').value;
  try {
    const results = db.exec(query);
    if (results.length === 0) {
      document.getElementById('results').textContent = "Query executed successfully. No rows returned.";
    } else {
      const output = results.map(res => {
        const headers = res.columns.join('\t');
        const rows = res.values.map(row => row.join('\t')).join('\n');
        return headers + '\n' + rows;
      }).join('\n\n');

      document.getElementById('results').textContent = output;
    }
  } catch (err) {
    document.getElementById('results').textContent = "Error: " + err.message;
  }
});

// set default week to 1
let weekNum = 1;

// total count of grudge matches
let totalGrudges = 0;

let fantasyGrudges = [];
let nonFantasyGrudges = [];

const fantasyPositions = ['QB', 'RB', 'WR', 'TE', 'K'];

// Keep the clicked team visible when the pointer leaves the chart.
let selectedAlumniTeam = null;

// current date/time
const now = new Date();

// translate modern team id to database id
const team_name_map = {'LAC': 'SDG', 'TEN': 'OTI', 'NE': 'NWE'};

// translate database id to modern team id
const team_db_name_to_irl_name = {'SDG': 'LAC', 'OTI': 'TEN', 'NWE': 'NE'};

// define position order for use in tables
const position_order = {"QB": 0, // fantasy
                        "RB": 1,
                        "WR": 2,
                        "TE": 3,
                        "K": 4,
                        "DE": 5, // defense
                        "DT": 6,
                        "DL": 7,
                        "OLB": 8,
                        "MLB": 9,
                        "ILB": 10,
                        "LB": 11,
                        "CB": 12,
                        "FS": 13,
                        "SS": 14,
                        "S": 15,
                        "DB": 16,
                        "C": 17, // offensive line
                        "T": 18,
                        "G": 19,
                        "OL": 20,
                        "LS": 21, // utility
                        "P": 22,
                        "Unknown": 1000}

function getSeasonRanges(seasons) {
  const years = [...new Set(seasons.map(season => Number.parseInt(season, 10)).filter(Number.isInteger))]
    .sort((seasonA, seasonB) => seasonA - seasonB);
  const ranges = [];

  for (const season of years) {
    const currentRange = ranges[ranges.length - 1];
    if (currentRange && season === currentRange.end + 1) {
      currentRange.end = season;
    } else {
      ranges.push({start: season, end: season});
    }
  }
  return ranges;
}

/**
 * Upate matchup table content.
 *
 * @param {string} aTeam - Away team abbreviation
 * @param {string} hTeam - Home team abbreviation
 * @param {Object} responseArea - HTML element where table will be placed
 * @void
 */
function updateMatchupTable(aTeam, hTeam, responseArea, custom=false) {

  /**
   * Format query information into HTML code to be displayed in a table.
   *
   * @param {dict} result - Resulting data from query.
   * @param {string} currTeam - Abbreviation of the past team.
   * @param {string} opposingTeam - Abbreviation of the opposing team.
   * @returns {list[string]} - List of HTML strings representing each player.
   */
  function formatQueryData(result, currTeam, opposingTeam, opposingTeamCodes, compact = false) {
    let htmlList = [];
    const columnNames = result['columns'];
    const players = result['values'];
    const historyColumn = columnNames.indexOf('team_history');
    const initialTeamColumn = columnNames.indexOf('initial_team');
    const yearsExpColumn = columnNames.indexOf('years_exp');
    const nameColumn = columnNames.indexOf('name');
    const sortedPlayers = players.map(player => {
      const playerHistory = JSON.parse(player[historyColumn].replace(/'/g, '"'));
      const opposingHistoryCode = opposingTeamCodes.find(code => Object.hasOwn(playerHistory, code));
      const grudgeSeasons = opposingHistoryCode ? [...new Set(playerHistory[opposingHistoryCode])] : [];
      return {
        player,
        playerHistory,
        opposingHistoryCode,
        grudgeSeasons,
        primary: opposingTeamCodes.includes(player[initialTeamColumn])
      };
    }).sort((entryA, entryB) => {
      const experienceA = Number(entryA.player[yearsExpColumn]);
      const experienceB = Number(entryB.player[yearsExpColumn]);
      return Number(entryB.primary) - Number(entryA.primary)
        || entryB.grudgeSeasons.length - entryA.grudgeSeasons.length
        || (Number.isFinite(experienceB) ? experienceB : -1) - (Number.isFinite(experienceA) ? experienceA : -1)
        || String(entryA.player[nameColumn]).localeCompare(String(entryB.player[nameColumn]));
    });
    console.log(`Sorted list of grudged players on ${currTeam}:`)
    console.log(sortedPlayers);
    for (const matchupPlayer of sortedPlayers) {
      const {player, playerHistory, opposingHistoryCode, grudgeSeasons, primary} = matchupPlayer;
      let html = "";
      const headshots = JSON.parse(player[columnNames.indexOf('headshot_url')].replace(/'/g, '"'));
      const headshotUrl = headshots[player[columnNames.indexOf('team')]];
      const grudgeHeadshotUrl = opposingHistoryCode ? headshots[opposingHistoryCode] : null;
      console.log(grudgeHeadshotUrl)
      //const headshotUrl = `https://www.pro-football-reference.com/req/20230307/images/headshots/${player[columnNames.indexOf('player_id')]}`;
      //const headshotYear = '2025';
      const name = player[columnNames.indexOf('name')];
      const position = player[columnNames.indexOf('position')];
      // if opposing team is player's original team, mark the grudge primary
      let grudgeType = 'Formerly on the ' + teams[opposingTeam]["name"];
      if (primary) {
          grudgeType = '<span><u>Started with the ' + teams[opposingTeam]["name"] + '</u></span>';
      }
      // store only relevant player team history
      let seasons = [...grudgeSeasons];
      let grudge_season_count = seasons.length
      if (seasons.length > 1) {
        seasons = seasons.join(", ");
      }
      // add emojis based on player career AV
      let playerCareerValue = "";
      //let positionRk = player[columnNames.indexOf('years_exp')];
      let positionRk = grudge_season_count
      console.log("POS RK")
      console.log(player)
      console.log(seasons)
      console.log(positionRk)
      if (positionRk >= 3) {
        if (positionRk >= 5) {
          if (positionRk >= 6) {
            if (positionRk >= 7) {
              playerCareerValue = " ⭐⭐⭐⭐";
            } else {
              playerCareerValue = " ⭐⭐⭐";
            } 
          } else {
            playerCareerValue = " ⭐⭐";
          }
        } else {
          playerCareerValue = " ⭐";
        }
      }
      // if player has no fantasy position rank, mark as 'N/A'
      if (positionRk == 0 || positionRk == null) {
        positionRk = 'N/A';
      }
      // start splicing together data with html code
      const currTeamTranslated = team_db_name_to_irl_name[currTeam] || currTeam;
      const opposingTeamTranslated = team_db_name_to_irl_name[opposingTeam] || opposingTeam;
      const headshotMarkup = headshotUrl != null
        ? `<img src="${headshotUrl}" data-hover="${grudgeHeadshotUrl}" data-normal="${headshotUrl}" alt="${name}" onerror="this.style.display='none'">`
        : '';
      if (compact) {
        const compactSeasons = getSeasonRanges(grudgeSeasons)
          .map(({start, end}) => start === end ? `${start}` : `${start}-${end}`)
          .join(', ');
        const startedWithOpponent = primary;
        const relationshipTitle = `${startedWithOpponent ? 'Started with' : 'Formerly with'} ${opposingTeamTranslated}`;
        html = `<span class="fantasy-player-photo matchup-player-photo">${headshotMarkup}</span>
          <span class="fantasy-position matchup-player-position">${position}</span>
          <div class="fantasy-player-info matchup-player-info">
            <strong>${name}</strong>
            <span title="${relationshipTitle}">${startedWithOpponent ? 'Started with opponent' : 'Formerly with opponent'}</span>
            <small title="Seasons with ${opposingTeamTranslated}: ${compactSeasons}">${compactSeasons} · ${positionRk} ${positionRk === 1 ? 'season' : 'seasons'}${playerCareerValue}</small>
          </div>`;
      } else {
        if (headshotMarkup) html += `${headshotMarkup}<br>`;
        html += `<strong style="font-size: 18px;">${name}</strong><br/>`;
        html += `${position}<br/>`;
        html += `${grudgeType}<br/>`;
        console.log(`Opposing Team: ${opposingTeam}`);
        html += `Seasons with ${opposingTeamTranslated}: ${seasons}<br/>`;
        html += `Years Spent: ${positionRk}${playerCareerValue}<br/><br/>`;
      }
      htmlList.push(html);
      console.log(`Converted ${name} player information to HTML.`);
      if (!custom) {
        if (position && position !== 'Unknown') {
          const grudge = {
            name,
            position,
            currentTeam: currTeamTranslated,
            opposingTeam: opposingTeamTranslated,
            seasons: grudgeSeasons,
            primary,
            headshotUrl
          };
          if (fantasyPositions.includes(position)) {
            fantasyGrudges.push(grudge);
          } else {
            nonFantasyGrudges.push(grudge);
          }
        }
        totalGrudges++;
      } 
    }
    console.log("Added players to table.")
    return htmlList;
  }

  /**
   * Find all players on 'currTeam' who have previously played for 'opposingTeam'.
   *
   * @param {string} currTeam - Abbreviation of the current team.
   * @param {string} opposingTeam - Abbreviation of the opposing team.
   * @returns {list[string]} - List of HTML strings representing each player.
   */
  function getGrudges(currTeam, opposingTeam, custom) {
    let grudges = [];
    const currentTeamCode = currTeam === 'LAC' ? currTeam : team_name_map[currTeam] || currTeam;
    const opposingTeamCodes = opposingTeam === 'LAC'
      ? ['LAC', team_name_map[opposingTeam]]
      : [team_name_map[opposingTeam] || opposingTeam];
    // form query
    try {
      const historyConditions = opposingTeamCodes.map(code => `instr(team_history, '${code}') > 0`).join(' OR ');
      const query = `SELECT gsis_id, name, position, team, team_history, initial_team, years_exp, headshot_url FROM players WHERE team == '${currentTeamCode}' AND
                    (${historyConditions});`;
      // const query = document.getElementById('query').value;
      document.getElementById('query').textContent = query;
      const results = db.exec(query);
      if (results.length === 0) {
        grudges.push(`<p style="font-size: 18px;">None</p>`);
      } else {
        // const output = results.map(res => {
        //   const headers = res.columns.join('\t');
        //   const rows = res.values.map(row => row.join('\t')).join('\n');
        //   return headers + '\n' + rows;
        // }).join('\n\n');
        let formattedPlayers = formatQueryData(results[0], currTeam, opposingTeam, opposingTeamCodes, true);
        for (let player of formattedPlayers) {
          grudges.push(player);
        }
      }
    } catch (err) {
      document.getElementById('results').textContent = "Error: " + err.message;
    }
    return grudges;
  }


  // If custom table, clear response area
  if (custom) {
    responseArea.innerHTML = ``;
  }

  // Update content if both options selected AND selected teams are different
  if ((aTeam && hTeam) && (aTeam != hTeam)) {
    // Create table
    console.log(`Creating table for ${aTeam} @ ${hTeam}...`);
    const customTable = document.createElement('table');
    customTable.className = "dropdown-table";
    customTable.innerHTML += `<colgroup>
                                <col>
                                <col>
                              </colgroup>`;
    
    // Create header row and add to thead
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    [{teamCode: aTeam, side: 'AWAY'}, {teamCode: hTeam, side: 'HOME'}].forEach(({teamCode, side}) => {
        const th = document.createElement('th');
        const teamName = teams[teamCode]['name'];
        th.innerHTML = `<div class="matchup-team-heading">
          <img src="https://cdn.ssref.net/req/202508011/tlogo/pfr/${teams[teamCode]['logo']}.png" alt="${teamName} logo">
          <span><small>${side}</small><strong>${teamName}</strong></span>
        </div>`;
        headerRow.appendChild(th);
    });
    // Add drop-down caret
    thead.innerHTML += `<span class="caret"></span>`;
    thead.appendChild(headerRow);

    // Add thead to table
    customTable.appendChild(thead);

    // Look for player grudges on each side
    console.log(`Away Team: ${aTeam}`);
    console.log(`Home Team: ${hTeam}`);
    let htmlCustomAwayGrudges = getGrudges(aTeam, hTeam, custom);
    let htmlCustomHomeGrudges = getGrudges(hTeam, aTeam, custom);
  
    // Create body row(s)
    const tbody = document.createElement('tbody');
    console.log(`Away rows: ${htmlCustomAwayGrudges.length}`);
    console.log(`Home rows: ${htmlCustomHomeGrudges.length}`);
    const dataRow = document.createElement('tr');
    [htmlCustomAwayGrudges, htmlCustomHomeGrudges].forEach(playerHtmlList => {
      const cell = document.createElement('td');
      if (playerHtmlList.length === 1 && playerHtmlList[0].includes('>None<')) {
        cell.className = 'matchup-empty-cell';
      }
      const playerGrid = document.createElement('div');
      playerGrid.className = `matchup-player-grid${playerHtmlList.length === 1 ? ' single-player' : ''}`;
      playerHtmlList.forEach(playerHtml => {
        const playerCard = document.createElement('div');
        const isEmpty = playerHtml.includes('>None<');
        const isPrimary = playerHtml.includes('Started with');
        playerCard.className = isEmpty
          ? 'matchup-player-empty'
          : `matchup-player-card${isPrimary ? ' primary-grudge' : ''}`;
        playerCard.innerHTML = playerHtml;
        playerGrid.appendChild(playerCard);
      });
      cell.appendChild(playerGrid);
      dataRow.appendChild(cell);
    });
    tbody.appendChild(dataRow);

    // Add body to table
    customTable.appendChild(tbody);

    // Add table to response area
    if (custom) {
      const matchupCard = document.createElement('article');
      matchupCard.className = 'matchup-card';
      matchupCard.appendChild(customTable);
      responseArea.appendChild(matchupCard);
    } else {
      responseArea.appendChild(customTable);
    }
    console.log(`Added table to document.`)

  } else {
    responseArea.innerHTML = "Please select two different teams.";
  }

  if (custom) {
    // add hover/click listeners to new custom table
    responseArea.querySelectorAll('table').forEach(table => {
      const thead = table.querySelector('thead');
      const tbody = table.querySelector('tbody');
      // START OPEN
      tbody.classList.toggle("open");
      thead.classList.toggle("open"); // flip caret
      thead.addEventListener('click', () => {
        tbody.classList.toggle("open");
        thead.classList.toggle("open"); // flip caret
      });
    });
    // add headshot image hover effect to new custom table
    responseArea.querySelectorAll("td img").forEach(img => {
      const normalSrc = img.dataset.normal || img.src;
      const hoverSrc  = img.dataset.hover;
    
      // Preload hover image
      const preload = new Image();
      preload.src = hoverSrc;
    
      // Wait until image is loaded
      img.addEventListener("load", () => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("fade-wrapper");
    
        // Clone hover image
        const hoverImg = img.cloneNode();
        hoverImg.src = hoverSrc;
        hoverImg.classList.add("hover");
    
        // Prepare normal image
        img.classList.add("normal");
        img.removeAttribute("data-hover");
        img.removeAttribute("data-normal");
    
        // Replace img with wrapper
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        wrapper.appendChild(hoverImg);
      });
    
      // If cached image already loaded, trigger load manually
      if (img.complete) {
        img.dispatchEvent(new Event("load"));
      }

    });
  }

} 

/**
 * Create table per matchup in slate.
 *
 * @param {JSON} weekSlate - all matchups in week keyed by date
 * @void
 */
function createWeekSlateTables(weekSlate) {
  console.log(`Games in week ${weekNum}:`);
  console.log(weekSlate);
  const days = Object.keys(weekSlate);
  const seasonYear = now.getFullYear();

  function getScheduledDate(day, time) {
    const dayWithoutOrdinal = day.replace(/(\d+)(st|nd|rd|th)/, '$1');
    return new Date(`${dayWithoutOrdinal}, ${seasonYear} ${time} GMT-0400`);
  }

  for (let day of days) {
      console.log(`Getting game time for ${day}...`);
      const gameStart = getScheduledDate(day, weekSlate[day][0]['time']);
      const gameEnd = new Date(gameStart.getTime() + (3.5 * 60 * 60 * 1000));
      console.log(`Game start: ${gameStart}`);
      console.log(`Game end: ${gameEnd}`);
      console.log(`Now: ${now}`);
      console.log(`Game ended? ${gameEnd < now}`);
      const upcomingMatchups = weekSlate[day].filter(matchup =>
        gameEnd > now // filter out games which started more than 3.5 hours ago
      );

      if (upcomingMatchups.length === 0) {
        continue;
      }

      // create day element
      const dayElement = document.createElement('section');
      dayElement.className = 'matchup-day';

      // update day header
      const dayHeader = document.createElement('header');
      dayHeader.className = 'matchup-day-header';
      dayHeader.innerHTML = `<h3>${day}</h3><span>${upcomingMatchups.length} ${upcomingMatchups.length === 1 ? 'game' : 'games'}</span>`;
      dayElement.appendChild(dayHeader);

      const matchups = upcomingMatchups;
      console.log("---");
      console.log("Day:");
      console.log(day);
      console.log("Matchups:");
      console.log(matchups);

      if (matchups.length === 0) {
        const noGamesHeader = document.createElement('p');
        noGamesHeader.innerHTML = '<center><br>No Games<br><br><br>';
        dayElement.appendChild(noGamesHeader);
        console.log('Successfully caught no-game day!');
      }

      for (let matchup of matchups) {
          // Store matchup variables
          const awayTeam = matchup['awayTeam'];
          const homeTeam = matchup['homeTeam'];

          const matchupCard = document.createElement('article');
          matchupCard.className = 'matchup-card';
          const matchupHeader = document.createElement('div');
          matchupHeader.className = 'matchup-game-heading';
          const divisionalLabel = teams[awayTeam]['division'] === teams[homeTeam]['division']
          ? '<span class="matchup-division">Divisional</span>'
          : '';
          matchupHeader.innerHTML = `<span class="matchup-kickoff">${matchup['time']}</span><strong>${teams[awayTeam]['name']} <span class="matchup-at">@</span> ${teams[homeTeam]['name']}</strong>${divisionalLabel}`;
          matchupCard.appendChild(matchupHeader);

          updateMatchupTable(awayTeam, homeTeam, matchupCard);
          dayElement.appendChild(matchupCard);
      }

      // Add day element to week element
      weekElement.appendChild(dayElement);
  }
  // add hover/click listeners
  document.querySelectorAll('table').forEach(table => {
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    // START WITH TABLES OPEN
    tbody.classList.toggle("open");
    thead.classList.toggle("open");
    thead.addEventListener('click', () => {
      tbody.classList.toggle("open");
      thead.classList.toggle("open"); // flip caret
    });
  });
  // add headshot image hover effect
  document.querySelectorAll("td img").forEach(img => {
    const normalSrc = img.dataset.normal || img.src;
    const hoverSrc  = img.dataset.hover;
  
    // Preload hover image
    const preload = new Image();
    preload.src = hoverSrc;
  
    // Wait until image is loaded
    img.addEventListener("load", () => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("fade-wrapper");
  
      // Clone hover image
      const hoverImg = img.cloneNode();
      hoverImg.src = hoverSrc;
      hoverImg.classList.add("hover");
  
      // Prepare normal image
      img.classList.add("normal");
      img.removeAttribute("data-hover");
      img.removeAttribute("data-normal");
  
      // Replace img with wrapper
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      wrapper.appendChild(hoverImg);
    });
  
    // If cached image already loaded, trigger load manually
    if (img.complete) {
      img.dispatchEvent(new Event("load"));
    }

  });
}

/**
 * Populate table beneath bar chart.
 * 
 * @param {string} team - NFL team abbreviation
 * @param {string} grudgeType - Primary/Secondary
 */
function showTeamDetails(team, grudgeType, queryResults) {
  const details = document.getElementById('teamDetails');
  const queryTeam = team_name_map[team] || team;

  const sortedPlayers = [...queryResults].sort((playerA, playerB) => {
    const yearsA = Number(playerA.years_exp);
    const yearsB = Number(playerB.years_exp);
    const sortableYearsA = Number.isFinite(yearsA) ? yearsA : -1;
    const sortableYearsB = Number.isFinite(yearsB) ? yearsB : -1;
    return sortableYearsB - sortableYearsA;
  });

  const playerRows = sortedPlayers.map(player => {
    let headshotUrl = '';
    let grudgeHeadshotUrl = '';
    try {
      const headshots = JSON.parse(player.headshot_url.replace(/'/g, '"'));
      headshotUrl = headshots[player['team']] || '';
      grudgeHeadshotUrl = headshots[queryTeam] || '';
    } catch (error) {
      console.warn(`Could not parse headshot for ${player.name}:`, error);
    }

    return `<tr>
              <td class="team-details-photo-cell">
                ${headshotUrl ? `<img class="team-details-photo" src="${headshotUrl}" data-hover="${grudgeHeadshotUrl}" data-normal="${headshotUrl}" alt="${player.name} headshot" onerror="this.style.display='none'">` : 'N/A'}
              </td>
              <td><strong>${player.name}</strong></td>
              <td>${player.position || 'N/A'}</td>
              <td>${player.team || 'N/A'}</td>
              <td>${player.years_exp ?? 'N/A'}</td>
            </tr>`;
  }).join('');

  details.innerHTML = `
        <h2>Active Alumni of the ${teams[team]["name"]}</h2>
        <div class="player-grid">
        <table class="team-details-table">
          <thead>
            <tr>
              <th>Headshot</th>
              <th>Player</th>
              <th>Position</th>
              <th>Current Team</th>
              <th>Years Exp.</th>
            </tr>
          </thead>
          <tbody>${playerRows || '<tr><td colspan="5">No active alumni found.</td></tr>'}</tbody>
        </table>
        </div>`;

  details.querySelectorAll('.team-details-photo').forEach(img => {
    const hoverSrc = img.dataset.hover;
    if (!hoverSrc || hoverSrc === img.src) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'fade-wrapper';
    const parent = img.parentNode;

    const hoverImg = img.cloneNode();
    hoverImg.src = hoverSrc;
    hoverImg.className = 'hover';

    img.className = 'normal';
    parent.replaceChild(wrapper, img);
    wrapper.appendChild(img);
    wrapper.appendChild(hoverImg);
  });

}

/**
 * Render active players against every team they previously played for.
 * Primary relationships are darker; experience and shape distinguish veterans.
 *
 * @param {Array<Object>} players - Active player records from the database
 * @param {Array<string>} displayTeams - Team abbreviations in chart order
 */
function renderAlumniHeatmap(players, displayTeams) {
  const heatmap = document.getElementById('alumniHeatmap');
  if (!heatmap) return;
  const teamColors = {
    ATL: ['#a71930', '#fff'], BUF: ['#00338d', '#fff'], CAR: ['#0085ca', '#fff'],
    CHI: ['#0b162a', '#fff'], CIN: ['#fb4f14', '#111'], CLE: ['#311d00', '#fff'],
    CLT: ['#002c5f', '#fff'], CRD: ['#97233f', '#fff'], DAL: ['#041e42', '#fff'],
    DEN: ['#fb4f14', '#111'], DET: ['#0076b6', '#fff'], GNB: ['#203731', '#fff'],
    HTX: ['#03202f', '#fff'], JAX: ['#006778', '#fff'], KAN: ['#e31837', '#fff'],
    LAC: ['#0080c6', '#fff'], MIA: ['#008e97', '#fff'], MIN: ['#4f2683', '#fff'],
    NE: ['#002244', '#fff'], NOR: ['#d3bc8d', '#111'], NYG: ['#0b2265', '#fff'],
    NYJ: ['#125740', '#fff'], PHI: ['#004c54', '#fff'], PIT: ['#ffb81c', '#111'],
    RAI: ['#a5acaf', '#111'], RAM: ['#003594', '#fff'], RAV: ['#241773', '#fff'],
    SEA: ['#002244', '#fff'], SFO: ['#aa0000', '#fff'], TAM: ['#d50a0a', '#fff'],
    TEN: ['#0c2340', '#fff'], WAS: ['#5a1414', '#fff']
  };
  const teamColumns = displayTeams.map(team => ({
    code: team,
    name: teams[team]?.name || team,
    databaseCode: team_name_map[team] || team,
    color: teamColors[team]?.[0] || '#333',
    textColor: teamColors[team]?.[1] || '#fff'
  }));

  const alumni = players.map(player => {
    let history = {};
    try {
      history = JSON.parse((player.team_history || '{}').replace(/'/g, '"'));
    } catch (error) {
      console.warn(`Could not parse team history for ${player.name}:`, error);
    }

    const formerTeams = new Set(Object.keys(history));
    const hasAlumniRelationship = teamColumns.some(column => formerTeams.has(column.databaseCode));
    return { ...player, history, hasAlumniRelationship };
  }).filter(player => player.hasAlumniRelationship)
    .sort((playerA, playerB) => playerA.name.localeCompare(playerB.name));

  const teamTiles = teamColumns.map(column => {
    const currentTeamPlayers = alumni.filter(player => player.team === column.databaseCode);
    const markers = currentTeamPlayers.flatMap(player => teamColumns
      .filter(formerTeam => formerTeam.databaseCode !== column.databaseCode
        && Object.prototype.hasOwnProperty.call(player.history, formerTeam.databaseCode))
      .map(formerTeam => {
      const years = Number(player.years_exp);
      const veteran = Number.isFinite(years) && years >= 5;
      const primary = player.initial_team === formerTeam.databaseCode;
      const markerShape = veteran ? 'star' : 'circle';
      const relationship = primary ? 'primary' : 'secondary';
      const label = `${player.name}: ${primary ? 'primary' : 'secondary'} alumni of ${formerTeam.name}`;
      return `<span class="alumni-player ${relationship} ${markerShape}" data-player="${player.gsis_id}" data-team="${formerTeam.code}" title="${label}" aria-label="${label}"><span>${player.name}</span></span>`;
      })).join('');

    return `<section class="alumni-team-tile" data-team="${column.code}" style="--team-color: ${column.color}; --team-text-color: ${column.textColor}">
      <div class="alumni-team-tile-header">
        <strong>${column.code}</strong>
        <span class="alumni-visible-count">0 visible</span>
      </div>
      <div class="alumni-team-players">${markers || '<span class="alumni-team-empty">No former-team links</span>'}</div>
    </section>`;
  }).join('');

  heatmap.innerHTML = `
    <div class="alumni-heatmap-heading">
      <div>
        <h3>Active Alumni Map</h3>
        <p>Each tile represents a former team. Hover a chart bar to trace its alumni across the board.</p>
      </div>
      <div class="alumni-heatmap-legend" aria-label="Heat map legend">
        <span><i class="legend-marker circle primary"></i> Primary</span>
        <span><i class="legend-marker circle secondary"></i> Secondary</span>
        <span><i class="legend-marker star primary"></i> Veteran (5+ yrs)</span>
      </div>
    </div>
    <div class="alumni-team-board">
      ${teamTiles || '<p class="alumni-heatmap-empty">No active alumni relationships found.</p>'}
    </div>`;
}

function highlightAlumniHeatmap(team) {
  const heatmap = document.getElementById('alumniHeatmap');
  if (!heatmap) return;

  const visibleTeam = team || selectedAlumniTeam;
  heatmap.querySelectorAll('.alumni-team-tile').forEach(tile => {
    tile.classList.remove('highlighted');
    tile.querySelector('.alumni-visible-count').textContent = '0 visible';
  });
  heatmap.querySelectorAll('.alumni-player').forEach(player => {
    const isSelected = Boolean(visibleTeam && player.dataset.team === visibleTeam);
    player.classList.toggle('highlighted', isSelected);
    if (isSelected) {
      player.closest('.alumni-team-tile').classList.add('highlighted');
    }
  });
  heatmap.querySelectorAll('.alumni-team-tile').forEach(tile => {
    const visibleCount = tile.querySelectorAll('.alumni-player.highlighted').length;
    tile.querySelector('.alumni-visible-count').textContent = `${visibleCount} visible`;
  });
}

// Get current week
console.log('Getting current week...')
for (let weekI in weekLengthInfo) {
  let weekStart = new Date(weekLengthInfo[weekI]['start']);
  let weekEnd = new Date(weekLengthInfo[weekI]['end']);
  console.log(`Trying week ${weekI}....`);
  console.log(`Start: ${weekStart}`);
  console.log(`End: ${weekEnd}`);
  console.log(`Current Date: ${now}`);
  if (now >= weekStart && now <= weekEnd) {
    weekNum = weekI;
    console.log(`The week number is ${weekNum}.`);
    break;
  }
  console.log("---");
}

// DEBUG
//weekNum = 1;

// Create element to contain all matchup tables
const weekElement = document.getElementById('weekSlate');

// Add week slate header
weekSlateHeader.innerHTML = `<h2 id="upcoming-week">Week ${weekNum}</h2>
                             <p style="font-size: 12px;">**All game times are in EDT.</p>`;

// Wait for all content to load
document.addEventListener('DOMContentLoaded', () => {

  // Wait for DB to load
  document.addEventListener("db-ready", () => {

    // Get current week's matchup slate from database
    const weekSlate = db.exec(`SELECT matchups FROM schedule WHERE week == '${weekNum}';`);
    const jsonWeekSlate = JSON.parse(weekSlate[0].values[0]);

    // start creating tables per matchup
    createWeekSlateTables(jsonWeekSlate);

    // Log total number of player grudge matches
    console.log(`Total number of player grudge matches in week ${weekNum}: ${totalGrudges}`);

    // Create intro block with total number of player grudge matches now counted
    let weekObj = document.getElementById('what-week-is-it');

    if (weekNum > 0) {
      const fantasyPlayers = [...fantasyGrudges].sort((playerA, playerB) =>
        Number(playerB.primary) - Number(playerA.primary)
        || playerB.seasons.length - playerA.seasons.length
        || fantasyPositions.indexOf(playerA.position) - fantasyPositions.indexOf(playerB.position)
        || playerA.name.localeCompare(playerB.name));
      const otherPositionPlayers = [...nonFantasyGrudges].sort((playerA, playerB) =>
        Number(playerB.primary) - Number(playerA.primary)
        || playerB.seasons.length - playerA.seasons.length
        || (position_order[playerA.position] ?? 999) - (position_order[playerB.position] ?? 999)
        || playerA.name.localeCompare(playerB.name));
      const fantasySection = document.getElementById('fantasyGrudgeSection');
      const fantasyList = document.getElementById('fantasyGrudgeList');
      const nonFantasySection = document.getElementById('nonFantasyGrudgeSection');
      const nonFantasyList = document.getElementById('nonFantasyGrudgeList');
      const nonFantasyToggle = document.getElementById('nonFantasyGrudgeToggle');
      const renderGrudgeCards = (players, emptyMessage) => players.length
        ? players.map(player => {
            const seasons = getSeasonRanges(player.seasons).map((range, index) => {
              const firstSeason = player.primary && index === 0
                ? `<span class="rookie-season">${range.start}</span><span class="rookie-year-note"></span>`
                : range.start;
              return `${firstSeason}${range.end > range.start ? `-${range.end}` : ''}`;
            }).join(', ');
            return `<li class="fantasy-grudge-item ${player.primary ? 'primary-grudge' : ''}">
              <span class="fantasy-player-photo">${player.headshotUrl ? `<img src="${player.headshotUrl}" alt="${player.name}" loading="lazy" onerror="this.style.display='none'">` : ''}</span>
              <span class="fantasy-position">${player.position}</span>
              <div class="fantasy-player-info"><strong>${player.name}</strong><span>${teams[player.currentTeam]?.name || player.currentTeam} vs. ${teams[player.opposingTeam]?.name || player.opposingTeam}</span><div class="fantasy-grudge-meta"><small>${player.seasons.length} ${player.seasons.length === 1 ? 'season' : 'seasons'} with opponent · ${seasons}</small>${player.primary ? `<small class="primary-origin">Started with ${teams[player.opposingTeam]?.name || player.opposingTeam}</small>` : ''}</div></div>
            </li>`;
          }).join('')
        : `<li class="fantasy-grudge-empty">${emptyMessage}</li>`;
      document.getElementById('fantasyGrudgeCount').textContent = `${fantasyPlayers.length} eligible ${fantasyPlayers.length === 1 ? 'player' : 'players'}`;
      fantasyList.innerHTML = renderGrudgeCards(fantasyPlayers, 'No QB, RB, WR, TE, or K grudge matchups this week.');
      fantasySection.hidden = false;
      document.getElementById('nonFantasyGrudgeCount').textContent = `${otherPositionPlayers.length} eligible ${otherPositionPlayers.length === 1 ? 'player' : 'players'}`;
      nonFantasyList.innerHTML = renderGrudgeCards(otherPositionPlayers, 'No other position grudge matchups this week.');
      nonFantasySection.hidden = false;
      nonFantasyToggle.hidden = otherPositionPlayers.length <= 9;
      nonFantasyToggle.textContent = `Show all ${otherPositionPlayers.length} players`;
      nonFantasyToggle.addEventListener('click', () => {
        const expanded = nonFantasyList.classList.toggle('expanded');
        nonFantasyToggle.setAttribute('aria-expanded', String(expanded));
        nonFantasyToggle.textContent = expanded ? 'Show fewer players' : `Show all ${otherPositionPlayers.length} players`;
      });
    }

    // if season has started, print the count of grudge matches in current week, else create countdown clock
    if (weekNum > 0) {
      weekObj.innerHTML = `<p>${totalGrudges}</p>`;
    }
    else {
        weekObj.innerHTML = `No, the regular season has not started yet.<br><br>
                            <div id="countdown">
                              <div id="days", style="font-size: 24px; font-weight: bold; width: fit-content; min-width: 6%; color: solid gray; padding: 16px; text-align: left; border: 2px solid gray; border-radius: 5px;">
                              </div>
                              <div id="hours", style="font-size: 24px; font-weight: bold; width: fit-content; min-width: 6%; color: solid gray; padding: 16px; text-align: left; border: 2px solid gray; border-radius: 5px;">
                              </div>
                              <div id="minutes", style="font-size: 24px; font-weight: bold; width: fit-content; min-width: 6%; color: solid gray; padding: 16px; text-align: left; border: 2px solid gray; border-radius: 5px;">
                              </div>
                              <div id="seconds", style="font-size: 24px; font-weight: bold; width: fit-content; min-width: 6%; color: solid gray; padding: 16px; text-align: left; border: 2px solid gray; border-radius: 5px;">
                              </div>
                            </div><br><br>`;
        weekNum = 1;

        // set countdown date
        const countdownDate = new Date("Sep 4, 2025 00:00:00").getTime();

        // update every second
        const timer = setInterval(() => {
          const nowTick = new Date().getTime();
          const distance = countdownDate - nowTick;

          if (distance <= 0) {
            clearInterval(timer);
            document.getElementById("countdown").innerHTML = "🎉🏈🍺 IT'S FOOTBALL SEASON!!! 🍺🏈🎉";
            return;
          }

          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          document.getElementById("days").innerHTML = `<center>` + String(days).padStart(2, '0') + `<br><hr><p style="font-size: 10px; font-weight: normal;">days`;
          document.getElementById("hours").innerHTML = `<center>` + String(hours).padStart(2, '0') + `<br><hr><p style="font-size: 10px; font-weight: normal;">hours`;
          document.getElementById("minutes").innerHTML = `<center>` + String(minutes).padStart(2, '0') + `<br><hr><p style="font-size: 10px; font-weight: normal;">minutes`;
          document.getElementById("seconds").innerHTML = `<center>` + String(seconds).padStart(2, '0') + `<br><hr><p style="font-size: 10px; font-weight: normal;">seconds`;
        }, 1000);
    }

    // Add matchup selector object
    const matchupSelector = document.getElementById("matchupSelector");

    // Set up awayTeam input box
    matchupSelector.innerHTML = `<div id="away-input-box", class="input-box">
                                <label id="awayTeam">AWAY</label><br><br>
                                <select id="awayTeamSelect" name="awayTeam">`;

    // Sort teams list for use in drop-down menu
    const sortedTeams = Object.entries(teams).map(pair => [pair[0], pair[1]['name']]).sort((a, b) => a[1].localeCompare(b[1]));

    // Add all teams for 'awayTeam' options
    const awayTeamInput = document.getElementById("awayTeamSelect");
    for (const [key, value] of sortedTeams) {
      awayTeamInput.innerHTML += `<option value="${key}">${value}</option>`;
    }
    matchupSelector.innerHTML += `</select></div>`;

    // Set up homeTeam input box
    matchupSelector.innerHTML += `<div id="home-input-box", class="input-box">
                                <label id="homeTeam">HOME</label><br><br>
                                <select id="homeTeamSelect" name="homeTeam">`;

    // Add all teams for 'homeTeam' options
    const homeTeamInput = document.getElementById("homeTeamSelect");
    for (const [key, value] of sortedTeams) {
      homeTeamInput.innerHTML += `<option value="${key}">${value}</option>`;
    }
    matchupSelector.innerHTML += `</select></div>`

    // Add logic to respond to matchup selection
    const awayTeamSelect = document.getElementById('awayTeamSelect');
    const homeTeamSelect = document.getElementById('homeTeamSelect');
    const resultingTable = document.getElementById('response-area');

    // Listen to both team select dropdowns and update resulting table upon change
    awayTeamSelect.addEventListener('change', () => {
      updateMatchupTable(awayTeamSelect.value, homeTeamSelect.value, resultingTable, true);
    });
    homeTeamSelect.addEventListener('change', () => {
      updateMatchupTable(awayTeamSelect.value, homeTeamSelect.value, resultingTable, true);
    });

    // create bar graph displaying the most grudged-against teams from highest to lowest count
    const alumniData = document.getElementById("teamAlumniData");
    const alumniQuery = `SELECT 
                          t.team AS Team,
                          COUNT(CASE WHEN p.initial_team = t.team THEN 1 END) AS PrimaryAlumni,
                          COUNT(CASE WHEN p.initial_team != t.team THEN 1 END) AS NonPrimaryAlumni
                      FROM (
                          -- get all distinct team codes
                          SELECT DISTINCT team
                          FROM players
                      ) t
                      LEFT JOIN players p
                          ON p.team != t.team
                          AND instr(p.team_history, t.team) > 0
                      GROUP BY t.team
                      ORDER BY COUNT(CASE WHEN p.initial_team = t.team THEN 1 END) + 
                              COUNT(CASE WHEN p.initial_team != t.team THEN 1 END) DESC, Team ASC;`;
    try {
      const results = db.exec(alumniQuery);
      if (results.length > 0) {
        const alumTeams = results[0].values.map(row => row[0]); // ["ATL", "BUF", ...]
        const primaryCounts = results[0].values.map(row => row[1]); // [40, 34, ...]
        const nonPrimaryCounts = results[0].values.map(row => row[2]); // [40, 34, ...]

        // translate teams as needed
        let formatted_teams = []
        for (let t of alumTeams) {
          if (t in team_db_name_to_irl_name) {
            formatted_teams.push(team_db_name_to_irl_name[t]);
          } else {
            formatted_teams.push(t);
          }
        }

        console.log(`Teams in table: ${formatted_teams}`);

        // write superlative team to header
        const full_team_name = teams[formatted_teams[0]]['name']
        document.getElementById('activeGrudgeHeader').innerHTML = `The <strong>${full_team_name}</strong> have the greatest number of active alumni at the moment.`;

        // setup bar chart colors
        const teamConferences = {
          'ATL': 'NFC', 'BUF': 'AFC', 'CAR': 'NFC', 'CHI': 'NFC', 
          'CIN': 'AFC', 'CLE': 'AFC', 'CLT': 'AFC', 'CRD': 'NFC',
          'DAL': 'NFC', 'DEN': 'AFC', 'DET': 'NFC', 'GNB': 'NFC',
          'HTX': 'AFC', 'JAX': 'AFC', 'KAN': 'AFC', 'MIA': 'AFC',
          'MIN': 'NFC', 'NOR': 'NFC', 'NE': 'AFC',  'NYG': 'NFC',
          'NYJ': 'AFC', 'TEN': 'AFC', 'PHI': 'NFC', 'PIT': 'AFC',
          'RAI': 'AFC', 'RAM': 'NFC', 'RAV': 'AFC', 'LAC': 'AFC',
          'SEA': 'NFC', 'SFO': 'NFC', 'TAM': 'NFC', 'WAS': 'NFC'
        };
        
        const colors = formatted_teams.map(team => {
          return teamConferences[team] === 'AFC' ? 'rgba(255, 99, 132, 0.6)' : 'rgba(54, 162, 235, 0.6)';
        });
        
        const borderColors = formatted_teams.map(team => {
          return teamConferences[team] === 'AFC' ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)';
        });

        // differentiate primary vs. non-primary grudges
        const primaryColors = formatted_teams.map(team => {
          return teamConferences[team] === 'AFC' ? 'rgba(205, 49, 82, 0.6)' : 'rgba(4, 92, 185, 0.6)';
        });
        
        const primaryBorderColors = formatted_teams.map(team => {
          return teamConferences[team] === 'AFC' ? 'rgba(205, 49, 82, 1)' : 'rgba(4, 92, 185, 1)';
        });
        
        
        // make bar chart
        const ctx = document.getElementById('alumniChart').getContext('2d');
        const allActiveAlumni = db.exec(`SELECT gsis_id, name, position, team, team_history, initial_team, years_exp, headshot_url FROM players;`)[0]?.values.map(row => ({
          gsis_id: row[0], name: row[1], position: row[2], team: row[3], team_history: row[4],
          initial_team: row[5], years_exp: row[6], headshot_url: row[7]
        })) || [];
        renderAlumniHeatmap(allActiveAlumni, formatted_teams);

        const alumniChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: formatted_teams,
              datasets: [{
                label: 'Started Career With Team',
                data: primaryCounts,
                backgroundColor: primaryColors,
                borderColor: primaryBorderColors,
                borderWidth: 1
              },
              {
                label: 'Did Not Start Career With Team',
                data: nonPrimaryCounts,
                backgroundColor: colors,
                borderColor: borderColors,
                borderWidth: 1
              }]
          },
          options: {
              responsive: true,

              onHover: function(event, elements) {
                const team = elements.length ? this.data.labels[elements[0].index] : null;
                highlightAlumniHeatmap(team);
                event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
              },

              onClick: async function(event, elements) {
                if (!elements.length) {
                    return;
                }

                const element = elements[0];

                // Team corresponding to the clicked bar
                const team = this.data.labels[element.index];
                selectedAlumniTeam = team;
                highlightAlumniHeatmap(team);

                // Dataset that was clicked
                const datasetIndex = element.datasetIndex;

                console.log("Clicked team:", team);
                console.log("Dataset:", datasetIndex);

                try {
                  const queryTeam = team_name_map[team] || team;

                    async function findActiveAlumni(team, datasetIndex) {
                      const teamCodes = [...new Set([team, team_db_name_to_irl_name[team] || team])];
                      const currentTeamClause = teamCodes.map(code => `team != '${code}'`).join(' AND ');
                      const historyClause = teamCodes.map(code => `instr(team_history, '${code}') > 0`).join(' OR ');

                      const activeAlumniQuery =
                        `SELECT gsis_id, name, position, team, team_history, initial_team, years_exp,
                         headshot_url FROM players WHERE ${currentTeamClause} AND
                         (${historyClause});`;
                      const results = db.exec(activeAlumniQuery);
                      if (results.length === 0) {
                        document.getElementById('results').textContent = "Query executed successfully. No rows returned.";
                      } else {
                        const output = results.map(res => {
                          const headers = res.columns.join('\t');
                          const rows = res.values.map(row => row.join('\t')).join('\n');
                          return headers + '\n' + rows;
                        }).join('\n\n');

                        document.getElementById('results').textContent = output;
                      }

                      console.log(results);
                      return results;
                    }

                    // Wait for the query to finish
                    const queryInfo = await findActiveAlumni(queryTeam, datasetIndex);
                    
                    // Unpack query results
                    const activeAlumni = queryInfo[0].values.map(row => ({
                        gsis_id: row[0],
                        name: row[1],
                        position: row[2],
                        team: row[3],
                        team_history: row[4],
                        initial_team: row[5],
                        years_exp: row[6],
                        headshot_url: row[7]
                    }));

                    console.log("Active Alumni for team:", activeAlumni);

                    // Now pass the actual results to your function
                    showTeamDetails(team, datasetIndex, activeAlumni);

                } catch (error) {
                    console.error("Error running query:", error);
                }
              },

              plugins: {
                  legend: {
                      display: false
                  },
                  tooltip: {
                      callbacks: {
                          label: function(context) {
                              return `${context.dataset.label}: ${context.parsed.y}`;
                          }
                      }
                  }
              },
              scales: {
                x: { stacked: true, title: { display: true, text: 'Team' } },
                y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Number of Active Alumni' } }
              }
          }
        });
      }
    }
    catch (err) {
      alumniData.textContent = "Error: " + err.message;
    }
    
  });
  
});
