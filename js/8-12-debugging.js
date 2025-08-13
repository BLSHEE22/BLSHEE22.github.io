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

let week = 1;
const days = ['thursday', 'friday', 'saturday', 'sunday', 'monday'];
const matchups = [{'awayTeam': 'DAL',
                   'homeTeam': 'PHI',
                   'awayGrudges': [{'name': 'Miles Sanders',
                                    'urlName': 'SandMi01_2025',
                                    'position': 'RB',
                                    'grudgeType': 'Primary Grudge',
                                    'seasons': '2019-2022',
                                    'positionRk': '59'},
                                   {'name': 'Parris Campbell',
                                    'urlName': 'CampPa00_2024',
                                    'position': 'WR',
                                    'grudgeType': 'Grudge',
                                    'seasons': '2024',
                                    'positionRk': '153'}],
                   'homeGrudges': []}, 
                  {'awayTeam': 'KAN',
                   'homeTeam': 'LAC',
                   'awayGrudges': [{'name': 'Jerry Tillery',
                                    'urlName': 'TillJe00_2025',
                                    'position': 'DL',
                                    'grudgeType': 'Primary Grudge',
                                    'seasons': '2019-2022',
                                    'positionRk': 'N/A'}],
                   'homeGrudges': []}, 
                  {'awayTeam': 'TAM',
                   'homeTeam': 'ATL',
                   'awayGrudges': [],
                   'homeGrudges': []}];

const startDate = new Date('2025-08-01');
const endDate = new Date('2025-09-02');
const now = new Date();

let weekObj = document.getElementById('what-week-is-it');

if (now >= startDate && now <= endDate) {
    weekObj.innerHTML = `
      <p>Yes, there are <strong>${awayGrudges.length}</strong> grudge matches taking place in <a href=#upcoming-week> week ${week}</a>.</p>
      <br><br><hr style="background-color: solidgray;">
      <h2 id="upcoming-week">Week 1</h2>
    `;
}
else {
    weekObj.getElementById('what-week-is-it').innerHTML = `No, the regular season has not started yet.`;
}

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

        // Converts grudge information into HTML data for the table
        function formTableRowHtml(grudgeList, currTeam, grudgeTeam) {
          let htmlGrudges = [];
          if (grudgeList.length === 0) {
            htmlGrudges.push(`<p style="font-size: 18px;">None</p>`);
            return htmlGrudges;
          }
          for (let grudge of grudgeList) {
            let htmlString = ``;
            // Add headshot
            htmlString += `<img src="https://www.pro-football-reference.com/req/20230307/images/headshots/${grudge['urlName']}.jpg", width="74", height="110", alt=" ">`;
            // Add name
            htmlString += `<br/><strong style="font-size: 18px;">${grudge['name']} (${grudge['position']}, ${currTeam})</strong>`;
            // Add grudge type
            htmlString += `<br/>${grudge['grudgeType']}`;
            // Add seasons spent with grudge team
            htmlString += `<br/>Seasons with ${grudgeTeam}: ${grudge['seasons']}<br/>`;
            // Add fantasy position rank if applicable
            if (awayGrudge['positionRk'] != 'N/A') {
              htmlString += `Fantasy Position Rank: ${grudge['positionRk']}<br/>`;
            }
            // Add final spacing
            htmlString += `<br/>`;
            // Append full html string to new list
            htmlAwayGrudges.push(htmlString);
          }
          // Return list of html data
          return htmlGrudges;
        }

        // Store all grudges in this matchup locally
        let awayGrudges = matchup['awayGrudges'];
        let homeGrudges = matchup['homeGrudges']; 

        let htmlAwayGrudges = formTableRowHtml(awayGrudges, awayTeam, homeTeam);
        let htmlHomeGrudges = formTableRowHtml(homeGrudges, homeTeam, awayTeam);

        // make sure lists are the same size
        while (htmlAwayGrudges.length - htmlHomeGrudges.length > 0) {
          htmlHomeGrudges.push('');
        }
        while (htmlHomeGrudges.length - htmlAwayGrudges.length > 0) {
          htmlAwayGrudges.push('');
        }

        // Interleave lists
        const grudgeRows = htmlAwayGrudges.map((item1, index) => {
          const item2 = htmlHomeGrudges[index];
          return [item1, item2]; // Returns an array of arrays: [['away1', 'home1'], ['away2', 'home2'], ['away3', 'home3']]
        });

        // Form body rows
        const tbody = document.createElement('tbody');
        for (let row of grudgeRows) {
          const dataRow = document.createElement('tr');
          row.forEach(html => {
              const td = document.createElement('td');
              td.innerHTML = html;
              td.style.fontSize = '12px';
              dataRow.appendChild(td);
          });
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
