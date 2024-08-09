document.addEventListener("DOMContentLoaded", function() {
    const editBar = document.getElementById("editBar");
    const modifier = document.querySelector(".modifier");
    const token = localStorage.getItem("token");
    const dialog = document.querySelector("dialog");
    const closeIcon = document.querySelector(".fa-xmark");
    const worksDiv = document.querySelector(".works");

    if (token) {
        editBar.style.display = "flex";
        modifier.style.display = "flex";
        modifier.addEventListener("click", function() {
            dialog.style.display = "flex";
            dialog.showModal();
            fetchWorks();
        });
    }

    closeIcon.addEventListener("click", function() {
        dialog.style.display = "none";
        dialog.close();
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" || event.key === 27) {
            dialog.style.display = "none";
            dialog.close();
        }
    });

    dialog.addEventListener("click", function(event) {
        if (event.target === dialog) {
            dialog.style.display = "none";
            dialog.close();
        }
    });

    async function fetchWorks() {
        const works = await getProjets();
        worksDiv.innerHTML = '';
        works.forEach(work => {
            let figure = document.createElement('figure');
            let image = document.createElement('img');
            let deleteIconContainer = document.createElement('div');
            let deleteIcon = document.createElement('i');
                    
            image.src = work.imageUrl;
            image.alt = work.title;
            
            deleteIconContainer.classList.add("delete-icon-container");
            deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");

            deleteIcon.dataset.id = work.id 

            deleteIconContainer.appendChild(deleteIcon);
           
            figure.classList.add("figure");
            figure.appendChild(image);
            figure.appendChild(deleteIconContainer);

            worksDiv.appendChild(figure);

            deleteIcon.addEventListener("click", function () {
                deleteWork(work.id);
            });
        });
    }

    async function getProjets() {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        return works;
    }

    async function deleteWork(id) {
        console.log(`Tentative de suppression du projet avec id: ${id}`);
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            console.log(`Projet avec id ${id} supprimé`);
            fetchWorks();

            await refreshGallery();
            
        } else {
            console.error(`Erreur de suppression : ${response.status} - ${response.statusText}`);
        }
    }
});