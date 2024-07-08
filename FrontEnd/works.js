// Vider le parent .gallery
function hideAllProjects() {
    document.querySelector('.gallery').innerHTML="";
  }
  
// Récupérer et renvoyer les works issus de l'API
async function getProjets() {
  const response = await fetch('http://localhost:5678/api/works');
  const works = await response.json();
  return works;
}
  
// Gérer l'affichage des works 
async function displayWorks() {
  const gallery = document.querySelector('.gallery');
  const works = await getProjets();
    
  // On boucle sur les works, on stock la valeur du work en cours dans la variable "work"
  works.forEach(work => {
    // on créé les élements du DOM dont on a besoin
    let element = document.createElement('figure');
    let image = document.createElement('img');
    let figcaption = document.createElement('figcaption');
    // on rempli les valeurs pour l'image
    image.src = work.imageUrl;
    image.alt = work.title;
    // de même pour le figcaption
    figcaption.textContent = work.title;
    // on ajoute l'image et le figcaption au parent "figure"
    element.appendChild(image);
    element.appendChild(figcaption);
    // on ajoute le figure à la liste dans ".gallery"
    gallery.appendChild(element);
  });
}
  
// Lancement de la fonction qui vide la gallery
hideAllProjects();
  
// Lancement de la fonction créant les éléments dans la gallery via l'API
displayWorks();


// Récupération des catégories via l'API
async function getCategories() {
  const response = await fetch('http://localhost:5678/api/categories');
  const categories = await response.json();
  return categories;
}

// Création des boutons
async function createButtons() {
  const categories = await getCategories();
  const filtresDOM = document.querySelector(".filtres");
  // Création du bouton "Tous"
  let buttonAll = document.createElement("button");
  buttonAll.textContent = "Tous";
  filtresDOM.appendChild(buttonAll);
  // On boucle sur les categories
  categories.forEach(categorie => {
    let button = document.createElement("button");
    button.textContent = categorie.name
    filtresDOM.appendChild(button);
  })
}

// Lancement de la fonction créant les boutons
createButtons();


// Sélection des boutons et ajout de l'événement
document.addEventListener("click", function activeButton() {
  let buttons = document.querySelectorAll("button");
// Boucle "button active"
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(button => button.classList.remove("active"));
      button.classList.add("active");
    });
  });
});