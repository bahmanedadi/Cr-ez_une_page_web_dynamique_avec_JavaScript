let worksData = [];
let categoriesData = [];
const divBtns = document.querySelector('.btns');
const galerie = document.querySelector('.gallery');

/* Récupération des données des travaux*/
fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
        worksData = data;
        /* Appel d'une fonction pour ajouter les travaux à la galerie*/
        addWorksToGallery(worksData);
        console.log(worksData);
    });

/* Récupération des données des catégories*/
fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(data => {
        categoriesData = data;
        /* Appel d'une fonction pour créer les boutons de catégorie*/
        createCategory(categoriesData);
    });

/* Fonction pour ajouter les travaux à la galerie*/
function addWorksToGallery(works) {
    const galerie = document.querySelector('.gallery');
    galerie.innerHTML = '';

    works.forEach(work => {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        image.src = work.imageUrl;
        image.alt = work.title;
        const legende = document.createElement('figcaption');
        legende.textContent = work.title;
        figure.appendChild(image);
        figure.appendChild(legende);
        galerie.appendChild(figure);
    });
}

/* Fonction pour créer les boutons de catégorie*/
function createCategory(categories) {


    categories.forEach(categorie => {
        const bouton = document.createElement('button');
        bouton.innerText = categorie.name;
        bouton.classList.add('btn');
        bouton.addEventListener('click', function () {
            const categorieSelectionnee = categorie.name;

            /*Filtrer les travaux en fonction de la catégorie sélectionnée*/
            const travauxFiltres = worksData.filter(work => work.category.name === categorieSelectionnee);

            /* Affichez les travaux filtrés dans la galerie*/
            addWorksToGallery(travauxFiltres);
            console.log(travauxFiltres);
            const allButtons = document.querySelectorAll('.btn');
            allButtons.forEach(button => {
                button.classList.remove('active');
            });
            bouton.classList.add('active');
        });
        divBtns.appendChild(bouton);
    });
}

/* Fonction pour ajouter les travaux à la galerie*/
function addWorksToGallery(works) {
    galerie.innerHTML = '';

    works.forEach(work => {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        image.src = work.imageUrl;
        image.alt = work.title;
        const legende = document.createElement('figcaption');
        legende.textContent = work.title;
        figure.appendChild(image);
        figure.appendChild(legende);
        galerie.appendChild(figure);
    });
}

const boutonTous = document.querySelector('.btn_1');
boutonTous.addEventListener('click', function () {
    /*Afficher tous les travaux dans la galerie (sans filtre par catégorie)*/
    addWorksToGallery(worksData);
    console.log(worksData);
    /* Retirer la classe "active" de tous les boutons de catégorie */
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => {
        button.classList.remove('active');
    });

    /* Ajouter la classe "active" uniquement au bouton cliqué */
    boutonTous.classList.add('active');
});


