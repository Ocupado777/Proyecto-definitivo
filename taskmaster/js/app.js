// Cargar usuario activo
const activeUser = JSON.parse(localStorage.getItem("activeUser"));

const userNameSpan = document.getElementById("userName");
const userAvatarDiv = document.getElementById("userAvatar");

if (activeUser) {
    userNameSpan.textContent = activeUser.name || activeUser.email;
    userAvatarDiv.textContent = (activeUser.name || activeUser.email)[0].toUpperCase();
} else {
    userNameSpan.textContent = "Invitado";
    userAvatarDiv.textContent = "I";
}
