const thursdayHeader = document.getElementById("thursdayHeader");
thursdayHeader.textContext = "Thursday, September 4th - BOOYAH";
thursdayHeader.addEventListener('click', () => {
        alert('Paragraph clicked!');
    });
newP = document.createElement("p");
newP.style.color = "tomato";
newP.textContext = "THIS IS A JS TEST";
document.getElementById("centered-div").append(newP);
