const thursdayHeader = document.getElementById('thursdayHeader');
thursdayHeader.innerHTML = "BOOYAHHHH";
thursdayHeader.addEventListener('click', () => {
        alert('Paragraph clicked!');
    });

const parentElement = document.getElementById('myDiv');
const newParagraph = document.createElement('p');
newParagraph.textContent = 'This is new content.';
parentElement.appendChild(newParagraph);
