const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

themeToggle.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    html.setAttribute("data-theme", next);
    themeToggle.textContent = next === "light" ? "🌙" : "☀️";
    localStorage.setItem("theme", next);
});

// Cargar tema guardado
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    html.setAttribute("data-theme", savedTheme);
    themeToggle.textContent = savedTheme === "light" ? "🌙" : "☀️";
}
