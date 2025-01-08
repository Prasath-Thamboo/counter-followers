// src/popup.js
import fs from 'fs';

// Variable pour stocker la valeur précédente
let previousValue = null;

// Fonction pour lire le fichier titleValue.txt
function fetchTitleValue() {
    return new Promise((resolve, reject) => {
        fs.readFile('src/titleValue.txt', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                // Nettoyer et convertir en nombre
                const cleanValue = parseInt(data.replace(/[^0-9]/g, ''), 10);
                resolve(cleanValue);
            }
        });
    });
}

// Vérifie les changements toutes les 5 secondes et écrit dans un fichier log
async function checkForChanges() {
    try {
        const newValue = await fetchTitleValue();

        if (previousValue !== null && !isNaN(newValue)) {
            let message = '';
            let type = '';

            if (newValue > previousValue) {
                message = `Il y a du nouveau`;
                type = 'increase';
            } else if (newValue < previousValue) {
                message = `Qui nous a quitté ?`;
                type = 'decrease';
            } else {
                message = ' ';
                type = 'stable';
            }

            // Écrit le résultat dans un fichier pour le frontend
            fs.writeFileSync('src/popupState.txt', `${type}|${message}`);
        }
        previousValue = newValue; // Mise à jour de la valeur précédente
    } catch (error) {
        console.error('Erreur lors de la lecture du fichier :', error);
    }
}

// Vérifie toutes les 5 secondes
setInterval(checkForChanges, 4000);
