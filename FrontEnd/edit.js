document.addEventListener("DOMContentLoaded", function() {
    const editBar = document.getElementById("editBar");
    const modifier = document.querySelector(".modifier");
    const token = localStorage.getItem("token");

    if (token) {
        if (editBar) {
            editBar.style.display = "flex";
        }
        if (modifier) {
            modifier.style.display = "flex";
        }
    }
});
