/* Fonction pour récupérer les données des travaux depuis l'API*/
async function fetchWorksData() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur de récupération des données des travaux :', error);
        throw error;
    }
}

/* Fonction pour ajouter les travaux à la modale*/
function addWorksToModal(works) {
    const galerie = document.querySelector('.modal-content');
    galerie.innerHTML = '';

    works.forEach(work => {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        image.src = work.imageUrl;

        image.classList.add("redimensionner");

        figure.appendChild(image);
        galerie.appendChild(figure);
    });
}


/* Fonction pour manipuler la modale et afficher les travaux*/
async function displayModalWithWorks() {
    const modal = document.getElementById("myModal");
    const closeButton = document.querySelector(".close");

     try {
        const worksData = await fetchWorksData();
         addWorksToModal(worksData);
        const figures = document.querySelectorAll('figure');
        modal.style.display = "block";

        /* Fermer la modale lorsque l'utilisateur clique sur le bouton de fermeture*/
        closeButton.addEventListener("click", () => {
            modal.style.display = "none";
        });

        /* Fermer la modale lorsque l'utilisateur clique en dehors de la modale*/
        window.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    } catch (error) {
        console.error('Erreur lors de la manipulation de la modale :', error);
    }
}

/* Vérifier si l'utilisateur est connecté*/
if (localStorage.getItem("token")) {
    document.getElementById("login").innerHTML = '<a id="logout">logout</a>';
    document.getElementById("banner").style.display = "block";
    document.querySelector('.btns').style.display = 'none'; // Pour rendre la div btns invisible
    displayModalWithWorks(); // Afficher la modale avec les travaux
} else {
    /* Utilisateur non connecté*/
    document.getElementById("login").innerHTML = '<a href="login.html">login</a>';
    document.querySelector('.btns').style.display = 'block'; // Pour rendre la div btns visible
    document.getElementById("banner").style.display = "none";
}
