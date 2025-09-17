import {teams, weekLengthInfo} from './data.js';

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

// set default week to 1
let weekNum = 1;

// total count of grudge matches
let totalGrudges = 0;

// list of all notable (career AV >= 30) grudge matches in current week
let notableGrudges = [];

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
  function formatQueryData(result, currTeam, opposingTeam) {
    let htmlList = [];
    const columnNames = result['columns'];
    const players = result['values'];
    // sort by career av instead of position!
    //const sortedPlayers = players.sort((a, b) => position_order[a[2].trim()] - position_order[b[2].trim()]);
    const sortedPlayers = players.sort((a, b) => b[6] - a[6]);
    console.log(`Sorted list of grudged players on ${currTeam}:`)
    console.log(sortedPlayers);
    for (let player of sortedPlayers) {
      let html = "";
      //const headshotUrl = player[columnNames.indexOf('headshot_url')];
      const headshotUrl = `https://www.pro-football-reference.com/req/20230307/images/headshots/${player[columnNames.indexOf('player_id')]}`;
      const headshotYear = '2025';
      const name = player[columnNames.indexOf('name')];
      const position = player[columnNames.indexOf('position')];
      // if opposing team is player's original team, mark the grudge primary
      let grudgeType = 'Secondary Grudge';
      if (player[columnNames.indexOf('initial_team')] == opposingTeam) {
          grudgeType = '<span><u>Primary Grudge</u></span>';
      }
      // store only relevant player team history
      let seasons = JSON.parse(player[columnNames.indexOf('team_history')].replace(/'/g, '"'))[opposingTeam];
      if (seasons.length > 1) {
        seasons = seasons.join(", ");
      }
      // add emojis based on player career AV
      let playerCareerValue = "";
      let positionRk = player[columnNames.indexOf('fantasy_pos_rk')];
      if (positionRk >= 30) {
        if (positionRk >= 50) {
          if (positionRk >= 75) {
            if (positionRk >= 100) {
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
      if (positionRk == null) {
        positionRk = 'N/A';
      }
      // start splicing together data with html code
      if (headshotUrl != null) {
        const first_grudge_season = seasons.slice(0, 4);
        html += `<img src="${headshotUrl}_${headshotYear}.jpg", 
                    data-hover="${headshotUrl}_${first_grudge_season}.jpg",
                    data-normal="${headshotUrl}_${headshotYear}.jpg",
                    width="74",
                    height="110",
                    alt="",
                    onerror="this.style.display='none'">
                 <br>`;
      }
      html += `<strong style="font-size: 18px;">${name}</strong><br/>`;
      html += `${position}<br/>`;
      html += `${grudgeType}<br/>`;
      console.log(`Opposing Team: ${opposingTeam}`);
      let currTeamTranslated = currTeam;
      if (['SDG', 'OTI', 'NWE'].includes(currTeam)) {
        currTeamTranslated = team_db_name_to_irl_name[currTeam];
      }
      let opposingTeamTranslated = opposingTeam;
      if (['SDG', 'OTI', 'NWE'].includes(opposingTeam)) {
        opposingTeamTranslated = team_db_name_to_irl_name[opposingTeam];
      }
      html += `Seasons with ${opposingTeamTranslated}: ${seasons}<br/>`;
      html += `Career AV: ${positionRk}${playerCareerValue}<br/><br/>`;
      htmlList.push(html);
      console.log(`Converted ${name} player information to HTML.`);
      if (!custom) {
        if (positionRk != 'N/A') {
          let numericPositionRk = parseInt(positionRk, 10);
          // if player career AV >= 30, add to notable grudges
          if (numericPositionRk >= 30) {
            const notableGrudgeObj = [[name, playerCareerValue, position, currTeamTranslated, opposingTeamTranslated], numericPositionRk]
            notableGrudges.push(notableGrudgeObj);
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
        let formattedPlayers = formatQueryData(results[0], currTeam, opposingTeam, custom);
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
    [`<img src="https://cdn.ssref.net/req/202508011/tlogo/pfr/${teams[aTeam]['logo']}.png", width="50", height="50", alt="">`,
     `<img src="https://cdn.ssref.net/req/202508011/tlogo/pfr/${teams[hTeam]['logo']}.png", width="50", height="50", alt="">`].forEach(html => {
        const th = document.createElement('th');
        th.innerHTML = html;
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
    for (let i = 0; i < Math.max(htmlCustomAwayGrudges.length, htmlCustomHomeGrudges.length); i++) {
      const dataRow = document.createElement('tr');

      // Add away team data to left column
      const td1 = document.createElement('td');
      const pulseBox1 = document.createElement('div');
      if (i < htmlCustomAwayGrudges.length) {
        const htmlToAdd = htmlCustomAwayGrudges[i];
        pulseBox1.innerHTML = htmlToAdd;
        if (!htmlToAdd.includes('>None<')) {
          if (htmlToAdd.includes('Primary Grudge')) {
            // td1.className = "primary-cell";
            pulseBox1.className = "pulse-box-primary";
          } else {
            // td1.className = "secondary-cell"
            pulseBox1.className = "pulse-box-secondary";
          }
        }
      } else {
        pulseBox1.innerHTML = '';
      }
      td1.style.fontSize = '12px';
      td1.appendChild(pulseBox1);
      dataRow.appendChild(td1);

      // Add home team data to right column
      const td2 = document.createElement('td');
      const pulseBox2 = document.createElement('div')
      if (i < htmlCustomHomeGrudges.length) {
        const htmlToAdd = htmlCustomHomeGrudges[i];
        pulseBox2.innerHTML = htmlToAdd;
        if (!htmlToAdd.includes('>None<')) {
          if (htmlToAdd.includes('Primary Grudge')) {
            // td2.className = "primary-cell";
            pulseBox2.className = "pulse-box-primary";
          } else {
            // td2.className = "secondary-cell";
            pulseBox2.className = "pulse-box-secondary";
          }
        }
      } else {
        pulseBox2.innerHTML = '';
      }
      td2.style.fontSize = '12px';
      td2.appendChild(pulseBox2);
      dataRow.appendChild(td2);
      
      // Append row to body
      tbody.appendChild(dataRow);
    }

    // Add body to table
    customTable.appendChild(tbody);

    // Add table to response area
    responseArea.appendChild(customTable);
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
  for (let day of days) {
      // create day element
      const dayAbbr = day.slice(0, 3);
      const dayElement = document.createElement(dayAbbr);

      // update day header
      const dayHeader = document.createElement(dayAbbr + "Header");
      dayHeader.innerHTML = `<h3><center>${day}`;
      dayElement.appendChild(dayHeader);

      const matchups = weekSlate[day];
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

          // Create table and add to element
          updateMatchupTable(awayTeam, homeTeam, dayElement); 

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

    // if season has started, print the count of grudge matches in current week, else create countdown clock
    if (weekNum > 0) {
        let notableContent = `
          <p>There are ${totalGrudges} grudge matches taking place in <a href=#upcoming-week> week ${weekNum}</a>, most notably:</p><ol>`;
          notableGrudges = notableGrudges.sort((a, b) => b[1] - a[1]);
          // maximum of 10 notable players
          if (notableGrudges.length > 10) {
            notableGrudges = notableGrudges.slice(0, 10);
          }
          for (let grudgeObj of notableGrudges) {
            // unpack content
            const grudgeContent = grudgeObj[0];
            const name = grudgeContent[0];
            const playerCareerValue = grudgeContent[1];
            const position = grudgeContent[2];
            let currTeam = grudgeContent[3];
            let opposingTeam = grudgeContent[4];
            notableContent += `<li><strong>${name}${playerCareerValue}</strong> (${position}, ${currTeam}) against the ${teams[opposingTeam]['name']}</li><br>`;
          }
          notableContent += `</ol>`;
          weekObj.innerHTML += notableContent;
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
        document.getElementById('activeGrudgeHeader').innerHTML = `The <strong>${full_team_name}</strong> are the most grudged team among active players this season.`;

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
        const alumniChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: formatted_teams,
              datasets: [{
                label: 'Primary Grudges',
                data: primaryCounts,
                backgroundColor: primaryColors,
                borderColor: primaryBorderColors,
                borderWidth: 1
              },
              {
                label: 'Secondary Grudges',
                data: nonPrimaryCounts,
                backgroundColor: colors,
                borderColor: borderColors,
                borderWidth: 1
              }]
          },
          options: {
              responsive: true,
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
                y: { stacked: true, beginAtZero: true, title: { display: true, text: 'Number of Grudges Against' } }
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
