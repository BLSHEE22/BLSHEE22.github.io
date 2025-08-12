

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
const matchups = [{'header':'Dallas Cowboys @ Philadelphia Eagles',
                   'divisional': true }, 
                  {'header':'Kansas City Chiefs vs. Los Angeles Chargers',
                   'divisional': true }, 
                  {'header':'Tampa Bay Buccaneers @ Atlanta Falcons',
                   'divisional': true } ];
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
        dayHeader.innerHTML = day.charAt(0).toUpperCase() + day.slice(1); // Capitalize day name
        dayHeader.addEventListener('click', () => {
            alert(`${day} header clicked!`);
        });
    }

    for (let matchup of matchups) {
        // Create matchup header
        const matchupHeader = document.createElement('p');
        matchupHeader.textContent = matchup['header'];
        matchupHeader.style.textAlign = 'center';
        matchupHeader.style.fontWeight = 'bold';
        parentElement.appendChild(matchupHeader);
        if (matchup['divisional']) {
            const divisionalHeader = document.createElement('p');
            divisionalHeader.textContext = 'Divisional Matchup';
            divisionalHeader.style.textAlign = 'center';
            parentElement.appendChild(divisionalHeader);
        }
        
        // Create table
        const matchupTable = document.createElement('table');

        // Header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Column 1', 'Column 2'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

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
    }
}
