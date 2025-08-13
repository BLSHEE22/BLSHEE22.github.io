// const weekdays = ['thursday', 'friday', 'saturday', 'sunday', 'monday'];
// const weekByWeekInfo = {1:{'thursday':{'date':'Thursday, September 4th',
//                                        'matchups':[{'header':'Dallas Cowboys @ Philadelphia Eagles',
//                                                     'divisional': true,
//                                                     'homeGrudges':[{'name':'Miles Sanders',
//                                                                     'grudgeType':'Primary Grudge',
//                                                                     'seasons':'2019-2022',
//                                                                     'positionRk':'59'},
//                                                                    {'name':'Parris Campbell',
//                                                                     'grudgeType':'Grudge',
//                                                                     'seasons':'2024',
//                                                                     'positionRk':'153'}]',
//                                                     'awayGrudges':['None'],
//                                                    }]
//                                       }
//                           }
//                        };
// const week = 1;
//// DAY
// for (let day of weekdays) {
//         // find day
//         const parentElement = document.getElementById(day);
//         // rename header according to date/time clock
//         const dayHeader = document.getElementById(day+'Header');
//         dayInfo = weekByWeekInfo[week][day];
//         dayHeader.innerHTML = dayInfo['date'];
//         dayHeader.addEventListener('click', () => {
//                 alert('Paragraph clicked!');
//             });
        
//         // MATCHUP
//         for (let matchup of dayInfo['matchups']) {
//                 // create matchup header
//                 const matchupHeader = document.createElement('p');
//                 matchupHeader.textContent = matchup['header'];
//                 matchupHeader.style.textAlign = 'center';
//                 // append matchup header to parent
//                 parentElement.appendChild(matchupHeader);
                
//                 // create table
//                 const matchupTable = document.createElement('table');
//                 const thead = document.createElement('thead');
//                 const tbody = document.createElement('tbody');
//                 // add header row
//                 const headerRow = document.createElement('tr');
//                 const header1 = document.createElement('th');
//                 header1.textContent = 'Column 1';
//                 const header2 = document.createElement('th');
//                 header2.textContent = 'Column 2';
//                 headerRow.appendChild(header1);
//                 headerRow.appendChild(header2);
//                 thead.appendChild(headerRow);
//                 // add data rows
//                 const dataRow1 = document.createElement('tr');
//                 const cell1_1 = document.createElement('td');
//                 cell1_1.textContent = 'Data A';
//                 const cell1_2 = document.createElement('td');
//                 cell1_2.textContent = 'Data B';
//                 dataRow1.appendChild(cell1_1);
//                 dataRow1.appendChild(cell1_2);
//                 tbody.appendChild(dataRow1);
//                 // append header and data rows to table
//                 matchupTable.appendChild(thead);
//                 matchupTable.appendChild(tbody);
//                 // append table to parent
//                 parentElement.appendChild(matchupTable);
//         }
// }

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
