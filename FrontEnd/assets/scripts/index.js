const url = 'http://localhost:5678/api/works';

fetch(url) // aller chercher la donnée 
.then(response => {
    return response.json(); // extraire toutes les données
})
/* Récupérez l'élément parent avec la classe "gallery"*/

var galleryDiv = document.querySelector('.gallery');
document.addEventListener('DOMContentLoaded', function () {
    /* Vérifiez si l'élément parent existe*/
    if (galleryDiv) {
        /* Supprimez tous les enfants de l'élément parent*/
        galleryDiv.innerHTML = '';
    }
});
