const url = 'http://localhost:5678/api/works';
/*aller chercher la donnée */
fetch(url)
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

const divBtns = document.querySelector('.btns');

/* Tableau contenant le texte pour chaque bouton */
const labels = ['tous', 'objets', 'Appartements', 'Hotels & Restaurants'];

for (let i = 0; i < labels.length; i++) {
    const bouton = document.createElement('button');
    bouton.innerText = labels[i];
    bouton.classList.add('btn_' + (i + 1));
    /* Action à effectuer lors du clic sur le bouton*/
    bouton.addEventListener('click', function () {
        alert(labels[i] + ' cliqué !'); 
    });
    divBtns.appendChild(bouton);
}
