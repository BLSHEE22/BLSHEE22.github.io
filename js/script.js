let db = null;

// Initialize SQL.js
initSqlJs({
  locateFile: file => `https://sql.js.org/dist/${file}` // Point to wasm file
}).then(async SQL => {
  // Fetch the pre-hosted .db file
  const response = await fetch('/data/players.db');
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

// import legacy data
import {teams, weekLengthInfo, playerGrudges} from './data.js';

// set default week to 1
let weekNum = 1;

// total count of grudge matches
let totalGrudges = 0;

// create div per day in matchup list
const days = Object.keys(playerGrudges);

// current date/time
const now = new Date();

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

console.log(weekLengthInfo);
console.log(Date(['start']));

// figure out what week it is
for (let week of weekLengthInfo) {
  let weekI = week['number'];
  let weekStart = new Date(week['start']);
  let weekEnd = new Date(week['end']);
  console.log(`Trying week ${weekI}....`);
  console.log(`Start: ${weekStart}`);
  console.log(`End: ${weekEnd}`);
  console.log(`Current Date: ${now}`);
  if (now >= weekStart && now <= weekEnd) {
    weekNum = week['number'];
    console.log(`The week number is ${weekNum}.`);
    break;
  }
  console.log("---");
}

// create element to contain all matchups for the current week
const weekElement = document.getElementById('weekSlate');

for (let day of days) {
    // create day element
    const dayAbbr = day.slice(0, 3);
    const dayElement = document.createElement(dayAbbr);

    // update day header
    const dayHeader = document.createElement(dayAbbr + "Header");
    dayHeader.innerHTML = `<h3><center>${day}`;
    dayElement.appendChild(dayHeader);

    const matchups = playerGrudges[day];
    console.log("---");
    console.log(day)
    console.log(matchups);
    console.log('---');

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
        // Create matchup header
        const matchupHeader = document.createElement('p');
        let htmlString = `<center><strong>${matchup['time']} - ${teams[awayTeam]['name']} @ ${teams[homeTeam]['name']}</strong>`;
        if (teams[awayTeam]['division'] == teams[homeTeam]['division']) {
            htmlString += '<br>Divisional Matchup';
        }
        // Add inner html to header object
        matchupHeader.innerHTML = htmlString + '<br>';
        // Add header object to DOM
        dayElement.appendChild(matchupHeader);

        // Create table
        const matchupTable = document.createElement('table');

        // Header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        [`<img src="https://cdn.ssref.net/req/202508011/tlogo/pfr/${teams[awayTeam]['logo']}.png", width="50", height="50", alt=" ">`,
         `<img src="https://cdn.ssref.net/req/202508011/tlogo/pfr/${teams[homeTeam]['logo']}.png", width="50", height="50", alt=" ">`].forEach(html => {
            const th = document.createElement('th');
            th.innerHTML = html;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // inject grudge information into HTML code to display in table
        function injectGrudgeData(grudges, currTeam, grudgeTeam) {
          let htmlGrudges = [];
          for (let grudge of grudges) {
            let html = "";
            const headshotUrl = grudge['headshotUrl'];
            const name = grudge['name'];
            const position = grudge['position'];
            const grudgeType = grudge['grudgeType'];
            const seasons = grudge['seasons'];
            const positionRk = grudge['positionRk'];
            if (headshotUrl != 'None') {
                html += `<img src="${headshotUrl}", width="74", height="110", alt=" "><br/>`;
            }
            html += `<strong style="font-size: 18px;">${name} (${position}, ${currTeam})</strong><br/>`;
            html += `${grudgeType}<br/>`;
            html += `Seasons with ${grudgeTeam}: ${seasons}<br/>`;
            html += `Fantasy Position Rank: ${positionRk}<br/><br/>`;
            htmlGrudges.push(html);
            console.log(`Converted ${name} player information to HTML.`);
            totalGrudges++;
          }
          return htmlGrudges;
        }

        // form HTML
        let htmlAwayGrudges = injectGrudgeData(matchup['awayGrudges'], awayTeam, homeTeam);
        let htmlHomeGrudges = injectGrudgeData(matchup['homeGrudges'], homeTeam, awayTeam);
      
        // if no grudge data, append 'none' text
        if (htmlAwayGrudges.length === 0) {
          htmlAwayGrudges.push(`<p style="font-size: 18px;">None</p>`);
        }
        if (htmlHomeGrudges.length === 0) {
          htmlHomeGrudges.push(`<p style="font-size: 18px;">None</p>`);
        }
        console.log(`Finished HTML for away grudges (length: ${htmlAwayGrudges.length}}): ${htmlAwayGrudges}`);
        console.log(`Finished HTML for home grudges (length: ${htmlHomeGrudges.length}}): ${htmlHomeGrudges}`);

        // Body row(s)
        const tbody = document.createElement('tbody');
        for (let i = 0; i < Math.max(htmlAwayGrudges.length, htmlHomeGrudges.length); i++) {
          const dataRow = document.createElement('tr');

          // Add away team data to left column
          const td1 = document.createElement('td');
          if (i < htmlAwayGrudges.length) {
            td1.innerHTML = htmlAwayGrudges[i];
          } else {
            td1.innerHTML = '';
          }
          td1.style.fontSize = '12px'
          dataRow.appendChild(td1);

          // Add home team data to right column
          const td2 = document.createElement('td');
          if (i < htmlHomeGrudges.length) {
            td2.innerHTML = htmlHomeGrudges[i];
          } else {
            td2.innerHTML = '';
          }
          td2.style.fontSize = '12px'
          dataRow.appendChild(td2);
          
          // Append row to body
          tbody.appendChild(dataRow);
        }

        // Assemble table
        matchupTable.appendChild(thead);
        matchupTable.appendChild(tbody);
        dayElement.appendChild(matchupTable); 

        // Add spacing after table
        let postTableBr = document.createElement('br');
        let postTableBr2 = document.createElement('br');
        dayElement.appendChild(postTableBr);
        dayElement.appendChild(postTableBr2);

    }

    // Add spacing after day
    let postDayBr = document.createElement('br');
    let postDayBr2 = document.createElement('br');
    dayElement.appendChild(postDayBr);
    dayElement.appendChild(postDayBr2);

    // Add day element to week element
    weekElement.appendChild(dayElement);
}

// Log total number of player grudge matches
console.log(`Total number of player grudge matches in week ${weekNum}: ${totalGrudges}`);

// Create intro block with total number of player grudge matches now counted
let weekObj = document.getElementById('what-week-is-it');
let weekObjHeader = document.getElementById('weekSlateHeader');

if (weekNum > 0) {
    weekObj.innerHTML = `
      <p>Yes, there are <strong>${totalGrudges}</strong> grudge matches taking place in <a href=#upcoming-week> week ${weekNum}</a>.</p>`;
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
console.log(sortedTeams);

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
const responseArea = document.getElementById('response-area');

// Update custom matchup table
function updateResponse() {
  // clear response area
  responseArea.innerHTML = ``;

  const aTeam = awayTeamSelect.value;
  const hTeam = homeTeamSelect.value;

  // Update content if both options selected AND selected teams are different
  if ((aTeam && hTeam) && (aTeam != hTeam)) {
    // Create table
    const customTable = document.createElement('table');

    // Create header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    [`<img src="https://cdn.ssref.net/req/202508011/tlogo/pfr/${teams[aTeam]['logo']}.png", width="50", height="50", alt=" ">`,
     `<img src="https://cdn.ssref.net/req/202508011/tlogo/pfr/${teams[hTeam]['logo']}.png", width="50", height="50", alt=" ">`].forEach(html => {
        const th = document.createElement('th');
        th.innerHTML = html;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Add head to table
    customTable.appendChild(thead);

    /**
     * Format query information into HTML code to be displayed in a table.
     *
     * @param {dict} result - Resulting data from query.
     * @param {string} currTeam - Abbreviation of the past team.
     * @param {string} opposingTeam - Abbreviation of the opposing team.
     * @returns {list[string]} - List of HTML strings representing each player.
     */
    function formatQueryData(result, currTeam, opposingTeam) {
      let htmlList = [];
      const columnNames = result['columns'];
      const players = result['values'];
      const sortedPlayers = players.sort((a, b) => position_order[a[2].trim()] - position_order[b[2].trim()]);
      console.log(sortedPlayers);
      for (let player of sortedPlayers) {
        let html = "";
        const headshotUrl = player[columnNames.indexOf('headshot_url')];
        const name = player[columnNames.indexOf('name')];
        const position = player[columnNames.indexOf('position')];
        // if opposing team is player's original team, mark the grudge primary
        let grudgeType = 'Grudge';
        if (player[columnNames.indexOf('initial_team')] == opposingTeam) {
            grudgeType = 'Primary Grudge';
        }
        // store only relevant player team history
        let seasons = JSON.parse(player[columnNames.indexOf('team_history')].replace(/'/g, '"'))[opposingTeam];
        if (seasons.length > 1) {
          seasons = seasons.join(", ");
        }
        console.log(seasons)
        // if player has no fantasy position rank, mark as 'N/A'
        let positionRk = player[columnNames.indexOf('fantasy_pos_rk')];
        if (positionRk == null) {
          positionRk = 'N/A';
        }
        // start splicing together data with html code
        if (headshotUrl != null) {
            html += `<img src="${headshotUrl}", width="74", height="110", alt=" "><br/>`;
        }
        html += `<strong style="font-size: 18px;">${name} (${position}, ${currTeam})</strong><br/>`;
        html += `${grudgeType}<br/>`;
        html += `Seasons with ${opposingTeam}: ${seasons}<br/>`;
        html += `Fantasy Position Rank: ${positionRk}<br/><br/>`;
        htmlList.push(html);
        console.log(`Converted ${name} player information to HTML.`);
      }
      return htmlList;
    }

    /**
     * Find all players on 'currTeam' who have previously played for 'opposingTeam'.
     *
     * @param {string} currTeam - Abbreviation of the current team.
     * @param {string} opposingTeam - Abbreviation of the opposing team.
     * @returns {list[string]} - List of HTML strings representing each player.
     */
    function getGrudges(currTeam, opposingTeam) {
      let grudges = [];
      // translate teams if needed
      const team_name_map = {'LAC': 'SDG',
                             'TEN': 'OTI',
                             'NE':  'NWE'};
      if (currTeam in team_name_map) {
          currTeam = team_name_map[currTeam];
      }
      if (opposingTeam in team_name_map) {
        opposingTeam = team_name_map[opposingTeam];
      }
      // form query
      try {
        const query = `SELECT player_id, name, position, team, team_history, initial_team, 
                      fantasy_pos_rk, headshot_url FROM players WHERE team == '${currTeam}' AND 
                      instr(team_history, '${opposingTeam}') > 0;`;
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
          let formattedPlayers = formatQueryData(results[0], currTeam, opposingTeam);
          for (let player of formattedPlayers) {
            grudges.push(player);
          }
        }
      } catch (err) {
        document.getElementById('results').textContent = "Error: " + err.message;
      }
      return grudges;
    }

    // once matchup is set, look for player grudges on each side
    let htmlCustomAwayGrudges = getGrudges(aTeam, hTeam);
    let htmlCustomHomeGrudges = getGrudges(hTeam, aTeam);
  
    // Create body row(s)
    const tbody = document.createElement('tbody');
    for (let i = 0; i < Math.max(htmlCustomAwayGrudges.length, htmlCustomHomeGrudges.length); i++) {
      const dataRow = document.createElement('tr');

      // Add away team data to left column
      const td1 = document.createElement('td');
      if (i < htmlCustomAwayGrudges.length) {
        td1.innerHTML = htmlCustomAwayGrudges[i];
      } else {
        td1.innerHTML = '';
      }
      td1.style.fontSize = '12px'
      dataRow.appendChild(td1);

      // Add home team data to right column
      const td2 = document.createElement('td');
      if (i < htmlCustomHomeGrudges.length) {
        td2.innerHTML = htmlCustomHomeGrudges[i];
      } else {
        td2.innerHTML = '';
      }
      td2.style.fontSize = '12px'
      dataRow.appendChild(td2);
      
      // Append row to body
      tbody.appendChild(dataRow);
    }

    // Add body to table
    customTable.appendChild(tbody);

    // Add table to response area
    responseArea.appendChild(customTable);

  } else {
    responseArea.innerHTML = "Please select two different teams.";
  }

  // Listen to custom matchup table
  responseArea.querySelectorAll('table').forEach(table => {
    table.addEventListener('click', () => {
      const tbody = table.querySelector('tbody');
      tbody.classList.toggle('open');
    });
  });
}

// Listen to both dropdowns
awayTeamSelect.addEventListener('change', updateResponse);
homeTeamSelect.addEventListener('change', updateResponse);

// Add week slate header
weekSlateHeader.innerHTML = `<h2 id="upcoming-week">Week ${weekNum}</h2>
                             <p style="font-size: 12px;">**All game times are in EDT.</p>`;

// wait for all content to load
document.addEventListener('DOMContentLoaded', () => {

  // Add query results to grudge statistics element
  document.addEventListener("db-ready", () => {
    const alumniData = document.getElementById("teamAlumniData");
    const alumniQuery = `SELECT 
                            t.team AS Team,
                            COUNT(p.id) AS AlumniCount
                          FROM (
                            -- first, get all distinct team codes
                            SELECT DISTINCT team 
                            FROM players
                          ) t
                          LEFT JOIN players p
                            ON p.team != t.team
                            AND instr(p.team_history, t.team) > 0
                          GROUP BY t.team
                          ORDER BY t.team;
                          `;
    try {
      const results = db.exec(alumniQuery);
      console.log(results);
      if (results.length > 0) {
        alumniData.innerHTML = results[0].values;
      }
    }
    catch (err) {
      alumniData.innerHTML = "Error: " + err.message;
    }
  });

  // add hover/click logic to each matchup table
  document.querySelectorAll('table').forEach(table => {
    table.addEventListener('click', () => {
      const tbody = table.querySelector('tbody');
      tbody.classList.toggle('open');
    });
  });
});
