const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

if (!loggedUser) {
  window.location.href = "login.html";
}

// mostra o nome corretamente
document.getElementById("userName").innerText = `Olá, ${loggedUser.nome}!`;

const API_URL = "http://localhost:8080/tarefas";

let tasks = [];
let selectedPriority = "normal";


/* =========================
   PRIORIDADE
========================= */
let currentPriority = "all";

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
  renderTasks("all", currentPriority);
  updateStats();

  if (!taskTable.classList.contains("d-none")) {
    renderTable();
  }
}

async function createTask(task) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Erro ao criar tarefa:", error);
      alert("Erro ao criar tarefa. Veja o console.");
      return;
    }

    fetchTasks();
  } catch (err) {
    console.error("Falha de conexão:", err);
    alert("Backend não respondeu");
  }
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
const viewCardBtn = document.getElementById("viewCard");
const viewTableBtn = document.getElementById("viewTable");
const taskList = document.getElementById("taskList");
const taskTable = document.getElementById("taskTable");

viewCardBtn.addEventListener("click", () => {
  taskList.classList.remove("d-none");
  taskTable.classList.add("d-none");

  viewCardBtn.classList.add("active");
  viewTableBtn.classList.remove("active");
});

viewTableBtn.addEventListener("click", () => {
  taskList.classList.add("d-none");
  taskTable.classList.remove("d-none");

  viewTableBtn.classList.add("active");
  viewCardBtn.classList.remove("active");

  renderTable();
});

function renderTasks(filterStatus = "all", filterPriority = "all") {
  const taskList = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");

  taskList.innerHTML = "";

  let filtered = [...tasks];

  if (filterStatus === "pending") {
    filtered = filtered.filter(t => !t.concluida);
  }

  if (filterStatus === "done") {
    filtered = filtered.filter(t => t.concluida);
  }

  if (filterPriority !== "all") {
    filtered = filtered.filter(t => t.prioridade === filterPriority);
  }

  emptyState.classList.toggle("d-none", filtered.length > 0);

  filtered.forEach(task => {
    const card = document.createElement("div");
    card.className = `task-card-item ${task.concluida ? "task-done" : ""}`;

    card.innerHTML = `
      <div class="task-row">
    
        <div class="complete-btn ${task.concluida ? "done" : ""}"
             onclick="toggleTask(${task.id})">
        </div>
    
        <div class="task-content">
          <h6>${task.titulo}</h6>
          <small>${task.descricao}</small>
    
          <div class="mt-2">
            <span class="badge badge-${task.prioridade}">
              ${task.prioridade}
            </span>
          </div>
        </div>
    
        <div class="task-actions">
          <button class="btn btn-sm ed" onclick="editTask(${task.id})">
            <i class="bi bi-pencil"></i>
          </button>
    
          <button class="btn btn-sm de" onclick="deleteTask(${task.id})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
    
      </div>
    `;
    taskList.appendChild(card);
  });
}

function renderTable() {
  const tbody = document.querySelector("#taskTable tbody");
  tbody.innerHTML = "";

  tasks.forEach(task => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <div class="complete-btn ${task.concluida ? "done" : ""}"
        onclick="toggleTask(${task.id})">
       </div>
     </td>
      <td>${task.titulo}</td>
      <td class="desc-cell">${task.descricao}</td>
      <td><span class="badge badge-${task.prioridade}">
      ${task.prioridade}
       </span></td>
       <td class="task-actions">
       <button class="btn btn-sm ed" onclick="editTask(${task.id})">
         <i class="bi bi-pencil"></i>
       </button>
     
       <button class="btn btn-sm  de" onclick="deleteTask(${task.id})">
         <i class="bi bi-trash"></i>
       </button>
     </td>
    
    `;

    tbody.appendChild(tr);
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
const filterToggle = document.getElementById("filterToggle");
const filtersBox = document.getElementById("filters");

filterToggle.addEventListener("click", () => {
  filtersBox.classList.toggle("d-none");
});
document.querySelectorAll("[data-status]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-status]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderTasks(btn.dataset.status, currentPriority);
  });
});

/* =========================
   INIT
========================= */
fetchTasks();
