const url = 'http://localhost:5678/api/works';

/*aller chercher la donnée */
fetch(url)
    .then(response => {
        return response.json(); // extraire toutes les données
    })
    .then(data => {
        /*Sélectionnez l'élément de la galerie dans lequel vous souhaitez ajouter les travaux*/
        const galerie = document.querySelector('.gallery');

        /* Parcourez les données et ajoutez-les à la galerie*/
        data.forEach(work => {
            /* Créez un élément de figure pour chaque travail*/
            const figure = document.createElement('figure');

            /* Créez un élément d'image*/
            const image = document.createElement('img');
            image.src = work.imageUrl;
            image.alt = work.title;

            /* Créez un élément de légende*/
            const legende = document.createElement('figcaption');
            legende.textContent = work.title;

            /* Ajoutez l'image et la légende à la figure*/
            figure.appendChild(image);
            figure.appendChild(legende);

            /* Ajoutez la figure à la galerie*/
            galerie.appendChild(figure);
        });
    })



const divBtns = document.querySelector('.btns');

fetch("http://localhost:5678/api/categories")
    .then(response => {
        return response.json();
    })
    .then(data => {
        data.forEach(categorie => {
            console.log("categorie", categorie.name);
            const bouton = document.createElement('button');
            bouton.innerText = categorie.name;
            bouton.classList.add('btn');
            /* Action à effectuer lors du clic sur le bouton*/
            bouton.addEventListener('click', function () {
                const categorieSelectionnee = categorie.name;
                const travauxFiltres = data.filter(travail => travail.category === categorieSelectionnee);
                console.log("categorie", categorie);
            });
            divBtns.appendChild(bouton);

        })
    })

const galerie = document.querySelector('.gallery');
let data = [];
/* Ajoutez un écouteur d'événements à chaque bouton*/
divBtns.addEventListener('click', function (event) {
    if (event.target.classList.contains('btn')) {
        // Vérifiez si data est défini avant de filtrer les travaux
        if (data) {
            const categorieSelectionnee = event.target.innerText;
            const travauxFiltres = data.filter(travail => travail.category === categorieSelectionnee);
            galerie.innerHTML = ''; // Effacez la galerie existante avant d'ajouter de nouveaux éléments

            travauxFiltres.forEach(work => {
                const figure = document.createElement('figure');
                /* Parcourez les travaux filtrés et ajoutez-les à la galerie*/
                travauxFiltres.forEach(work => {
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
                galerie.appendChild(figure);
            });
        } else {
            console.error('Les données ne sont pas encore chargées.');
        }
    }
});










