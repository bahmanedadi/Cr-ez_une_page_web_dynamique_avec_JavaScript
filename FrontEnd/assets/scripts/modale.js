const modal = document.getElementById("myModal");
const closeButton = document.querySelector(".close");
const loginButton = document.getElementById("loginButton");
const titleInput = document.getElementById('title');
const photoInput = document.getElementById('photo');
const categorieInput = document.getElementById('categorie');
const submitButton = document.getElementById('submitButton');
document.addEventListener("DOMContentLoaded", function () {

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
            icon.classList.add("fa-solid","fa-trash-can");
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
       
        const banner = document.querySelector(".banner");
        banner.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color: white;"></i>' + '<h2>Mode édition</h2>';
        banner.classList.add("visibleBanner");

        const portfolio = document.getElementById("portfolio");
        const btnEdit = document.createElement("a");
        btnEdit.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color:black;";></i>' + '<h2 >modifier<h2/>';
        btnEdit.classList.add("boutonEdite");
        portfolio.appendChild(btnEdit);

        loginButton.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            window.location.href = "index.html";
        });
        btnEdit.addEventListener("click", () => {
            modal.style.display = "none";
            displayModalWithWorks();
        });
        addPhoto();

    } else {
        loginButton.innerHTML = '<a href="login.html">login</a>';
        modal.style.display = "none";
    }
    uploadFile(e);

});

/* fonction pour ajouter une photo*/
async function addPhoto() {
    const btnAddPhoto = document.getElementById("modalButton");
    const modalContent = document.querySelector(".gallery-modal");
    const galleryEdit = document.querySelector(".gallery-edit")
    const modalContentH = document.querySelector(".modal-content h2")
    btnAddPhoto.addEventListener('click', () => {
        modalContent.style.display = "none";
        galleryEdit.style.display = "block"
        btnAddPhoto.style.display = "none";
        modalContentH.style.display = "none"
        const btnReturn = document.createElement("a");
        btnReturn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
        galleryEdit.appendChild(btnReturn);
        btnReturn.classList.add('arrow-left');
        btnReturn.style.display = 'block';
        btnReturn.addEventListener('click', () => {
            galleryEdit.style.display = "none";
            modalContentH.style.display = "block";
            modalContent.style.display = "flex";
            btnAddPhoto.style.display = "block";
        });
    });
    titleInput.addEventListener('input', updateSubmitButton);
    photoInput.addEventListener('change', updateSubmitButton);
    categorieInput.addEventListener('change', updateSubmitButton);
    submitButton.addEventListener("click", async (e) => {
        e.preventDefault();
        await addNewWork(e);
        modal.style.display = "none";
    });

    fetchCategories();
}
/*fonction pour ajouter une nouvelle figure*/
async function addNewWork(e) {
    e.preventDefault();
    const title = titleInput.value;
    const categoryId = categorieInput.value;
    const image = photoInput.files[0];

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
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        if (!response.ok) {
            throw new Error('La requête des catégories a échoué');
        }
        const categories = await response.json();
        categorieInput.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '--veuillez choisir une categorie--';
        categorieInput.appendChild(defaultOption);
        /* Ajouter les catégories de l'API*/
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorieInput.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur de récupération des catégories :', error);
        throw error;
    }
}

/* fonction pour telecharger le fichier sous forme jpg ou png*/
function uploadFile(e) {
    const iconFile = document.querySelector(".fa-image");
    iconFile.style.display = "block";
    const btnFile = document.querySelector(".rectangle label");
    btnFile.style.display = "block";
    const picture = document.querySelector(".photo");
    const infoFile = document.querySelector(".rectangle p");
    infoFile.style.display = "block";
    picture.src = "";
    const [image] = e.files;
    /* Mettez à jour l'aperçu de l'image*/
    picture.src = URL.createObjectURL(image);
    /* Masquez les éléments liés au téléchargement de fichier*/
    iconFile.style.display = "none";
    btnFile.style.display = "none";
    infoFile.style.display = "none";
}

/*Fonction pour mettre a jour le bouton valider */
function updateSubmitButton() {
    const titleFilled = titleInput.value.trim() !== '';
    const photoFilled = photoInput.files && photoInput.files[0];
    const categorieFilled = categorieInput.value !== '';

    if (titleFilled && photoFilled && categorieFilled) {
        submitButton.disabled = false;
        submitButton.style.backgroundColor = " #1D6154";
    } else {
        submitButton.disabled = true;
        submitButton.style.backgroundColor = " #A7A7A7";
    }
}
