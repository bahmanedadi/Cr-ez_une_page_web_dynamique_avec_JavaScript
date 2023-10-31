document.addEventListener('DOMContentLoaded', function () {
    /* Sélection des éléments du formulaire et des messages d'erreur*/
    const loginForm = document.querySelector('.login_form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginEmailError = document.querySelector('.loginEmail_error');
    const loginMdpError = document.querySelector('.loginMdp_error');
    const loginErreur = document.querySelector('.error');

    /* Écouteur d'événement pour la soumission du formulaire*/
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        /* Réinitialisation des messages d'erreur*/
        loginEmailError.textContent = "";
        loginMdpError.textContent ="";
        loginErreur.textContent = "";

        /* Récupération des valeurs du formulaire*/
        const email = emailInput.value;
        const password = passwordInput.value;

        /* Validation de l'email et du mot de passe*/
        if (!validateEmail(email)) {
            showError(loginEmailError, "Veuillez entrer une adresse email valide");
            return;
        }

        if (!validatePassword(password)) {
            showError(loginMdpError, "Veuillez entrer un mot de passe valide");
            return;
        }

        try {
            /* Envoi des données de connexion au serveur via fetch*/
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password })
            });

            const responseData = await response.json();

            /* Traitement des réponses du serveur*/
            if (response.status === 200) {
                /* Connexion réussie : stockage du token et redirection vers la page d'accueil*/
                localStorage.setItem("token", responseData.token);
                window.location.href = "index.html";
            } else if (response.status === 401) {
                /* Erreur d'autorisation*/
                showError(loginErreur, "Not Authorized");
            } else if (response.status === 404) {
                /* Utilisateur non trouvé*/
                showError(loginErreur, "User not found");
            } else {
                /* Autres erreurs*/
                throw new Error("Erreur de requête");
            }
        } catch (error) {
            /* Gestion des erreurs de requête*/
            console.error(" Une erreur s\'est produite :", error);
        }
    });

    /* Vérification de la présence d'un token dans le stockage local*/
    if (localStorage.getItem("token")) {
        showError(loginErreur, "Vous avez été déconnecté, veuillez vous reconnecter");
    }

    /* Fonction de validation de l'email*/
    function validateEmail(email) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/g.test(email);
    }

    /* Fonction de validation du mot de passe*/
    function validatePassword(password) {
        return /^[a-zA-Z0-9]+$/g.test(password) && password.length >= 6;
    }
    /* Fonction pour afficher les messages d'erreur*/
    function showError(element, message) {
        const p = document.createElement('p');
        p.textContent = message;
        element.appendChild(p);
    }
});
