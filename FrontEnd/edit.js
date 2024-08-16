document.addEventListener("DOMContentLoaded", function() {
    const editBar = document.getElementById("editBar");
    const modifier = document.querySelector(".modifier");
    const token = localStorage.getItem("token");
    const dialog = document.querySelector("dialog");
    const closeIcons = document.querySelectorAll(".fa-xmark");
    const arrowLeft = document.querySelector(".fa-arrow-left");
    const worksDiv = document.querySelector(".works");
    const ajoutPhoto = document.querySelector(".ajout-photo");
    const dialogContainer = document.querySelector(".dialog-container");
    const dialogAddWorks = document.querySelector(".dialog-add-works");
    const photoCategorySelect = document.querySelector("#photo-category");
    const addPhotoForm = document.querySelector(".add-photo-form");


    if (token) {
        editBar.style.display = "flex";
        modifier.style.display = "flex";
        modifier.addEventListener("click", function() {
            dialog.style.display = "flex";
            dialog.showModal();
            fetchWorks();
        });
    }

    function resetModal() {
        dialogContainer.style.display = "flex";
        dialogAddWorks.style.display = "none";
    }

    closeIcons.forEach(icon => {
        icon.addEventListener("click", function() {
            dialog.style.display = "none";
            dialog.close();
            resetModal();
        });
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" || event.key === 27) {
            dialog.style.display = "none";
            dialog.close();
            resetModal();
        }
    });

    dialog.addEventListener("click", function(event) {
        if (event.target === dialog) {
            dialog.style.display = "none";
            dialog.close();
            resetModal();
        }
    });

    ajoutPhoto.addEventListener("click", function() {
        dialogContainer.style.display = "none";
        dialogAddWorks.style.display = "flex";
        fetchCategories();
    });

    arrowLeft.addEventListener("click", function() {
        dialogContainer.style.display = "flex";
        dialogAddWorks.style.display = "none";
    });

    addPhotoForm.addEventListener("submit", function(event) {
        event.preventDefault();
        postNewWork();
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

    async function fetchCategories() {
            const response = await fetch("http://localhost:5678/api/categories");
            const categories = await response.json();
            photoCategorySelect.innerHTML = "";
            let defaultOption = document.createElement("option");
            defaultOption.value = "";
            photoCategorySelect.appendChild(defaultOption);
            categories.forEach(category => {
                let option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                photoCategorySelect.appendChild(option);
            });
    }   

    async function getProjets() {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        return works;
    }

    async function deleteWork(id) {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            fetchWorks();
            await refreshGallery();
        } 
    }

    async function postNewWork() {
        const formData = new FormData();
        formData.append("image", document.querySelector("#ajouter-photo").files[0]);
        formData.append("title", document.querySelector("#photo-title").value);
        formData.append("category", document.querySelector("#photo-category").value);
    
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            await refreshGallery(); 
            resetModal();
            dialog.style.display = "none";
            dialog.close();
        }
    }
});