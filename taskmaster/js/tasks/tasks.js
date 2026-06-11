/* ============================================================
   TASKMASTER — LÓGICA PRINCIPAL DE TAREAS (CRUD + STORAGE)
   ============================================================ */

// Lista global de tareas
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* ============================================================
   CREAR TAREA
   ============================================================ */
export function createTask(taskData) {
    const newTask = {
        id: crypto.randomUUID(),
        title: taskData.title,
        description: taskData.description,
        date: taskData.date,
        priority: taskData.priority,
        tags: taskData.tags || [],
        completed: false,
        createdAt: Date.now()
    };

    tasks.push(newTask);
    saveTasks();
    return newTask;
}

/* ============================================================
   EDITAR TAREA
   ============================================================ */
export function updateTask(id, updatedData) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, ...updatedData } : task
    );

    saveTasks();
}

/* ============================================================
   ELIMINAR TAREA
   ============================================================ */
export function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
}

/* ============================================================
   COMPLETAR / DESCOMPLETAR TAREA
   ============================================================ */
export function toggleComplete(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );

    saveTasks();
}

/* ============================================================
   BUSCAR TAREAS
   ============================================================ */
export function searchTasks(query) {
    return tasks.filter(task =>
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description.toLowerCase().includes(query.toLowerCase())
    );
}

/* ============================================================
   FILTRAR POR PRIORIDAD
   ============================================================ */
export function filterByPriority(priority) {
    return tasks.filter(task => task.priority === priority);
}

/* ============================================================
   FILTRAR POR ESTADO
   ============================================================ */
export function filterByStatus(status) {
    if (status === "completed") return tasks.filter(t => t.completed);
    if (status === "pending") return tasks.filter(t => !t.completed);
    return tasks;
}

/* ============================================================
   GUARDAR EN LOCALSTORAGE
   ============================================================ */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ============================================================
   OBTENER TODAS LAS TAREAS
   ============================================================ */
export function getTasks() {
    return tasks;
}
