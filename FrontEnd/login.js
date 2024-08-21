const form = document.getElementById("login");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response data:", data);
        if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.href = "./index.html";
        } else {
            errorMessage.textContent = "Email ou mot de passe incorrect.";
        }
    })
    .catch(error => {
        console.error("Error during login:", error);
        errorMessage.textContent = "Une erreur est survenue. Veuillez réessayer.";
    });
});