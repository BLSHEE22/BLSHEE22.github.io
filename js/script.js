const thursdayHeader = document.getElementById('thursdayHeader');
thursdayHeader.innerHTML = "BOOYAHHHH";
thursdayHeader.addEventListener('click', () => {
        alert('Paragraph clicked!');
    });
newP = document.createElement('p');
newP.style.color = 'tomato';
newP.innerHTML = 'THIS IS A JS TEST';
document.getElementById('thursdayHeader').append(newP);
