const teams = {'DAL':{'name': 'Dallas Cowboys',
                      'logo': 'https://cdn.ssref.net/req/202508011/tlogo/pfr/dal-2025.png',
                      'division': 'NFC East'},
              'PHI':{'name': 'Philadelphia Eagles',
                     'logo': 'https://cdn.ssref.net/req/202508011/tlogo/pfr/phi-2025.png',
                     'division': 'NFC East'},
              'KAN':{'name': 'Kansas City Chiefs',
                      'logo': 'https://cdn.ssref.net/req/202508011/tlogo/pfr/kan-2025.png',
                      'division': 'AFC West'},
              'LAC':{'name': 'Los Angeles Chargers',
                      'logo': 'https://cdn.ssref.net/req/202508011/tlogo/pfr/sdg-2025.png',
                      'division': 'AFC West'},
              'TAM':{'name': 'Tampa Bay Buccaneers',
                      'logo': 'https://cdn.ssref.net/req/202508011/tlogo/pfr/tam-2025.png',
                      'division': 'NFC South'},
              'ATL':{'name': 'Atlanta Falcons',
                      'logo': 'https://cdn.ssref.net/req/202508011/tlogo/pfr/atl-2025.png',
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
const days = ['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday'];
const matchups = [{'awayTeam': 'DAL',
                   'homeTeam': 'PHI',
                   'awayGrudges': ['away1', 'away2', 'away3'],
                   'homeGrudges': ['home1', 'home2']}, 
                  {'awayTeam': 'KAN',
                   'homeTeam': 'LAC',
                   'awayGrudges': [],
                   'homeGrudges': []}, 
                  {'awayTeam': 'TAM',
                   'homeTeam': 'ATL',
                   'awayGrudges': [],
                   'homeGrudges': []}];
const awayGrudges = ['a', 'b', 'c', 'd', 'e'];
const homeGrudges = [];
const startDate = new Date('2025-08-01');
const endDate = new Date('2025-09-02');
const now = new Date();

let weekObj = document.getElementById('what-week-is-it');

if (now >= startDate && now <= endDate) {
    weekObj.innerHTML = `
      <p>Yes, there are <strong>${awayGrudges.length}</strong> grudge matches taking place in <a href=#upcoming-week> week ${week}</a>.</p>
      <br><br><br><br><hr style="background-color: solidgray;">
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
        dayHeader.innerHTML = day //.charAt(0).toUpperCase() + day.slice(1); // Capitalize day name
        dayHeader.addEventListener('click', () => {
            alert(`${day} header clicked!`);
        });
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
        [`<img src="${teams[awayTeam]['logo']}", width="50", height="50", alt=" ">`,
         `<img src="${teams[homeTeam]['logo']}", width="50", height="50", alt=" ">`].forEach(html => {
            const th = document.createElement('th');
            th.innerHTML = html;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        //INTERLEAVE AWAYGRUDGES AND HOMEGRUDGES
        //
        //

        // Body row
        const tbody = document.createElement('tbody');
        const dataRow = document.createElement('tr');
        ['Data A', 'Data B'].forEach(text => {
            const td = document.createElement('td');
            td.textContent = text;
            dataRow.appendChild(td);
        });
        tbody.appendChild(dataRow);

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
