//  verifica login
const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

if (!loggedUser) {
  window.location.href = "login.html";
}


const userNameSpan = document.getElementById("userName");

if (userNameSpan) {
  userNameSpan.innerText = loggedUser.name;
}

// mostra nome do usuário
document.getElementById("userGreeting").innerText =
  `Olá, ${loggedUser.name}!`;


const API_URL = "http://localhost:8080/tarefas";

let tasks = [];
let selectedPriority = "normal";


/* =========================
   PRIORIDADE
========================= */
document.querySelectorAll(".priority-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".priority-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedPriority = btn.dataset.level;
  });
});

/* =========================
   API
========================= */
async function fetchTasks() {
  const res = await fetch(API_URL);
  tasks = await res.json();
  renderTasks();
  updateStats();
}

async function createTask(task) {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task)
  });
  fetchTasks();
}

async function updateTask(task) {
  await fetch(`${API_URL}/${task.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task)
  });
  fetchTasks();
}

async function deleteTaskApi(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchTasks();
}

/* =========================
   RENDER
========================= */
function renderTasks(filterStatus = "all") {
  const taskList = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");

  taskList.innerHTML = "";

  let filtered = tasks;

  if (filterStatus === "pending") {
    filtered = tasks.filter(t => !t.concluida);
  }
  if (filterStatus === "done") {
    filtered = tasks.filter(t => t.concluida);
  }

  emptyState.classList.toggle("d-none", filtered.length > 0);

  filtered.forEach(task => {
    const card = document.createElement("div");
    card.className = "task-item";

    card.innerHTML = `
      <div class="d-flex justify-content-between">
        <div>
          <h6 class="${task.concluida ? "text-decoration-line-through" : ""}">
            ${task.titulo}
          </h6>
          <p class="mb-1">${task.descricao}</p>
          <small class="text-muted">Prioridade: ${task.prioridade}</small>
        </div>

        <div class="d-flex gap-2">
          <input type="checkbox" ${task.concluida ? "checked" : ""}
            onchange="toggleTask(${task.id})">
          <i class="bi bi-trash text-danger" onclick="deleteTask(${task.id})"></i>
        </div>
      </div>
    `;

    taskList.appendChild(card);
  });
}

/* =========================
   STATS
========================= */
function updateStats() {
  document.getElementById("total").innerText = `${tasks.length} total`;
  document.getElementById("done").innerText =
    `${tasks.filter(t => t.concluida).length} concluídas`;
  document.getElementById("pending").innerText =
    `${tasks.filter(t => !t.concluida).length} pendentes`;

  document.getElementById("pendingCount").innerText =
    `${tasks.filter(t => !t.concluida).length} pendentes`;
}

/* =========================
   AÇÕES
========================= */
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  task.concluida = !task.concluida;
  updateTask(task);
}

function deleteTask(id) {
  deleteTaskApi(id);
}

/* =========================
   ADD TASK
========================= */
document.getElementById("addTask").addEventListener("click", () => {
  const titulo = document.getElementById("tasktitulo").value.trim();
  const descricao = document.getElementById("taskdescricao").value.trim();

  if (!titulo) return alert("Digite o nome da tarefa");

  const newTask = {
    titulo,
    descricao,
    prioridade: selectedPriority,
    concluida: false,
    usuario: { id: loggedUser.id }
  };

  createTask(newTask);

  document.getElementById("tasktitulo").value = "";
  document.getElementById("taskdescricao").value = "";
});

/* =========================
   FILTROS
========================= */
document.querySelectorAll("[data-status]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-status]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderTasks(btn.dataset.status);
  });
});

/* =========================
   INIT
========================= */
fetchTasks();
