// Vider le parent .gallery
function hideAllProjects() {
  document.querySelector(".gallery").innerHTML = "";
}

// Récupérer et renvoyer les works issus de l'API
async function getProjets() {
  const response = await fetch("http://localhost:5678/api/works");
  return response.json(); // Retourne directement les données JSON
}

// Gérer l'affichage des works 
async function displayWorks() {
  const gallery = document.querySelector(".gallery");
  const works = await getProjets();

  works.forEach(work => {
      const element = document.createElement("figure");
      const image = document.createElement("img");
      const figcaption = document.createElement("figcaption");

      image.src = work.imageUrl;
      image.alt = work.title;
      element.dataset.category = work.category.name;
      figcaption.textContent = work.title;

      element.appendChild(image);
      element.appendChild(figcaption);
      gallery.appendChild(element);
  });
}

// Récupération des catégories via l'API
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return response.json(); // Retourne directement les données JSON
}

// Création des boutons
async function createButtons() {
  const categories = await getCategories();
  const filtresDOM = document.querySelector(".filtres");
  
  // Vider les filtres existants
  filtresDOM.innerHTML = '';

  // Création du bouton "Tous"
  const buttonAll = document.createElement("button");
  buttonAll.textContent = "Tous";
  buttonAll.classList.add("active");
  filtresDOM.appendChild(buttonAll);

  // Création des boutons pour chaque catégorie
  categories.forEach(categorie => {
      const button = document.createElement("button");
      button.textContent = categorie.name;
      filtresDOM.appendChild(button);
      
      // Gestion de l'événement pour chaque bouton
      button.addEventListener("click", () => {
        handleFilterButtonClick(button, filtresDOM);
      }); 
      
      // Gestion de l'événement pour le bouton "Tous"
      buttonAll.addEventListener("click", () => {
        handleFilterButtonClick(buttonAll, filtresDOM);
    });
  });
}

// Gestion de l'action des filtres
function handleFilterButtonClick(button, filtresDOM) {
  const buttons = filtresDOM.querySelectorAll("button");
  
  buttons.forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
  filtresAction(button.textContent);
}

// Filtrer les travaux selon la catégorie sélectionnée
function filtresAction(category) {
  const works = document.querySelectorAll(".gallery figure");
  works.forEach(work => {
      work.style.display = (category === "Tous" || category === work.dataset.category) ? "block" : "none";
  });
}

// Rafraîchir la galerie
async function refreshGallery() {
  hideAllProjects();
  await displayWorks();
  await createButtons();
}

// Appel de la fonction pour rafraîchir la galerie au chargement
refreshGallery();