// render.js
function render() {
    const list = document.getElementById("taskList");
    const table = document.getElementById("taskTable");
    const tableBody = table.querySelector("tbody");
    const empty = document.getElementById("emptyState");
  
    // limpa
    list.innerHTML = "";
    tableBody.innerHTML = "";
  
    if (!tasks.length) {
      empty.style.display = "block";
      list.style.display = "grid"; // garante que o grid fique visível
      table.classList.add("d-none");
      return;
    }
  
    empty.style.display = "none";
  
    const total = tasks.length;
    const doneCount = tasks.filter(t => t.done).length;
    const pendingCount = total - doneCount;
  
    document.getElementById("total").innerText = total + " total";
    document.getElementById("done").innerText = doneCount + " concluídas";
    document.getElementById("pending").innerText = pendingCount + " pendentes";
    document.getElementById("pendingCount").innerText = pendingCount + " pendentes";
  
    tasks.forEach((t, i) => {
      if (currentView === "cards") {
        const card = document.createElement("div");
        card.className = "task-card-item " + (t.done ? "task-done" : "");
        card.innerHTML = `
          <div class="task-row">
            <div class="complete-btn ${t.done ? "done" : ""}" onclick="toggleDone(${i})"></div>
            <div class="task-content">
              <h6>${t.title}</h6>
              <small>${t.desc}</small><br>
              <span class="badge badge-${t.priority}">${t.priority}</span>
            </div>
          </div>
        `;
        list.appendChild(card);
      } else {
        const tr = document.createElement("tr");
        tr.className = t.done ? "task-done" : "";
        tr.innerHTML = `
          <td><div class="complete-btn ${t.done ? "done" : ""}" onclick="toggleDone(${i})"></div></td>
          <td>${t.title}</td>
          <td>${t.desc}</td>
          <td><span class="badge badge-${t.priority}">${t.priority}</span></td>
        `;
        tableBody.appendChild(tr);
      }
    });
  
    // mostra/esconde containers de acordo com a view
    if (currentView === "cards") {
      list.style.display = "grid";
      table.classList.add("d-none");
    } else {
      list.style.display = "none";
      table.classList.remove("d-none");
    }
  }
  