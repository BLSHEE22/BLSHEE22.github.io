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
                      'division': 'NFC South'}};

// import { weekByWeekInfo } from './data.js';

// function updateClock() {
//     const now = new Date(); // Get current date and time

//     // Format the date
//     const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//     const dateString = now.toLocaleDateString('en-US', options);

//     // Format the time
//     const timeString = now.toLocaleTimeString('en-US');

//     // Combine and update the HTML element
//     document.getElementById('clock').innerHTML = `${dateString} - ${timeString}`;
// }

// Call updateClock initially to display the time immediately
//updateClock();

// Update the clock every second
//setInterval(updateClock, 1000);

// function isDateInRange(startDate, endDate) {
//   // Ensure all inputs are Date objects
//   const dateToCheck = new Date();
//   const start = new Date(startDate);
//   const end = new Date(endDate);

//   // Compare the dates
//   return dateToCheck >= start && checkDate <= end;
// }

// export const weekByWeekInfo = {1:{'thursday':{'date':'Thursday, September 4th',
//                                           'matchups':[{'header':'Dallas Cowboys @ Philadelphia Eagles',
//                                                        'divisional': true,
//                                                        'awayGrudges':[{'name':'Miles Sanders',
//                                                                        'position':'RB',
//                                                                        'grudgeType':'Primary Grudge',                                                  
//                                                                        'seasons':'2019-2022',
//                                                                        'positionRk':'59'},
//                                                                       {'name':'Parris Campbell',
//                                                                        'grudgeType':'Grudge',   
//                                                                        'seasons': '2024',                                                                
//                                                                        'positionRk':'153'}]',
//                                                        'homeGrudges':['None'],
//                                                      }]
//                                           }
//                               }
//                            };
let week = 1;
const days = ['thursday', 'friday', 'saturday', 'sunday', 'monday'];
// TEMP DB vvvv
const db = {
    'thursday': [{
        'awayTeam': 'DAL',
        'homeTeam': 'PHI',
        'awayGrudges': ['away1', 'away2', 'away3'],
        'homeGrudges': ['home1', 'home2']
    }],
    'friday': [{
        'awayTeam': 'KAN',
        'homeTeam': 'LAC',
        'awayGrudges': [],
        'homeGrudges': []
    }],
    'saturday': [],
    'sunday': [{
        'awayTeam': 'TAM',
        'homeTeam': 'ATL',
        'awayGrudges': [],
        'homeGrudges': []
    }],
    'monday': [{
        'awayTeam': 'MIN',
        'homeTeam': 'CHI',
        'awayGrudges': [],
        'homeGrudges': []
    }]
};
// TEMP DB ^^^
const awayGrudges = ['a', 'b'];
const homeGrudges = [];
const startDate = new Date('2025-08-01');
const endDate = new Date('2025-09-02');
const now = new Date();

let weekObj = document.getElementById('what-week-is-it');

if (now >= startDate && now <= endDate) {
    weekObj.innerHTML = `
      <p>Yes, there are <strong>22</strong> grudge matches taking place in <a href=#upcoming-week> week ${week}</a>.</p>
      <br><hr style="height: 15px; background-color: solidgray;">
      <h2 id="upcoming-week">Week 1</h2>
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
        dayHeader.innerHTML = day.charAt(0).toUpperCase() + day.slice(1); // Capitalize day name
        dayHeader.addEventListener('click', () => {
            alert(`${day} header clicked!`);
        });
    }

    const matchups = db[day];
    console.log("---");
    console.log(day)
    console.log(matchups);
    console.log('---');

    if (matchups.length === 0) {
      const noGamesHeader = document.createElement('p');
      noGamesHeader.innerHTML = '<center>No Games';
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

        // ADD LOOP LOGIC HERE

        // equal length lists
        let htmlAwayGrudges = [`<img src="https://www.pro-football-reference.com/req/20230307/images/headshots/SandMi01_2025.jpg", width="74", height="110", alt=" "><br/><strong style="font-size: 18px;">Miles Sanders (RB, DAL)</strong><br/>Primary Grudge<br/>Seasons with PHI: 2019-2022<br/>Fantasy Position Rank: 59<br/><br/>`,
                               `<img src="https://www.pro-football-reference.com/req/20230307/images/headshots/CampPa00_2024.jpg", width="74", height="110", alt=" "><br/><strong style="font-size: 18px;">Parris Campbell (WR, DAL)</strong><br/>Grudge<br/>Seasons with PHI: 2024<br/>Fantasy Position Rank: 153<br/><br/>`];
        let htmlHomeGrudges = [`<p style="font-size: 18px;">None</p>`, ''];

        // Body row(s)
        const tbody = document.createElement('tbody');
        for (let i = 0; i < htmlAwayGrudges.length; i++) {
          const dataRow = document.createElement('tr');

          // Add away team data to left column
          const td1 = document.createElement('td');
          td1.innerHTML = htmlAwayGrudges[i];
          td1.style.fontSize = '12px'
          dataRow.appendChild(td1);

          // Add home team data to right column
          const td2 = document.createElement('td');
          td2.innerHTML = htmlHomeGrudges[i];
          td2.style.fontSize = '12px'
          dataRow.appendChild(td2);
          
          // Append row to body
          tbody.appendChild(dataRow);
        }

        // Assemble table
        matchupTable.appendChild(thead);
        matchupTable.appendChild(tbody);
        parentElement.appendChild(matchupTable);

        // Add event listener for table
        document.querySelectorAll('table').forEach(table => {
          table.addEventListener('click', () => {
            const tbody = table.querySelector('tbody');
            tbody.classList.toggle('open');
          });
        });

    }
}
