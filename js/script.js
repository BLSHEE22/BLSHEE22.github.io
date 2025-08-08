function updateClock() {
    const now = new Date(); // Get current date and time

    // Format the date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);

    // Format the time
    const timeString = now.toLocaleTimeString('en-US');

    // Combine and update the HTML element
    document.getElementById('clock').innerHTML = `${dateString} - ${timeString}`;
}

// Call updateClock initially to display the time immediately
updateClock();

// Update the clock every second
setInterval(updateClock, 1000);

const days = ['thursday', 'friday', 'saturday', 'sunday', 'monday']; // Add or remove days as needed
const games = [1, 2, 3]; // You can customize this per day too if needed

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
