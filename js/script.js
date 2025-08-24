// import database
import {teams, weekLengthInfo, playerGrudges} from './data.js';

// set default week to 1
let weekNum = 1;

// total count of grudge matches
let totalGrudges = 0;

// create div per day in matchup list
const days = Object.keys(playerGrudges);

// current date/time
const now = new Date();

console.log(weekLengthInfo);
console.log(Date(['start']));

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

// Add week slate header
weekSlateHeader.innerHTML = `<h2 id="upcoming-week">Week ${weekNum}</h2>
                             <p style="font-size: 12px;">**All game times are in EDT.</p>`;

// Add event listeners for all tables
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('table').forEach(table => {
    table.addEventListener('click', () => {
      const tbody = table.querySelector('tbody');
      tbody.classList.toggle('open');
    });
  });
});
