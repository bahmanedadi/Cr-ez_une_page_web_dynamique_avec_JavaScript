document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('.login_form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginEmailError = document.querySelector('.loginEmail_error');
    const loginMdpError = document.querySelector('.loginMdp_error');
    const loginErreur = document.querySelector('.error');

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        loginEmailError.textContent = '';
        loginMdpError.textContent = '';
        loginErreur.textContent = '';

        const email = emailInput.value;
        const password = passwordInput.value;

        if (!validateEmail(email)) {
            showError(loginEmailError, 'Veuillez entrer une adresse email valide');
            return;
        }

        if (!validatePassword(password)) {
            showError(loginMdpError, 'Veuillez entrer un mot de passe valide');
            return;
        }

        try {
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const responseData = await response.json();

            if (response.status === 200) {
                localStorage.setItem('token', responseData.token);
                window.location.href = 'index.html';
            } else if (response.status === 401) {
                showError('Not Authorized');
            } else if (response.status === 404) {
                showError('User not found');
            } else {
                throw new Error('Erreur de requête');
            }
        } catch (error) {
            console.error('Une erreur s\'est produite :', error);
        }
    });



    if (localStorage.getItem('token')) {
        showError(loginEmailError, 'Vous avez été déconnecté, veuillez vous reconnecter');
    }

    function validateEmail(email) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/g.test(email);
    }

    function validatePassword(password) {
        return /^[a-zA-Z0-9]+$/g.test(password) && password.length >= 6;
    }

    function showError(element, message) {
        const p = document.createElement('p');
        p.innerHTML = message;
        element.appendChild(p);
    }
});
