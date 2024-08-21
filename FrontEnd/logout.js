const userToken = localStorage.getItem("token");
const loginLink = document.getElementById("login-link");
const logoutLink = document.getElementById("logout-link");

if (userToken) {
    loginLink.style.display = "none";
    logoutLink.style.display = "block";
} else {
    loginLink.style.display = "block";
    logoutLink.style.display = "none";
}

logoutLink.addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "./index.html";
});