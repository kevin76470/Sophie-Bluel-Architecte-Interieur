document.addEventListener("DOMContentLoaded", function() {
    const editBar = document.getElementById("editBar");
    const modifier = document.querySelector(".modifier");
    const token = localStorage.getItem("token");
    const dialog = document.querySelector("dialog");
    const closeIcon = document.querySelector(".fa-xmark");

    if (token) {
        editBar.style.display = "flex";
        modifier.style.display = "flex";
        modifier.addEventListener("click", function() {
            dialog.style.display = "flex";
            dialog.showModal();
        });
    };

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
});


