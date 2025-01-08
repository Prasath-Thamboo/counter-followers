// src/script.js
async function fetchTitleValue() {
    const response = await fetch('src/titleValue.txt');
    const titleValue = await response.text();
    return titleValue;
}

function displayResult(result) {
    const titleContainer = document.getElementById('title-container');
    titleContainer.innerHTML = ''; // Efface le contenu précédent
    const digits = result.split('').filter(char => char.trim() !== ''); // Divise en chiffres
    digits.forEach(digit => {
        const digitElement = document.createElement('div');
        digitElement.className = 'digit';
        digitElement.textContent = digit;
        titleContainer.appendChild(digitElement);
    });
}

// Fonction pour afficher un popup stylé
function showPopup(message, type) {
    const pop = document.querySelector('.pop');
    pop.innerHTML = `<div class="popup ${type}">${message}</div>`;
    setTimeout(() => {
        pop.innerHTML = ''; // Efface après 3 secondes
    }, 3000);
}

// Vérifie les changements en lisant le fichier popupState.txt
async function checkPopupState() {
    try {
        const response = await fetch('src/popupState.txt');
        const data = await response.text();
        const [type, message] = data.split('|');

        if (type && message && type !== ' ' && type !== 'stable') {
            showPopup(message, type); // Affiche le popup
        }
    } catch (error) {
        console.error('Erreur lors de la lecture du fichier popupState.txt:', error);
    }
}

// Mise à jour de la valeur actuelle
document.addEventListener('DOMContentLoaded', async () => {
    const titleValue = await fetchTitleValue();
    displayResult(titleValue);

    // Rafraîchit les valeurs et popups
    setInterval(async () => {
        const newTitleValue = await fetchTitleValue();
        displayResult(newTitleValue);
        await checkPopupState(); // Vérifie les changements
    }, 5000); // Toutes les 5 secondes
});

// Charger les scripts supplémentaires
async function loadScripts() {
    await import('/src/popup.js');
}

loadScripts();
