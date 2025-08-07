const day = 'thursday';
const games = [1, 2];

const parentElement = document.getElementById(day);
if !(parentElement) continue;
// rename header according to date/time clock
const dayHeader = document.getElementById(day+'Header');
dayHeader.innerHTML = day.charAt(0).toUpperCase() + day.slice(1);
dayHeader.addEventListener('click', () => {
        alert(`${day} header clicked!`);
        });
        
for (let game of games) {
        // create matchup header
        const matchupHeader = document.createElement('p');
        matchupHeader.textContent = `Game ${game} Title`;
        matchupHeader.style.textAlign = 'center';
        // append matchup header to parent
        parentElement.appendChild(matchupHeader);
                                
        // create table
        const matchupTable = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        // add header row
        const headerRow = document.createElement('tr');
        const header1 = document.createElement('th');
        header1.textContent = 'Column 1';
        const header2 = document.createElement('th');
        header2.textContent = 'Column 2';
        headerRow.appendChild(header1);
        headerRow.appendChild(header2);
        thead.appendChild(headerRow);
        // add data rows
        const dataRow1 = document.createElement('tr');
        const cell1_1 = document.createElement('td');
        cell1_1.textContent = 'Data A';
        const cell1_2 = document.createElement('td');
        cell1_2.textContent = 'Data B';
        dataRow1.appendChild(cell1_1);
        dataRow1.appendChild(cell1_2);
        tbody.appendChild(dataRow1);
        // append header and data rows to table
        matchupTable.appendChild(thead);
        matchupTable.appendChild(tbody);
        // append table to parent
        parentElement.appendChild(matchupTable);
}
