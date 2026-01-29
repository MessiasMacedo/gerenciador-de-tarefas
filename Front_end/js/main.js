document.addEventListener("DOMContentLoaded", () => {

    // ================== STATE ==================
    let tasks = [];
    let selectedPriority = "normal";
    let currentView = "cards";
    let currentPriority = "all";
    let currentStatus = "all";
  
    // ================== ELEMENTS ==================
    const titleInput = document.getElementById("taskTitle");
    const descInput = document.getElementById("taskDesc");
    const addBtn = document.getElementById("addTask");
  
    const cardBtn = document.getElementById("cardView");
    const tableBtn = document.getElementById("tableView");
  
    const list = document.getElementById("taskList");
    const table = document.getElementById("taskTable");
    const tableBody = table.querySelector("tbody");
    const empty = document.getElementById("emptyState");
  
    const filterToggle = document.getElementById("filterToggle");
    const filtersBox = document.getElementById("filters");
  
    const priorityBtns = document.querySelectorAll(".priority-btn");
    const filterPriorityBtns = document.querySelectorAll(".filter-btn[data-priority]");
    const filterStatusBtns = document.querySelectorAll(".filter-btn[data-status]");
  
    // ================== TOGGLE FILTER ==================
    filterToggle.addEventListener("click", () => {
      filtersBox.classList.toggle("d-none");
    });
  
    // ================== SELECT TASK PRIORITY ==================
    priorityBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        priorityBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedPriority = btn.dataset.level;
      });
    });
    function getPriority() { return selectedPriority; }
  
    // ================== FILTER BUTTONS ==================
    filterPriorityBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterPriorityBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentPriority = btn.dataset.priority;
        render();
      });
    });
  
    filterStatusBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterStatusBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentStatus = btn.dataset.status;
        render();
      });
    });
  
    // ================== VIEW TOGGLE ==================
    cardBtn.addEventListener("click", () => {
      currentView = "cards";
      cardBtn.classList.add("view-active");
      tableBtn.classList.remove("view-active");
      render();
    });
  
    tableBtn.addEventListener("click", () => {
      currentView = "table";
      tableBtn.classList.add("view-active");
      cardBtn.classList.remove("view-active");
      render();
    });
  
    // ================== ADD TASK ==================
    addBtn.addEventListener("click", (event) => {
      event.preventDefault(); // previne recarregamento do formulário
      const title = titleInput.value.trim();
      const desc = descInput.value.trim();
  
      if (!title) {
        alert("Digite o nome da tarefa");
        return;
      }
  
      tasks.push({
        title,
        desc,
        priority: getPriority(),
        done: false,
        doneAt: null
      });
  
      titleInput.value = "";
      descInput.value = "";
      render();
    });
  
    // ================== TOGGLE DONE ==================
    window.toggleDone = function(i) {
      tasks[i].done = !tasks[i].done;
      if (tasks[i].done) tasks[i].doneAt = Date.now();
      else delete tasks[i].doneAt;
      render();
    };
  
    // ================== EDIT TASK ==================
    let currentEditIndex = null;
    window.editTask = function(i) {
      currentEditIndex = i;
      const task = tasks[i];
      document.getElementById("editTitle").value = task.title;
      document.getElementById("editDesc").value = task.desc;
      const editModal = new bootstrap.Modal(document.getElementById("editModal"));
      editModal.show();
    };
  
    document.getElementById("saveEdit").addEventListener("click", () => {
      const title = document.getElementById("editTitle").value.trim();
      const desc = document.getElementById("editDesc").value.trim();
  
      if (!title) { alert("Digite o título"); return; }
  
      tasks[currentEditIndex].title = title;
      tasks[currentEditIndex].desc = desc;
  
      const editModal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
      editModal.hide();
      render();
    });
  
    // ================== DELETE TASK ==================
    let currentDeleteIndex = null;
    window.deleteTask = function(i) {
      currentDeleteIndex = i;
      const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
      deleteModal.show();
    };
  
    document.getElementById("confirmDelete").addEventListener("click", () => {
      tasks.splice(currentDeleteIndex, 1);
      const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteModal"));
      deleteModal.hide();
      render();
    });
  
    // ================== AUTO CLEAN DONE TASKS ==================
    setInterval(() => {
      const now = Date.now();
      const day = 86400000;
      tasks = tasks.filter(t => !t.done || now - t.doneAt < day);
      render();
    }, 600000);
  
    // ================== RENDER ==================
    function render() {
        // limpa conteúdos
        list.innerHTML = "";
        tableBody.innerHTML = "";
    
        // aplica filtros
        let filtered = [...tasks];
        if (currentPriority !== "all") filtered = filtered.filter(t => t.priority === currentPriority);
        if (currentStatus !== "all") filtered = filtered.filter(t => currentStatus === "pending" ? !t.done : t.done);
    
        // contadores
        const total = tasks.length;
        const done = tasks.filter(t => t.done).length;
        const pending = total - done;
    
        document.getElementById("total").innerText = total + " total";
        document.getElementById("done").innerText = done + " concluídas";
        document.getElementById("pending").innerText = pending + " pendentes";
        document.getElementById("pendingCount").innerText = pending + " pendentes";
    
        // mensagem de lista vazia
        empty.style.display = filtered.length === 0 ? "block" : "none";
    
        if (currentView === "cards") {
            list.style.display = "grid";
            table.style.display = "none";
    
            filtered.forEach((t, index) => {
                list.innerHTML += `
                <div class="task-card-item ${t.done ? "task-done" : ""}">
                  <div class="task-row">
                    <div class="complete-btn ${t.done ? "done" : ""}" onclick="toggleDone(${tasks.indexOf(t)})"></div>
                    <div class="task-content">
                      <h6>${t.title}</h6>
                      <small>${t.desc}</small>
                      <div><span class="badge badge-${t.priority}">${t.priority}</span></div>
                    </div>
                    <div class="task-actions">
                      <i class="bi bi-pencil" onclick="editTask(${tasks.indexOf(t)})" style="font-size:1.2rem;"></i>
                      <i class="bi bi-trash text-danger" onclick="deleteTask(${tasks.indexOf(t)})" style="font-size:1.2rem;"></i>
                    </div>
                  </div>
                </div>
                `;
            });
        } else {
            list.style.display = "none";
            table.style.display = "table";
    
            filtered.forEach(t => {
                const tr = document.createElement("tr");
                tr.className = t.done ? "task-done" : "";
                tr.innerHTML = `
                  <td><div class="complete-btn ${t.done ? "done" : ""}" onclick="toggleDone(${tasks.indexOf(t)})"></div></td>
                  <td>${t.title}</td>
                  <td>${t.desc}</td>
                  <td><span class="badge badge-${t.priority}">${t.priority}</span></td>
                  <td>
                    <i class="bi bi-pencil me-2" onclick="editTask(${tasks.indexOf(t)})" style="font-size:1.2rem;"></i>
                    <i class="bi bi-trash text-danger" onclick="deleteTask(${tasks.indexOf(t)})" style="font-size:1.2rem;"></i>
                  </td>
                `;
                tableBody.appendChild(tr);
            });
        }
    }
    
    
  
    // ================== RENDER INICIAL ==================
    render();
  
  });
  