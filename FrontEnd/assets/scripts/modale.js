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

            /* Créez l'icône de la poubelle*/
            const p = document.createElement("p");
            const icon = document.createElement("i");
            icon.classList.add("fa-solid", "fa-trash-can");
            p.appendChild(icon);
            icon.addEventListener("click", async () => {
                try {
                    const workId = work.id;

                    /* Envoyez une requête DELETE à votre API pour supprimer l'image*/
                    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    if (response.ok) {
                        figure.remove();
                    } else {
                        console.error('Erreur lors de la suppression de l\'image.');
                    }
                } catch (error) {
                    console.error('Erreur lors de la suppression de l\'image :', error);
                }
            });

            figure.appendChild(p);
            galerie.appendChild(figure);
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
        document.querySelector(".line").style.display = "block";
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

        ajouterPhoto();
       
    } else {
        loginButton.innerHTML = '<a href="login.html">login</a>';
        modal.style.display = "none";


    }
});

async function ajouterPhoto() {
    const boutonAjoutPhoto = document.getElementById("modalButton");
    const modalContenu = document.querySelector(".gallery-modal");
    const galleryEdit = document.querySelector(".gallery-edit")
    const modalContentH = document.querySelector(".modal-content h2")
    boutonAjoutPhoto.addEventListener('click', () => {
        modalContenu.style.display = "none";
        galleryEdit.style.display = "block"
        boutonAjoutPhoto.style.display = "none";
        modalContentH.style.display = "none"
        const btnReturn = document.createElement("a");
        btnReturn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
        galleryEdit.appendChild(btnReturn);
        btnReturn.classList.add('arrow-left');
        btnReturn.style.display = 'block';
        btnReturn.addEventListener('click', () => {
            galleryEdit.style.display = "none";
            modalContentH.style.display = "block";
            modalContenu.style.display = "flex";
            boutonAjoutPhoto.style.display = "block";
        });
    });
    const btnAjouterProjet = document.querySelector(".js-add-work");
    btnAjouterProjet.addEventListener("click",  addNewWork);
}
async function addNewWork(e) {
    e.preventDefault();
    await fetchCategories();
    const title = document.querySelector(".js-title").value;
    const categoryId = document.querySelector(".js-categoryId").value;
    const image = document.querySelector(".js-image").files[0];


    if (title === "" || categoryId === "" || image === undefined) {
        alert("Merci de remplir tous les champs");
        return;
    } else if (!await fetchCategories() === categoryId) {
        alert("Merci de choisir une catégorie valide");
        return;
    } else {
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", categoryId);
            formData.append("image", image);

            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (response.status === 201) {
                alert("Projet ajouté avec succès :)");
                addWorksToGallery();
             

            } else if (response.status === 400) {
                alert("Merci de remplir tous les champs");
            } else if (response.status === 500) {
                alert("Erreur serveur");
            } else if (response.status === 401) {
                alert("Vous n'êtes pas autorisé à ajouter un projet");
                window.location.href = "login.html";
            }
        }

        catch (error) {
            console.log(error);
        }
    }
}

async function fetchCategories() {

    alert("fetchcategorie")
    const response = await fetch('http://localhost:5678/api/categories');
    if (!response.ok) {
        throw new Error('La requête des catégories a échoué');
    }
    const categories = await response.json();
    return categories.map(category => category.id);
}
