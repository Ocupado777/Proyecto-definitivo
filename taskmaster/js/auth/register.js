const form = document.getElementById("registerForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");
const message = document.getElementById("registerMessage");

// Cargar usuarios existentes
const users = JSON.parse(localStorage.getItem("users")) || [];

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirm = confirmInput.value.trim();

    // Validar campos vacíos
    if (!name || !email || !password || !confirm) {
        message.textContent = "Por favor completa todos los campos.";
        message.style.color = "red";
        return;
    }

    // Validar contraseñas iguales
    if (password !== confirm) {
        message.textContent = "Las contraseñas no coinciden.";
        message.style.color = "red";
        return;
    }

    // Validar si el correo ya existe
    const exists = users.some(u => u.email === email);

    if (exists) {
        message.textContent = "Este correo ya está registrado.";
        message.style.color = "red";
        return;
    }

    // Crear usuario
    const newUser = {
        name,
        email,
        password,
        avatar: null // para foto de perfil futura
    };

    // Guardar en LocalStorage
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Mensaje premium
    message.textContent = "Cuenta creada exitosamente. Redirigiendo al inicio de sesión...";
    message.style.color = "var(--accent)";

    // Redirigir al login
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
});
