document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("myModal");
    const closeButton = document.querySelector(".close");
    const loginButton = document.getElementById("loginButton");

    /* Fonction pour récupérer les données des travaux depuis l'API */
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

    /* Fonction pour ajouter les travaux à la modale */
    function addWorksToModal(works) {
        const galerie = document.querySelector('.gallery-modal');
        galerie.innerHTML = '';

        works.forEach(work => {
            const figure = document.createElement('figure');
            const image = document.createElement('img');
            image.src = work.imageUrl;
            image.classList.add("redimensionner");
            figure.appendChild(image);
            galerie.appendChild(figure);
            const p = document.createElement("p"); // Créez un élément p pour contenir l'icône
            const icon = document.createElement("i");
            icon.classList.add("fa-solid", "fa-trash-can");
            p.appendChild(icon);
            figure.appendChild(p); // Ajoutez p avec l'icône à la figure
        });
    }

    /* Fonction pour manipuler la modale et afficher les travaux */
    async function displayModalWithWorks() {
        try {
            const worksData = await fetchWorksData();
            addWorksToModal(worksData);
            modal.style.display = "block";

            /* Fermer la modale lorsque l'utilisateur clique sur le bouton de fermeture */
            closeButton.addEventListener("click", () => {
                modal.style.display = "none";
            });

            /* Fermer la modale lorsque l'utilisateur clique en dehors de la modale */
            window.addEventListener("click", (event) => {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            });
        } catch (error) {
            console.error('Erreur lors de la manipulation de la modale :', error);
        }
    }

    /* Vérifier si l'utilisateur est connecté */
    if (localStorage.getItem("token")) {
        loginButton.innerHTML = '<a href="#">logout</a>';
        document.querySelector('.btns').style.display = 'none';
        //Création de la banniére
        const banner = document.querySelector(".banner");
        banner.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color: white;"></i>' + '<h2>Mode édition</h2>';
        banner.classList.add("visibleBanner");

        const portfolio = document.getElementById("portfolio");
        const boutonEdit = document.createElement("a");
        boutonEdit.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color:black;";></i>' + '<h2 >modifier<h2/>';
        boutonEdit.classList.add("boutonEdite");
        portfolio.appendChild(boutonEdit);
       
        loginButton.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            window.location.href = "index.html";
        });

        boutonEdit.addEventListener("click", () => {
            modal.style.display = "none";
            displayModalWithWorks();
        });


        // Afficher la modale avec les travaux

    } else {
        loginButton.innerHTML = '<a href="login.html">login</a>';
        modal.style.display = "none";

    }
});

