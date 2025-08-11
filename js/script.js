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

function isDateInRange(dateToCheck, startDate, endDate) {
  // Ensure all inputs are Date objects
  const checkDate = new Date(dateToCheck);
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Compare the dates
  return checkDate >= start && checkDate <= end;
}

const week1StartDate = new Date('2025-09-04');
const week1EndDate = new Date('2025-09-08');
const now = new Date();

if (isDateWithinRange(now, week1StartDate, week1EndDate) {
    document.getElementById('what-week-is-it').innerHTML = `<p>Yes, there are <strong>${games.length}</strong> grudge matches taking place in <a href=#upcoming-week>week 1</a></p>`;
}
else {
    document.getElementById('what-week-is-it').innerHTML = `No, the regular season has not started yet.`;
}

const days = ['thursday', 'friday', 'saturday', 'sunday', 'monday'];
const games = [1, 2, 3];

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

    for (let game of games) {
        // Create matchup header
        const matchupHeader = document.createElement('p');
        matchupHeader.textContent = `Game ${game} Title`;
        matchupHeader.style.textAlign = 'center';
        parentElement.appendChild(matchupHeader);

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
