const teams = {'DAL':{'name': 'Dallas Cowboys',
                      'logo': 'dal-2025',
                      'division': 'NFC East'},
              'PHI':{'name': 'Philadelphia Eagles',
                     'logo': 'phi-2025',
                     'division': 'NFC East'},
              'KAN':{'name': 'Kansas City Chiefs',
                      'logo': 'kan-2025',
                      'division': 'AFC West'},
              'LAC':{'name': 'Los Angeles Chargers',
                      'logo': 'sdg-2025',
                      'division': 'AFC West'},
              'TAM':{'name': 'Tampa Bay Buccaneers',
                      'logo': 'tam-2025',
                      'division': 'NFC South'},
              'ATL':{'name': 'Atlanta Falcons',
                      'logo': 'atl-2025',
                      'division': 'NFC South'},
              'MIN':{'name': 'Minnesota Vikings',
                      'logo': 'min-2025',
                      'division': 'NFC North'},
              'CHI':{'name': 'Chicago Bears',
                      'logo': 'chi-2025',
                      'division': 'NFC North'}};

// import { weekByWeekInfo } from './data.js';
let week = 1;
let totalGrudges = 0;
const days = ['thursday', 'friday', 'saturday', 'sunday', 'monday'];
// TEMP DB vvvv
const db = {
    'thursday': [{
        'time': '8:20 PM',
        'awayTeam': 'DAL',
        'homeTeam': 'PHI',
        'awayGrudges': [{'urlName': 'SandMi01_2025',
                         'name': 'Miles Sanders',
                         'position': 'RB',
                         'grudgeType': 'Primary Grudge',
                         'seasons': '2019-2022',
                         'positionRk': '59'
                        }, 
                        {'urlName': 'CampPa00_2024',
                         'name': 'Parris Campbell',
                         'position': 'WR',
                         'grudgeType': 'Grudge',
                         'seasons': '2024',
                         'positionRk': '153'
                        }],
        'homeGrudges': []
    }],
    'friday': [{
        'time': '8:00 PM',
        'awayTeam': 'KAN',
        'homeTeam': 'LAC',
        'awayGrudges': [{'urlName': 'TillJe00_2025',
                         'name': 'Jerry Tillery',
                         'position': 'DL',
                         'grudgeType': 'Primary Grudge',
                         'seasons': '2019-2022',
                         'positionRk': 'N/A'
                        },
                        {'urlName': 'ChriCo00_2025',
                         'name': 'Cole Christiansen',
                         'position': 'LB',
                         'grudgeType': 'Primary Grudge',
                         'seasons': '2020-2021',
                         'positionRk': 'N/A'
                        },
                        {'urlName': 'TranDr00_2025',
                         'name': 'Drue Tranquill',
                         'position': 'LB',
                         'grudgeType': 'Primary Grudge',
                         'seasons': '2019-2022',
                         'positionRk': 'N/A'
                        },
                        {'urlName': 'FultKr00_2025',
                         'name': 'Kristian Fulton',
                         'position': 'CB',
                         'grudgeType': 'Grudge',
                         'seasons': '2024',
                         'positionRk': 'N/A'
                        }],
        'homeGrudges': []
    }],
    'saturday': [],
    'sunday': [{
        'time': '1:00 PM',
        'awayTeam': 'TAM',
        'homeTeam': 'ATL',
        'awayGrudges': [],
        'homeGrudges': [{'urlName': 'PiniBr00_2025',
                         'name': 'Bradley Pinion',
                         'position': 'P',
                         'grudgeType': 'Grudge',
                         'seasons': '2019-2021',
                         'positionRk': 'N/A'
                        }]
    }],
    'monday': [{
        'time': '8:15 PM',
        'awayTeam': 'MIN',
        'homeTeam': 'CHI',
        'awayGrudges': [],
        'homeGrudges': []
    }]
};
// TEMP DB ^^^
// const awayGrudges = ['a', 'b'];
const homeGrudges = [];
const startDate = new Date('2025-08-01');
const endDate = new Date('2025-09-02');
const now = new Date();

let weekObj = document.getElementById('what-week-is-it');

if (now >= startDate && now <= endDate) {
    weekObj.innerHTML = `
      <p>Yes, there are <strong>22</strong> grudge matches taking place in <a href=#upcoming-week> week ${week}</a>.</p>
      <br><hr style="height: 15px; background-color: solidgray;">
      <h2 id="upcoming-week">Week ${week}</h2>
      <p style="font-size: 12px;">**All game times are in EDT.</p>
    `;
}
else {
    weekObj.getElementById('what-week-is-it').innerHTML = `No, the regular season has not started yet.`;
}

// for (let week of weekByWeekInfo.keys()) {
//     if (now >= startDate && now <= endDate) {
//         document.getElementById('what-week-is-it').innerHTML = `${week}`;
//         //document.getElementById('what-week-is-it').innerHTML = `<p>Yes, there are <strong>${games.length}</strong> grudge matches taking place in <a href=#upcoming-week>${week}</a>.</p>`;
//         break;
//     }
//     else {
//         document.getElementById('what-week-is-it').innerHTML = `No, the regular season has not started yet.`;
//     }
// }

// for (let week of weeks) {
//   if (isDateWithinRange(week['start'], week['end']) {
//       document.getElementById('what-week-is-it').innerHTML = `<p>Yes, there are <strong>${games.length}</strong> grudge matches taking place in <a href=#upcoming-week>week ${week['number']}</a></p>`;
//       break;
//   }
//   else {
//       document.getElementById('what-week-is-it').innerHTML = `No, the regular season has not started yet.`;
//   }
// }

for (let day of days) {
    const parentElement = document.getElementById(day);
    if (!parentElement) continue; // Skip if the element is not found

    // Update day header
    const dayHeader = document.getElementById(day + 'Header');
    if (dayHeader) {
        dayHeader.innerHTML = `<center>${day.charAt(0).toUpperCase() + day.slice(1)}`; // Capitalize day name
    }

    const matchups = db[day];
    console.log("---");
    console.log(day)
    console.log(matchups);
    console.log('---');

    if (matchups.length === 0) {
      const noGamesHeader = document.createElement('p');
      noGamesHeader.innerHTML = '<center><br>No Games<br><br><br>';
      parentElement.appendChild(noGamesHeader);
      console.log('Successfully caught no-game day!');
    }

    for (let matchup of matchups) {
        // Store matchup variables
        const awayTeam = matchup['awayTeam'];
        const homeTeam = matchup['homeTeam'];
        // Create matchup header
        const matchupHeader = document.createElement('p');
        let htmlString = `<center><strong>${teams[awayTeam]['name']} @ ${teams[homeTeam]['name']}</strong>`;
        if (teams[awayTeam]['division'] == teams[homeTeam]['division']) {
            htmlString += '<br>Divisional Matchup';
        }
        // Add inner html to header object
        matchupHeader.innerHTML = htmlString + '<br>';
        // Add header object to DOM
        parentElement.appendChild(matchupHeader);

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
            const urlName = grudge['urlName'];
            const name = grudge['name'];
            const position = grudge['position'];
            const grudgeType = grudge['grudgeType'];
            const seasons = grudge['seasons'];
            const positionRk = grudge['positionRk'];
            htmlGrudges.push(`<img src="https://www.pro-football-reference.com/req/20230307/images/headshots/${urlName}.jpg", width="74", height="110", alt=" "><br/><strong style="font-size: 18px;">${name} (${position}, ${currTeam})</strong><br/>${grudgeType}<br/>Seasons with ${grudgeTeam}: ${seasons}<br/>Fantasy Position Rank: ${positionRk}<br/><br/>`);
            console.log(`Pushed item onto HTML list.`);
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
            td2.innerHTML = '';
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
        parentElement.appendChild(matchupTable);  

    }
}

// Log total number of grudges
console.log(`Total number of grudges in week ${week}: ${totalGrudges}`);

// Add event listeners for all tables
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('table').forEach(table => {
    table.addEventListener('click', () => {
      const tbody = table.querySelector('tbody');
      tbody.classList.toggle('open');
    });
  });
});
