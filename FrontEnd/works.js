// Vider le parent .gallery
function hideAllProjects() {
  document.querySelector('.gallery').innerHTML = "";
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
      element.dataset.category = work.category.name;
      // de même pour le figcaption
      figcaption.textContent = work.title;
      // on ajoute l'image et le figcaption au parent "figure"
      element.appendChild(image);
      element.appendChild(figcaption);
      // on ajoute le figure à la liste dans ".gallery"
      gallery.appendChild(element);
  });
}

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

  // Vider les filtres existants pour éviter les doublons
  filtresDOM.innerHTML = '';

  // Création du bouton "Tous"
  let buttonAll = document.createElement("button");
  buttonAll.textContent = "Tous";
  buttonAll.classList.add("active");
  filtresDOM.appendChild(buttonAll);

  // On boucle sur les categories
  categories.forEach(categorie => {
      let button = document.createElement("button");
      button.textContent = categorie.name;
      filtresDOM.appendChild(button);
  });

  let buttons = filtresDOM.querySelectorAll("button");
  buttons.forEach(button => {
      button.addEventListener("click", () => {
          buttons.forEach(button => button.classList.remove("active"));
          button.classList.add("active");
          filtresAction(button.textContent);
      });
  });
}

function filtresAction(category) {
  const works = document.querySelectorAll(".gallery figure");
  works.forEach(work => {
      if (category === "Tous") {
          work.style.display = "block";
      } else if (category === work.dataset.category) {
          work.style.display = "block";
      } else {
          work.style.display = "none";
      }
  });
}

async function refreshGallery() {
  hideAllProjects();
  await displayWorks();
  await createButtons();
}

hideAllProjects();
displayWorks();
createButtons();


