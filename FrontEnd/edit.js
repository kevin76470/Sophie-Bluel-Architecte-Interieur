const token = localStorage.getItem("token");

if (token) {
    const editBar = document.getElementById("editBar");
    const modifier = document.querySelector(".modifier");

    editBar.style.display = "flex";
    modifier.style.display = "flex";

    modifier.addEventListener("click", function() {
        showDialog();
        fetchWorks();
    });
}

function showDialog() {
    const dialog = document.querySelector("dialog");
    dialog.style.display = "flex";
    dialog.showModal();

    const closeIcons = dialog.querySelectorAll(".fa-xmark");
    closeIcons.forEach(icon => {
        icon.addEventListener("click", closeDialog);
    });

    dialog.addEventListener("click", function(event) {
        if (event.target === dialog) {
            closeDialog();
        }
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" || event.key === 27) {
            closeDialog();
        }
    });

    function closeDialog() {
        resetModal();
        dialog.style.display = "none";
        dialog.close();
    }
}

function resetModal() {
    const dialogContainer = document.querySelector(".dialog-container");
    const dialogAddWorks = document.querySelector(".dialog-add-works");
    const addPhotoForm = document.querySelector(".add-photo-form");
    const previewContainer = document.querySelector(".image-preview-container");
    const uploadContainer = document.querySelector(".photo-upload-container");

    dialogContainer.style.display = "flex";
    dialogAddWorks.style.display = "none";
    addPhotoForm.reset();

    previewContainer.innerHTML = '';
    previewContainer.style.display = "none";
    uploadContainer.style.display = "flex";
    checkFormValidity();
}

function checkFormValidity() {
    const photoInput = document.getElementById('ajouter-photo');
    const titleInput = document.getElementById('photo-title');
    const categorySelect = document.getElementById('photo-category');
    const submitButton = document.querySelector('.add-photo-form input[type="submit"]');

    if (photoInput.files.length > 0 && titleInput.value.trim() !== "" && categorySelect.value !== "") {
        submitButton.classList.add("enabled");
        submitButton.classList.remove("disabled");
    } else {
        submitButton.classList.add("disabled");
        submitButton.classList.remove("enabled");
    }
}

document.getElementById("ajouter-photo").addEventListener("change", function(event) {
    checkFormValidity();
    handleImagePreview(event);
});

document.getElementById('photo-title').addEventListener("input", checkFormValidity);
document.getElementById('photo-category').addEventListener("change", checkFormValidity);

document.querySelector(".ajout-photo").addEventListener("click", function() {
    const dialogContainer = document.querySelector(".dialog-container");
    const dialogAddWorks = document.querySelector(".dialog-add-works");

    dialogContainer.style.display = "none";
    dialogAddWorks.style.display = "flex";
    fetchCategories();
});

document.querySelector(".fa-arrow-left").addEventListener("click", resetModal);

document.querySelector(".add-photo-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    if (document.querySelector('.add-photo-form input[type="submit"]').disabled) return;
    await postNewWork();
});

async function fetchWorks() {
    const works = await getProjets();
    const worksDiv = document.querySelector(".works");
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
        deleteIcon.dataset.id = work.id;

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
    const photoCategorySelect = document.getElementById('photo-category');

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
    formData.append("image", document.getElementById('ajouter-photo').files[0]);
    formData.append("title", document.getElementById('photo-title').value);
    formData.append("category", document.getElementById('photo-category').value);

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
        const dialog = document.querySelector("dialog");
        dialog.style.display = "none";
        dialog.close();
    }
}

function handleImagePreview(event) {
    const previewContainer = document.querySelector(".image-preview-container");
    const uploadContainer = document.querySelector(".photo-upload-container");
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.classList.add("preview-image");

            previewContainer.innerHTML = ''; 
            previewContainer.appendChild(img);
            previewContainer.style.display = "flex";

            uploadContainer.style.display = "none";
        };
        reader.readAsDataURL(file);
    } else {
        previewContainer.innerHTML = '';
        previewContainer.style.display = "none";
        uploadContainer.style.display = "flex";
    }
}

checkFormValidity();
