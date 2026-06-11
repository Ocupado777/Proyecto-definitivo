/* ============================================================
   TASKMASTER — INTERFAZ DE TAREAS (UI + EVENTOS)
   ============================================================ */

import { 
    getTasks, 
    createTask, 
    updateTask, 
    deleteTask, 
    toggleComplete, 
    searchTasks 
} from "./task.js";

/* ============================================================
   ELEMENTOS DEL DOM
   ============================================================ */
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchTask");

const btnNewTask = document.getElementById("openNewTask");
const btnNewTask2 = document.getElementById("openNewTask2");

/* ============================================================
   RENDERIZAR TODAS LAS TAREAS
   ============================================================ */
export function renderTasks(tasks) {
    if (!tasks.length) {
        taskList.innerHTML = `
            <div class="col-12 text-center mt-4">
                <p style="color: var(--text-secondary); font-size: 15px;">
                    No hay tareas aún. Crea una nueva tarea para comenzar.
                </p>
            </div>
        `;
        return;
    }

    taskList.innerHTML = tasks.map(task => renderTaskCard(task)).join("");
}

/* ============================================================
   TARJETA PREMIUM DE UNA TAREA
   ============================================================ */
function renderTaskCard(task) {
    return `
        <div class="col-md-4">
            <div class="task-card">

                <h4 class="task-title">${task.title}</h4>
                <p class="task-desc">${task.description}</p>

                <div class="mt-2">
                    ${task.tags.map(t => `<span class="tag">${t}</span>`).join("")}
                </div>

                <div class="task-footer d-flex justify-content-between align-items-center mt-3">

                    <span class="priority-badge priority-${task.priority}">
                        ${formatPriority(task.priority)}
                    </span>

                    <div class="task-actions">
                        <button onclick="window.toggleTask('${task.id}')">✔</button>
                        <button onclick="window.editTask('${task.id}')">✏️</button>
                        <button onclick="window.removeTask('${task.id}')">🗑️</button>
                    </div>

                </div>

            </div>
        </div>
    `;
}

/* ============================================================
   FORMATEAR PRIORIDAD
   ============================================================ */
function formatPriority(priority) {
    switch (priority) {
        case "low": return "Baja";
        case "medium": return "Media";
        case "high": return "Alta";
        default: return "";
    }
}

/* ============================================================
   EVENTOS: COMPLETAR, EDITAR, ELIMINAR
   ============================================================ */
window.toggleTask = function(id) {
    toggleComplete(id);
    renderTasks(getTasks());
};

window.removeTask = function(id) {
    deleteTask(id);
    renderTasks(getTasks());
};

window.editTask = function(id) {
    const task = getTasks().find(t => t.id === id);
    alert("Aquí abriremos el modal de edición (próximo paso).");
};

/* ============================================================
   BUSCADOR DE TAREAS
   ============================================================ */
searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    if (query === "") {
        renderTasks(getTasks());
    } else {
        renderTasks(searchTasks(query));
    }
});

/* ============================================================
   BOTONES “NUEVA TAREA”
   ============================================================ */
btnNewTask?.addEventListener("click", () => {
    alert("Aquí abriremos el modal de nueva tarea (próximo paso).");
});

btnNewTask2?.addEventListener("click", () => {
    alert("Aquí abriremos el modal de nueva tarea (próximo paso).");
});

/* ============================================================
   INICIALIZAR
   ============================================================ */
renderTasks(getTasks());

/* ============================================================
   MODAL — ABRIR Y CERRAR
   ============================================================ */
const modal = document.getElementById("taskModal");
const btnSave = document.getElementById("saveTask");
const btnCancel = document.getElementById("cancelTask");

function openModal() {
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
    clearModalFields();
}

function clearModalFields() {
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskDate").value = "";
    document.getElementById("taskPriority").value = "low";
    document.getElementById("taskTags").value = "";
}

btnNewTask?.addEventListener("click", openModal);
btnNewTask2?.addEventListener("click", openModal);
btnCancel?.addEventListener("click", closeModal);

/* ============================================================
   GUARDAR NUEVA TAREA
   ============================================================ */
btnSave.addEventListener("click", () => {
    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();
    const date = document.getElementById("taskDate").value;
    const priority = document.getElementById("taskPriority").value;
    const tags = document.getElementById("taskTags").value.split(",").map(t => t.trim()).filter(t => t !== "");

    if (title === "") {
        alert("El título es obligatorio.");
        return;
    }

    const newTask = createTask({
        title,
        description,
        date,
        priority,
        tags
    });

    renderTasks(getTasks());
    closeModal();
});

