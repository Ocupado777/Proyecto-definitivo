const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("loginMessage");

// Cargar usuarios registrados
const users = JSON.parse(localStorage.getItem("users")) || [];

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validar campos vacíos
    if (!email || !password) {
        message.textContent = "Por favor completa todos los campos.";
        message.style.color = "red";
        return;
    }

    // Buscar usuario
    const user = users.find(u => u.email === email);

    if (!user) {
        message.textContent = "El usuario no existe.";
        message.style.color = "red";
        return;
    }

    // Validar contraseña
    if (user.password !== password) {
        message.textContent = "Contraseña incorrecta.";
        message.style.color = "red";
        return;
    }

    // Guardar sesión activa
    localStorage.setItem("activeUser", JSON.stringify(user));

    // Mensaje premium
    message.textContent = "Inicio de sesión exitoso. Redirigiendo...";
    message.style.color = "var(--accent)";

    // Redirigir
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1500);
});
