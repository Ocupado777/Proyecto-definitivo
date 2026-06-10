document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggleBtn = document.getElementById("theme-toggle");
  const logo = document.getElementById("auth-logo");
  const registerForm = document.getElementById("register-form");
  const authMessage = document.getElementById("auth-message");

  const LOGO_LIGHT = "../assets/img/logo-light.png";
  const LOGO_DARK = "../assets/img/logo-dark.png";

  /* Aplicar tema antes de mostrar */
  const savedTheme = localStorage.getItem("taskmaster-theme") || "theme-light";
  body.className = savedTheme;

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

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = registerForm.name.value.trim();
    const email = registerForm.email.value.trim();
    const pass = registerForm.password.value.trim();
    const confirm = registerForm.confirm.value.trim();

    if (!name || !email || !pass || !confirm) {
      authMessage.textContent = "Completa todos los campos.";
      return;
    }

    if (pass !== confirm) {
      authMessage.textContent = "Las contraseñas no coinciden.";
      return;
    }

    const users = JSON.parse(localStorage.getItem("taskmaster-users") || "[]");

    if (users.some(u => u.email === email)) {
      authMessage.textContent = "Este correo ya está registrado.";
      return;
    }

    users.push({ name, email, password: pass });
    localStorage.setItem("taskmaster-users", JSON.stringify(users));

    authMessage.textContent = "Cuenta creada con éxito. Redirigiendo…";

    setTimeout(() => {
      window.location.href = "../login/index.html";
    }, 1200);
  });
});
