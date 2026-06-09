document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggleBtn = document.getElementById("theme-toggle");
  const logo = document.getElementById("auth-logo");
  const loginForm = document.getElementById("login-form");
  const authMessage = document.getElementById("auth-message");

  const LOGO_LIGHT = "../assets/img/logo-light.png";
  const LOGO_DARK = "../assets/img/logo-dark.png";

  /* Aplicar tema antes de mostrar la página */
  const savedTheme = localStorage.getItem("taskmaster-theme") || "theme-light";
  body.className = savedTheme;

  /* Mostrar página sin parpadeo */
  document.documentElement.style.visibility = "visible";

  function updateLogo() {
    logo.src = body.classList.contains("theme-dark") ? LOGO_LIGHT : LOGO_DARK;
  }

  function updateThemeIcon() {
    themeToggleBtn.textContent = body.classList.contains("theme-dark") ? "☀️" : "🌙";
  }

  updateLogo();
  updateThemeIcon();

  themeToggleBtn.addEventListener("click", () => {
    body.classList.toggle("theme-dark");
    body.classList.toggle("theme-light");

    localStorage.setItem("taskmaster-theme", body.className);

    updateLogo();
    updateThemeIcon();
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = loginForm.email.value.trim();
    const pass = loginForm.password.value.trim();

    if (!email || !pass) {
      authMessage.textContent = "Completa todos los campos.";
      return;
    }

    const users = JSON.parse(localStorage.getItem("taskmaster-users") || "[]");
    const user = users.find(u => u.email === email && u.password === pass);

    if (!user) {
      authMessage.textContent = "Credenciales incorrectas.";
      return;
    }

    authMessage.textContent = "Inicio de sesión exitoso. Redirigiendo…";

    // Guardar usuario activo
    localStorage.setItem("taskmaster-current-user", JSON.stringify(user));

      setTimeout(() => {
      window.location.href = "../dashboard/index.html";
    }, 1200);
  });
});
