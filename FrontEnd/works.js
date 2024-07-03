// vider le parent .gallery
function hideAllProjects() {
    document.querySelector('.gallery').innerHTML="";
  }
  
  // récupérer et renvoyer les works issus de l'API
  async function getProjets() {
    const response = await fetch('http://localhost:5678/api/works');
    const works = await response.json();
    return works;
  }
  
  // gérer l'affichage des works 
  async function displayWorks() {
    const gallery = document.querySelector('.gallery');
    const works = await getProjets();
    
    // On boucle sur les works, on stocke la valeur du work en cours dans la variable "work"
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
  
  // on lance la fonction qui vide la gallery
  hideAllProjects();
  
  // on lance la fonction qui vient créer les éléments dans la gallery via l'API
  displayWorks();