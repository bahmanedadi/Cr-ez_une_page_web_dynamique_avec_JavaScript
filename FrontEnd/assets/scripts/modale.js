// Sélectionnez la modale et le bouton qui l'ouvre
var modal = document.getElementById('myModal');
var btn = document.getElementById('submitBtn');
var span = document.getElementsByClassName('close')[0];

// Ouvrir la modale quand le bouton est cliqué
btn.onclick = function() {
  modal.style.display = 'block';
}

// Fermer la modale quand on clique sur la croix
span.onclick = function() {
  modal.style.display = 'none';
}

// Fermer la modale si l'utilisateur clique en dehors de celle-ci
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}