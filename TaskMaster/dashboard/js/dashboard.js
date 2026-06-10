document.addEventListener("DOMContentLoaded", () => {

  // ============================
  // TEMA
  // ============================
  const body = document.body;
  const themeToggleBtn = document.getElementById("theme-toggle");
  const sidebarLogo = document.getElementById("sidebar-logo");

  const LOGO_LIGHT = "../assets/img/logo-light.png";
  const LOGO_DARK = "../assets/img/logo-dark.png";

  const savedTheme = localStorage.getItem("taskmaster-theme") || "theme-light";
  body.className = savedTheme;

  function updateLogo() {
    sidebarLogo.src = body.classList.contains("theme-dark") ? LOGO_LIGHT : LOGO_DARK;
  }

  function updateThemeIcon() {
    themeToggleBtn.textContent = body.classList.contains("theme-dark") ? "☀️" : "🌙";
  }

  updateLogo();
  updateThemeIcon();

  document.documentElement.style.visibility = "visible";

  themeToggleBtn.addEventListener("click", () => {
    body.classList.toggle("theme-dark");
    body.classList.toggle("theme-light");

    localStorage.setItem("taskmaster-theme", body.className);

    updateLogo();
    updateThemeIcon();
  });

  // ============================
  // USUARIO ACTIVO
  // ============================
  const currentUser = JSON.parse(localStorage.getItem("taskmaster-current-user"));
  const userNameSpan = document.getElementById("user-name");
  const userAvatarInitial = document.getElementById("user-avatar-initial");

  if (currentUser) {
    userNameSpan.textContent = currentUser.name;
    userAvatarInitial.textContent = currentUser.name.charAt(0).toUpperCase();
  }

  // ============================
  // NAVEGACIÓN INTERNA
  // ============================
  const navDashboard = document.getElementById("nav-dashboard");
  const navTasks = document.getElementById("nav-tasks");
  const navProjects = document.getElementById("nav-projects");
  const navCalendar = document.getElementById("nav-calendar");

  const dashboardView = document.querySelector(".app-content");
  const tasksView = document.getElementById("tasks-view");
  const projectsView = document.getElementById("projects-view");
  const projectTasksView = document.getElementById("project-tasks-view");
  const calendarView = document.getElementById("calendar-view");

  function setActiveNav(button) {
    document.querySelectorAll(".sidebar-nav .nav-item").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
  }

  // ============================
  // CAMBIO DE VISTAS
  // ============================
  function showDashboard() {
    dashboardView.classList.remove("hidden");
    tasksView.classList.add("hidden");
    projectsView.classList.add("hidden");
    projectTasksView.classList.add("hidden");
    calendarView.classList.add("hidden");

    setActiveNav(navDashboard);
    renderTasks();
    renderDashboardProjectsPreview();
  }

  function showTasksView() {
    dashboardView.classList.add("hidden");
    tasksView.classList.remove("hidden");
    projectsView.classList.add("hidden");
    projectTasksView.classList.add("hidden");
    calendarView.classList.add("hidden");

    setActiveNav(navTasks);
    renderTasks();
  }

  function showProjectsView() {
    dashboardView.classList.add("hidden");
    tasksView.classList.add("hidden");
    projectsView.classList.remove("hidden");
    projectTasksView.classList.add("hidden");
    calendarView.classList.add("hidden");

    setActiveNav(navProjects);
    renderProjects();
  }

  function showProjectTasksView(project) {
    dashboardView.classList.add("hidden");
    tasksView.classList.add("hidden");
    projectsView.classList.add("hidden");
    projectTasksView.classList.remove("hidden");
    calendarView.classList.add("hidden");

    document.getElementById("project-tasks-title").textContent = project.name;

    currentProjectIdForTasks = project.id;

    renderProjectProgress(project.id);
    renderProjectTasks(project.id);
  }

  navDashboard.addEventListener("click", showDashboard);
  navTasks.addEventListener("click", showTasksView);
  navProjects.addEventListener("click", showProjectsView);

  // ============================
  // CALENDARIO COMPLETO
  // ============================
  navCalendar.addEventListener("click", () => {
    dashboardView.classList.add("hidden");
    tasksView.classList.add("hidden");
    projectsView.classList.add("hidden");
    projectTasksView.classList.add("hidden");

    calendarView.classList.remove("hidden");

    setActiveNav(navCalendar);
    renderFullCalendar();
  });

    // ============================
  // PANEL LATERAL DE TAREA
  // ============================
  const detailPanel = document.getElementById("task-detail-panel");
  const detailTitle = document.getElementById("detail-title");
  const detailDesc = document.getElementById("detail-desc");
  const detailPriority = document.getElementById("detail-priority");
  const detailDate = document.getElementById("detail-date");
  const detailStatus = document.getElementById("detail-status");
  const detailClose = document.getElementById("detail-close");
  const detailEditBtn = document.getElementById("detail-edit-btn");

  let currentTaskId = null;
  let currentFilter = "all";
  let currentProjectIdForTasks = null;

  detailClose.addEventListener("click", () => {
    detailPanel.classList.remove("open");
    currentTaskId = null;
  });

  // ============================
  // SISTEMA DE TAREAS
  // ============================
  function getTasks() {
    return JSON.parse(localStorage.getItem("taskmaster-tasks") || "[]");
  }

  function saveTasks(tasks) {
    localStorage.setItem("taskmaster-tasks", JSON.stringify(tasks));
  }

  function fixOldTasks() {
    let tasks = getTasks();
    let changed = false;

    tasks = tasks.map(t => {
      if (!t.id) {
        t.id = Date.now() + Math.floor(Math.random() * 1000);
        changed = true;
      }
      if (t.done === undefined) {
        t.done = false;
        changed = true;
      }
      if (t.projectId === undefined) {
        t.projectId = null;
        changed = true;
      }
      return t;
    });

    if (changed) saveTasks(tasks);
  }

  function applyFilter(tasks) {
    if (currentFilter === "pending") return tasks.filter(t => !t.done);
    if (currentFilter === "done") return tasks.filter(t => t.done);
    if (["alta", "media", "baja"].includes(currentFilter))
      return tasks.filter(t => t.priority === currentFilter);
    return tasks;
  }

  function taskHTML(task) {
    return `
      <div class="task-item ${task.done ? "done" : ""}">
        <div class="task-header">
          <h4 class="task-title">${task.title}</h4>
          <span class="task-priority priority-${task.priority}">
            ${task.priority === "alta" ? "🔥 Alta" : task.priority === "media" ? "⚡ Media" : "🌱 Baja"}
          </span>
        </div>

        <p class="task-desc">${task.desc}</p>

        <div class="task-footer">
          <span class="task-date">📅 ${task.date}</span>
          <div class="task-actions">
            <button class="task-btn-complete" data-id="${task.id}">
              ${task.done ? "↩ Desmarcar" : "✔ Completar"}
            </button>
            <button class="task-btn-delete" data-id="${task.id}">🗑 Eliminar</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderTasks() {
    let tasks = getTasks().filter(t => t.projectId === null);
    tasks = applyFilter(tasks);

    const dashboardPanel = document.querySelector(".content-grid .panel-body");
    const tasksList = document.getElementById("tasks-list");

    dashboardPanel.innerHTML = "";
    tasksList.innerHTML = "";

    if (tasks.length === 0) {
      const emptyHtml = `<p class="panel-placeholder">No hay tareas para este filtro.</p>`;
      dashboardPanel.innerHTML = emptyHtml;
      tasksList.innerHTML = emptyHtml;
      return;
    }

    tasks.forEach(task => {
      const html = taskHTML(task);
      dashboardPanel.insertAdjacentHTML("beforeend", html);
      tasksList.insertAdjacentHTML("beforeend", html);
    });

    attachTaskEvents();
  }

  function renderProjectTasks(projectId) {
    let tasks = getTasks().filter(t => t.projectId === projectId);
    tasks = applyFilter(tasks);

    const list = document.getElementById("project-tasks-list");
    list.innerHTML = "";

    if (tasks.length === 0) {
      list.innerHTML = `<p class="panel-placeholder">No hay tareas en este proyecto.</p>`;
      return;
    }

    tasks.forEach(task => {
      list.insertAdjacentHTML("beforeend", taskHTML(task));
    });

    attachTaskEvents();
  }

  function attachTaskEvents() {
    const tasks = getTasks();

    document.querySelectorAll(".task-btn-complete").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        const updated = tasks.map(t =>
          t.id === id ? { ...t, done: !t.done } : t
        );
        saveTasks(updated);

        updateAllProgressBars();

        if (currentProjectIdForTasks !== null) {
          renderProjectTasks(currentProjectIdForTasks);
        } else {
          renderTasks();
        }
      });
    });

    document.querySelectorAll(".task-btn-delete").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        const updated = tasks.filter(t => t.id !== id);
        saveTasks(updated);

        updateAllProgressBars();

        if (currentProjectIdForTasks !== null) {
          renderProjectTasks(currentProjectIdForTasks);
        } else {
          renderTasks();
        }
      });
    });

    document.querySelectorAll(".task-item").forEach(item => {
      item.addEventListener("click", (e) => {
        if (e.target.closest(".task-btn-complete") || e.target.closest(".task-btn-delete")) return;

        const id = Number(item.querySelector(".task-btn-complete").dataset.id);
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        currentTaskId = id;

        detailTitle.textContent = task.title;
        detailDesc.textContent = task.desc;
        detailPriority.textContent =
          task.priority === "alta" ? "Alta 🔥" :
          task.priority === "media" ? "Media ⚡" :
          "Baja 🌱";
        detailDate.textContent = task.date;
        detailStatus.textContent = task.done ? "Completada ✅" : "Pendiente ⏳";

        detailPanel.classList.add("open");
      });
    });
  }

  // ============================
  // LIMPIAR FORMULARIO DE TAREA
  // ============================
  function clearTaskForm() {
    document.getElementById("task-title").value = "";
    document.getElementById("task-desc").value = "";
    document.getElementById("task-priority").value = "media";
    document.getElementById("task-date").value = "";
  }

  document.getElementById("btn-new-task").addEventListener("click", () => {
    clearTaskForm();
    const modal = new bootstrap.Modal(document.getElementById("modalNewTask"));
    modal.show();
  });

  document.getElementById("btn-new-task-project").addEventListener("click", () => {
    clearTaskForm();
    const modal = new bootstrap.Modal(document.getElementById("modalNewTask"));
    modal.show();
  });

  // ============================
  // GUARDAR TAREA
  // ============================
  document.getElementById("btn-save-task").addEventListener("click", () => {
    const title = document.getElementById("task-title").value.trim();
    const desc = document.getElementById("task-desc").value.trim();
    const priority = document.getElementById("task-priority").value;
    const date = document.getElementById("task-date").value;

    if (!title || !desc || !date) {
      alert("Completa todos los campos.");
      return;
    }

    let tasks = getTasks();

    if (currentTaskId) {
      tasks = tasks.map(t =>
        t.id === currentTaskId
          ? { ...t, title, desc, priority, date }
          : t
      );
      currentTaskId = null;
    } else {
      tasks.push({
        id: Date.now(),
        title,
        desc,
        priority,
        date,
        done: false,
        projectId: currentProjectIdForTasks
      });
    }

    saveTasks(tasks);

    const modal = bootstrap.Modal.getInstance(document.getElementById("modalNewTask"));
    modal.hide();

    clearTaskForm();

    updateAllProgressBars();

    if (currentProjectIdForTasks !== null) {
      renderProjectTasks(currentProjectIdForTasks);
    } else {
      renderTasks();
    }
  });

  // ============================
  // FILTROS
  // ============================
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentFilter = btn.dataset.filter;

      if (currentProjectIdForTasks !== null) {
        renderProjectTasks(currentProjectIdForTasks);
      } else {
        renderTasks();
      }
    });
  });
  // ============================
  // SISTEMA DE PROYECTOS
  // ============================
  function getProjects() {
    return JSON.parse(localStorage.getItem("taskmaster-projects") || "[]");
  }

  function saveProjects(projects) {
    localStorage.setItem("taskmaster-projects", JSON.stringify(projects));
  }

  function renderProjects() {
  const projects = getProjects();
  const list = document.getElementById("projects-list");
  list.innerHTML = "";

  if (projects.length === 0) {
    list.innerHTML = `<p class="panel-placeholder">Aún no tienes proyectos creados.</p>`;
    return;
  }

  projects.forEach(p => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.style.borderLeft = `4px solid ${p.color}`;

    const progress = calculateProjectProgress(p.id);

    card.innerHTML = `
      <h4 class="project-title">${p.name}</h4>
      <p class="project-desc">${p.desc}</p>
      <p class="project-desc">Creado: ${p.createdAt}</p>

      <div class="progress-container">
        <div class="progress-fill" style="width: ${progress.percent}%"></div>
      </div>
      <p class="progress-text">${progress.done} de ${progress.total} tareas (${progress.percent}%)</p>

      <div class="project-actions">
        <button class="btn-complete-project" data-id="${p.id}">
          ${p.completed ? "↩ Reabrir" : "✔ Completar"}
        </button>
        <button class="btn-delete-project" data-id="${p.id}">🗑 Eliminar</button>
      </div>
    `;

    // Abrir panel lateral
    card.addEventListener("click", () => {
      currentProjectId = p.id;
      projectDetailTitle.textContent = p.name;
      projectDetailDesc.textContent = p.desc;
      projectDetailColor.textContent = p.color;
      projectDetailDate.textContent = p.createdAt;
      renderProjectDetailProgress(p.id);
      projectDetailPanel.classList.add("open");
    });

    // Doble clic → ver tareas del proyecto
    card.addEventListener("dblclick", () => {
      showProjectTasksView(p);
    });

    list.appendChild(card);
  });

  attachProjectEvents();
}

function attachProjectEvents() {
  let projects = getProjects();

  // Completar / Reabrir proyecto
  document.querySelectorAll(".btn-complete-project").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      projects = projects.map(p =>
        p.id === id ? { ...p, completed: !p.completed } : p
      );
      saveProjects(projects);
      renderProjects();
      renderDashboardProjectsPreview();
    });
  });

  // Eliminar proyecto
  document.querySelectorAll(".btn-delete-project").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      projects = projects.filter(p => p.id !== id);
      saveProjects(projects);
      renderProjects();
      renderDashboardProjectsPreview();
    });
  });
}

  // ============================
  // PANEL LATERAL DE PROYECTO
  // ============================
  const projectDetailPanel = document.getElementById("project-detail-panel");
  const projectDetailTitle = document.getElementById("project-detail-title");
  const projectDetailDesc = document.getElementById("project-detail-desc");
  const projectDetailColor = document.getElementById("project-detail-color");
  const projectDetailDate = document.getElementById("project-detail-date");
  const projectDetailClose = document.getElementById("project-detail-close");
  const projectDetailEditBtn = document.getElementById("project-detail-edit-btn");

  let currentProjectId = null;

  projectDetailClose.addEventListener("click", () => {
    projectDetailPanel.classList.remove("open");
    currentProjectId = null;
  });

  // ============================
  // PROGRESO PREMIUM
  // ============================
  function calculateProjectProgress(projectId) {
    const tasks = getTasks().filter(t => t.projectId === projectId);
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    return { total, done, percent };
  }

  function renderProjectDetailProgress(projectId) {
    const progress = calculateProjectProgress(projectId);
    const container = document.getElementById("project-detail-progress");

    container.innerHTML = `
      <div class="progress-container">
        <div class="progress-fill" style="width: ${progress.percent}%"></div>
      </div>
      <p class="progress-text">${progress.done} de ${progress.total} tareas (${progress.percent}%)</p>
    `;
  }

  function renderProjectProgress(projectId) {
    const progress = calculateProjectProgress(projectId);
    const container = document.getElementById("project-tasks-progress");

    container.innerHTML = `
      <div class="progress-container">
        <div class="progress-fill" style="width: ${progress.percent}%"></div>
      </div>
      <p class="progress-text">${progress.done} de ${progress.total} tareas (${progress.percent}%)</p>
    `;
  }

  function updateAllProgressBars() {
    renderProjects();

    if (currentProjectIdForTasks !== null) {
      renderProjectProgress(currentProjectIdForTasks);
    }

    if (currentProjectId !== null) {
      renderProjectDetailProgress(currentProjectId);
    }

    renderDashboardProjectsPreview();
  }

  // ============================
  // PREVIEW DE PROYECTOS EN DASHBOARD
  // ============================
  function renderDashboardProjectsPreview() {
    const container = document.getElementById("dashboard-projects-preview");
    const projects = getProjects();

    container.innerHTML = "";

    if (projects.length === 0) {
      container.innerHTML = `<p class="panel-placeholder">No tienes proyectos aún.</p>`;
      return;
    }

    projects.slice(0, 3).forEach(p => {
      const progress = calculateProjectProgress(p.id);

      const card = document.createElement("div");
      card.className = "project-card small";

      card.innerHTML = `
        <h4 class="project-title">${p.name}</h4>

        <div class="progress-container">
          <div class="progress-fill" style="width: ${progress.percent}%"></div>
        </div>

        <p class="progress-text">${progress.done} de ${progress.total} tareas (${progress.percent}%)</p>
      `;

      card.addEventListener("dblclick", () => {
        showProjectTasksView(p);
      });

      container.appendChild(card);
    });
  }

  // ============================
  // CREAR / EDITAR PROYECTOS
  // ============================
  const btnNewProject = document.getElementById("btn-new-project");
  const btnSaveProject = document.getElementById("btn-save-project");

  btnNewProject.addEventListener("click", () => {
    document.getElementById("project-name").value = "";
    document.getElementById("project-desc").value = "";
    document.getElementById("project-color").value = "#7b5cff";

    const modal = new bootstrap.Modal(document.getElementById("modalNewProject"));
    modal.show();
  });

  btnSaveProject.addEventListener("click", () => {
    const name = document.getElementById("project-name").value.trim();
    const desc = document.getElementById("project-desc").value.trim();
    const color = document.getElementById("project-color").value;

    if (!name || !desc) {
      alert("Completa nombre y descripción del proyecto.");
      return;
    }

    let projects = getProjects();

    if (currentProjectId) {
      projects = projects.map(p =>
        p.id === currentProjectId
          ? { ...p, name, desc, color }
          : p
      );
      currentProjectId = null;
    } else {
      projects.push({
        id: Date.now(),
        name,
        desc,
        color,
        createdAt: new Date().toLocaleDateString()
      });
    }

    saveProjects(projects);

    const modal = bootstrap.Modal.getInstance(document.getElementById("modalNewProject"));
    modal.hide();

    renderProjects();
    renderDashboardProjectsPreview();
  });

  projectDetailEditBtn.addEventListener("click", () => {
    if (!currentProjectId) return;

    const projects = getProjects();
    const project = projects.find(p => p.id === currentProjectId);
    if (!project) return;

    document.getElementById("project-name").value = project.name;
    document.getElementById("project-desc").value = project.desc;
    document.getElementById("project-color").value = project.color;

    const modal = new bootstrap.Modal(document.getElementById("modalNewProject"));
    modal.show();
  });

  // ============================
  // BOTÓN VOLVER (PROYECTO)
  // ============================
  document.getElementById("btn-back-project").addEventListener("click", () => {
    currentProjectIdForTasks = null;

    projectTasksView.classList.add("hidden");
    projectsView.classList.remove("hidden");

    setActiveNav(navProjects);
    renderProjects();
  });
  // ============================
  // MINI CALENDARIO DEL DASHBOARD
  // ============================
  function renderMiniCalendar() {
    const container = document.getElementById("dashboard-mini-calendar");
    if (!container) return;

    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    function generateCalendar(month, year) {
      const tasks = getTasks();

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      container.innerHTML = `
        <div class="mini-cal-header">
          <button id="mini-cal-prev">◀</button>
          <h4>${getMonthName(month)} ${year}</h4>
          <button id="mini-cal-next">▶</button>
        </div>

        <div class="mini-cal-grid">
          <div class="mini-cal-dayname">L</div>
          <div class="mini-cal-dayname">M</div>
          <div class="mini-cal-dayname">X</div>
          <div class="mini-cal-dayname">J</div>
          <div class="mini-cal-dayname">V</div>
          <div class="mini-cal-dayname">S</div>
          <div class="mini-cal-dayname">D</div>
        </div>

        <div class="mini-cal-grid" id="mini-cal-days"></div>
      `;

      const daysContainer = document.getElementById("mini-cal-days");

      // Espacios vacíos antes del día 1
      for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
        daysContainer.innerHTML += `<div class="mini-cal-empty"></div>`;
      }

      // Días del mes
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDate(year, month + 1, day);

        const hasTasks = tasks.some(t => t.date === dateStr);

        daysContainer.innerHTML += `
          <div class="mini-cal-day ${hasTasks ? "has-task" : ""}" data-date="${dateStr}">
            ${day}
          </div>
        `;
      }

      // Navegación
      document.getElementById("mini-cal-prev").onclick = () => {
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
      };

      document.getElementById("mini-cal-next").onclick = () => {
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
      };

      // Clic en un día
      document.querySelectorAll(".mini-cal-day").forEach(day => {
        day.addEventListener("click", () => {
          const date = day.dataset.date;
          showTasksForDate(date);
        });
      });
    }

    generateCalendar(currentMonth, currentYear);
  }

  // ============================
  // FUNCIONES DE APOYO (FECHAS)
  // ============================
  function getMonthName(monthIndex) {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return months[monthIndex];
  }

  function formatDate(year, month, day) {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function showTasksForDate(date) {
    const tasks = getTasks().filter(t => t.date === date);

    if (tasks.length === 0) {
      alert(`No hay tareas para el ${date}`);
      return;
    }

    let msg = `Tareas para el ${date}:\n\n`;
    tasks.forEach(t => {
      msg += `• ${t.title} (${t.priority})\n`;
    });

    alert(msg);
  }
// ============================
// CALENDARIO COMPLETO DENTRO DEL DASHBOARD
// ============================
let calMonth = new Date().getMonth();
let calYear = new Date().getFullYear();

function loadMonthYearSelectors() {
  const monthSelect = document.getElementById("cal-month-select");
  const yearSelect = document.getElementById("cal-year-select");

  const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  monthSelect.innerHTML = months.map((m,i)=>`<option value="${i}">${m}</option>`).join("");
  let years = "";
  for (let y=2020; y<=2035; y++) years += `<option value="${y}">${y}</option>`;
  yearSelect.innerHTML = years;

  monthSelect.value = calMonth;
  yearSelect.value = calYear;

  monthSelect.onchange = () => { calMonth = Number(monthSelect.value); renderFullCalendar(); };
  yearSelect.onchange = () => { calYear = Number(yearSelect.value); renderFullCalendar(); };
}

function renderFullCalendar() {
  const daysContainer = document.getElementById("calendar-days");
  const tasks = getTasks();

  // Mostrar mes y año actual
  document.getElementById("cal-current").textContent = `${getMonthName(calMonth)} ${calYear}`;

  daysContainer.innerHTML = "";
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();

  // Espacios vacíos
  for (let i=0; i<(firstDay===0?6:firstDay-1); i++) {
    daysContainer.innerHTML += `<div></div>`;
  }

  // Días del mes
  for (let day=1; day<=daysInMonth; day++) {
    const dateStr = formatDate(calYear, calMonth+1, day);
    const hasTasks = tasks.some(t => t.date === dateStr);

    daysContainer.innerHTML += `
      <div class="calendar-day ${hasTasks?"has-task":""}" data-date="${dateStr}">
        <span class="day-number">${day}</span>
      </div>`;
  }

  // Eventos en cada día
  document.querySelectorAll(".calendar-day").forEach(dayEl => {
    const date = dayEl.dataset.date;

    // Clic simple → mostrar detalle de tareas
    dayEl.addEventListener("click", () => {
      showDayDetail(date);
    });
  });
}

// ============================
// DETALLE DE UN DÍA
// ============================
function showDayDetail(date) {
  const tasks = getTasks().filter(t => t.date === date);

  // Construimos el listado de tareas
  let html = `<h4>${date}</h4>`;

  if (tasks.length === 0) {
    html += `<p>No existen tareas para este día.</p>`;
  } else {
    html += `<ul>`;
    tasks.forEach(t => {
      html += `<li><strong>${t.title}</strong> (${t.priority}) - ${t.desc}</li>`;
    });
    html += `</ul>`;
  }

  // Mostramos el listado en un contenedor aparte (ejemplo: un div dentro del modal)
  const detailContainer = document.getElementById("task-detail-container");
  if (detailContainer) {
    detailContainer.innerHTML = html;
  } else {
    // si no existe, lo creamos dentro del modal sin borrar el formulario
    const modalBody = document.querySelector("#modalNewTask .modal-body");
    const div = document.createElement("div");
    div.id = "task-detail-container";
    div.innerHTML = html;
    modalBody.appendChild(div);
  }

  // Preseleccionamos la fecha en el formulario
  document.getElementById("task-date").value = date;

  // Abrimos el modal de tarea (con su formulario intacto)
  const taskModal = new bootstrap.Modal(document.getElementById("modalNewTask"));
  taskModal.show();
}

// ============================
// NAVEGACIÓN DEL CALENDARIO COMPLETO
// ============================
document.getElementById("cal-prev").onclick = () => {
  calMonth--;
  if (calMonth < 0) {
    calMonth = 11;
    calYear--;
  }
  renderFullCalendar();
};

document.getElementById("cal-next").onclick = () => {
  calMonth++;
  if (calMonth > 11) {
    calMonth = 0;
    calYear++;
  }
  renderFullCalendar();
};


  // ============================
  // INICIO
  // ============================
  fixOldTasks();
  renderTasks();
  renderDashboardProjectsPreview();
  showDashboard();
  renderMiniCalendar();

});

const modalEl = document.getElementById("modalNewTask");
modalEl.addEventListener("hidden.bs.modal", () => {
  document.body.classList.remove("modal-open");
  document.querySelectorAll(".modal-backdrop").forEach(b => b.remove());
});









