const url = 'http://localhost:5678/api/works';

fetch(url) // aller chercher la donnée 
.then(response => {
    return response.json(); // extraire toutes les données
})
