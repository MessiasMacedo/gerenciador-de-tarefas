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
async function fetchTasks(status = null, priority = null) {
  const emailLogado = loggedUser.email;

  let url = `http://localhost:8080/tarefas?email=${emailLogado}`;

  // filtro de status
  if (status === "pending") {
    url += `&concluida=false`;
  }

  if (status === "done") {
    url += `&concluida=true`;
  }

  // filtro de prioridade
  if (priority && priority !== "all") {
    url += `&prioridade=${priority}`;
  }

  const res = await fetch(url);
  tasks = await res.json();

  renderTasks();
  updateStats();
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
function renderTasks() {
  const taskList = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");
  const tbody = document.querySelector("#taskTable tbody");
  const tableWrapper = document.getElementById("taskTableWrapper");

  taskList.innerHTML = "";
  tbody.innerHTML = "";


  emptyState.classList.toggle("d-none", tasks.length > 0);
// controle da tabela
if (tasks.length === 0) {
  tableWrapper.classList.add("d-none");
} else {
  tableWrapper.classList.remove("d-none");
}

  /* ================= CARDS ================= */
  tasks.forEach(task => {
    const card = document.createElement("div");
    card.className = `task-card-item ${task.concluida ? "task-done" : ""}`;

    card.innerHTML = `
      <div class="task-row" onclick="viewTask(${task.id})">
        <div class="complete-btn ${task.concluida ? "done" : ""}"
          onclick="event.stopPropagation(); toggleTask(${task.id})"></div>

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
          <button class="btn ed" onclick="event.stopPropagation(); editTask(${task.id})">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn de" onclick="event.stopPropagation(); deleteTask(${task.id})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    `;

    taskList.appendChild(card);
  });

  /* ================= TABELA ================= */
  tasks.forEach(task => {
    const tr = document.createElement("tr");

    tr.onclick = () => viewTask(task.id);

    if (task.concluida) {
      tr.classList.add("task-done");
    }

    tr.innerHTML = `
      <td>
        <div class="complete-btn ${task.concluida ? "done" : ""}"
          onclick=" event.stopPropagation(); toggleTask(${task.id})"></div>
      </td>
      <td>${task.titulo}</td>
      <td class="desc-cell">${task.descricao}</td>
      <td>
        <span class="badge badge-${task.prioridade}">
          ${task.prioridade}
        </span>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn ed" onclick="event.stopPropagation(); editTask(${task.id})">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn de"  onclick="event.stopPropagation(); deleteTask(${task.id})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
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
function viewTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  document.getElementById("viewTaskTitle").innerText = task.titulo;
  document.getElementById("viewTaskDesc").innerText =
    task.descricao || "Sem descrição";

  const badge = document.getElementById("viewTaskPriority");
  badge.className = `badge badge-${task.prioridade}`;
  badge.innerText = task.prioridade;

  new bootstrap.Modal(
    document.getElementById("viewTaskModal")
  ).show();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  task.concluida = !task.concluida;
  updateTask(task);
}

let taskToEdit = null;

function editTask(id) {
  taskToEdit = tasks.find(t => t.id === id);

  document.getElementById("editTitle").value = taskToEdit.titulo;
  document.getElementById("editDesc").value = taskToEdit.descricao;

  const modal = new bootstrap.Modal(
    document.getElementById("editModal")
  );

  modal.show();
}
//confirmar edit
document.getElementById("saveEdit").addEventListener("click", () => {
  if (!taskToEdit) return;

  taskToEdit.titulo =
    document.getElementById("editTitle").value;

  taskToEdit.descricao =
    document.getElementById("editDesc").value;

  updateTask(taskToEdit);
  taskToEdit = null;

  bootstrap.Modal.getInstance(
    document.getElementById("editModal")
  ).hide();
});

function deleteTask(id) {
  taskToDelete = id;

  const modal = new bootstrap.Modal(
    document.getElementById("deleteModal")
  );

  modal.show();
}
 
//confirmar delete
document.getElementById("confirmDelete").addEventListener("click", () => {
  if (taskToDelete !== null) {
    deleteTaskApi(taskToDelete);
    taskToDelete = null;
  }

  bootstrap.Modal.getInstance(
    document.getElementById("deleteModal")
  ).hide();
});



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
let currentStatus = "all";

document.querySelectorAll("[data-status]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-status]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentStatus = btn.dataset.status;

    fetchTasks(currentStatus, currentPriority);
  });
});
document.querySelectorAll("[data-priority]").forEach(btn => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll("[data-priority]")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    currentPriority = btn.dataset.priority;

    fetchTasks(currentStatus, currentPriority);
  });
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedUser");
  window.location.href = "login.html";
});
/* =========================
   INIT
========================= */
fetchTasks("all", "all");
