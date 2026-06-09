// ============================
// CALENDARIO COMPLETO (MENSUAL)
// ============================

// Mes y año actuales
let calMonth = new Date().getMonth();
let calYear = new Date().getFullYear();

// Selectores de mes y año
let monthSelect = null;
let yearSelect = null;

// Inicializar selectores
function loadMonthYearSelectors() {
  monthSelect = document.getElementById("cal-month-select");
  yearSelect = document.getElementById("cal-year-select");

  if (!monthSelect || !yearSelect) return;

  const months = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  monthSelect.innerHTML = months
    .map((m, i) => `<option value="${i}">${m}</option>`)
    .join("");

  let years = "";
  for (let y = 2020; y <= 2035; y++) {
    years += `<option value="${y}">${y}</option>`;
  }
  yearSelect.innerHTML = years;

  monthSelect.value = calMonth;
  yearSelect.value = calYear;

  monthSelect.onchange = () => {
    calMonth = Number(monthSelect.value);
    renderFullCalendar();
  };

  yearSelect.onchange = () => {
    calYear = Number(yearSelect.value);
    renderFullCalendar();
  };
}
// ============================
// RENDER PRINCIPAL DEL CALENDARIO
// ============================

function renderFullCalendar() {
  const monthYearLabel = document.getElementById("cal-month-year");
  const daysContainer = document.getElementById("calendar-days");

  const tasks = getTasks();

  monthYearLabel.textContent = `${getMonthName(calMonth)} ${calYear}`;
  daysContainer.innerHTML = "";

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  // Espacios vacíos
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    daysContainer.innerHTML += `<div></div>`;
  }

  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(calYear, calMonth + 1, day);
    const hasTasks = tasks.some(t => t.date === dateStr);

    daysContainer.innerHTML += `
      <div class="calendar-day ${hasTasks ? "has-task" : ""}" data-date="${dateStr}">
        <span class="day-number">${day}</span>
        ${hasTasks ? `<div class="task-dot"></div>` : ""}
      </div>
    `;
  }

  // Click en un día
  document.querySelectorAll(".calendar-day").forEach(day => {
    day.addEventListener("click", () => {
      const date = day.dataset.date;
      openDayPanel(date);
    });
  });
}
// ============================
// PANEL LATERAL PARA VER TAREAS DEL DÍA
// ============================

function openDayPanel(date) {
  const panel = document.getElementById("calendar-day-panel");
  const title = document.getElementById("calendar-day-title");
  const content = document.getElementById("calendar-day-content");
  const btnNew = document.getElementById("calendar-day-new-task");

  const tasks = getTasks().filter(t => t.date === date);

  title.textContent = `Tareas del ${date}`;
  content.innerHTML = "";

  if (tasks.length === 0) {
    content.innerHTML = `<p class="panel-placeholder">No hay tareas para este día.</p>`;
  } else {
    tasks.forEach(t => {
      content.innerHTML += `
        <div class="task-item">
          <h4>${t.title}</h4>
          <p>${t.desc}</p>
          <p><strong>Hora:</strong> ${t.time || "Sin hora"}</p>
          <p><strong>Prioridad:</strong> ${t.priority}</p>
        </div>
      `;
    });
  }

  btnNew.onclick = () => {
    document.getElementById("task-date").value = date;
    const modal = new bootstrap.Modal(document.getElementById("modalNewTask"));
    modal.show();
  };

  panel.classList.add("open");
}

// Cerrar panel
document.getElementById("calendar-day-close").onclick = () => {
  document.getElementById("calendar-day-panel").classList.remove("open");
};
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

    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      daysContainer.innerHTML += `<div class="mini-cal-empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(year, month + 1, day);
      const hasTasks = tasks.some(t => t.date === dateStr);

      daysContainer.innerHTML += `
        <div class="mini-cal-day ${hasTasks ? "has-task" : ""}" data-date="${dateStr}">
          ${day}
        </div>
      `;
    }

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

    document.querySelectorAll(".mini-cal-day").forEach(day => {
      day.addEventListener("click", () => {
        const date = day.dataset.date;
        openDayPanel(date);
      });
    });
  }

  generateCalendar(currentMonth, currentYear);
}

// ============================
// FUNCIONES AUXILIARES
// ============================

function getMonthName(monthIndex) {
  const months = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];
  return months[monthIndex];
}

function formatDate(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
// ============================
// INICIALIZACIÓN
// ============================

document.addEventListener("DOMContentLoaded", () => {
  loadMonthYearSelectors();
  renderFullCalendar();
  renderMiniCalendar();
});
