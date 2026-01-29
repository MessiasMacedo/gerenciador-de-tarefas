// tasks.js
document.addEventListener("DOMContentLoaded", () => {
  const titleInput = document.getElementById("taskTitle");
  const descInput = document.getElementById("taskDesc");
  const addBtn = document.getElementById("addTask");

  addBtn.addEventListener("click", () => {
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

  window.toggleDone = function (i) {
    tasks[i].done = !tasks[i].done;
    if (tasks[i].done) tasks[i].doneAt = Date.now();
    else delete tasks[i].doneAt;

    render();
  };

  // limpa tarefas concluídas com mais de 1 dia
  function cleanupOldTasks() {
    const now = Date.now();
    const day = 86400000;
    tasks = tasks.filter(t => !t.done || now - t.doneAt < day);
    render();
  }

  setInterval(cleanupOldTasks, 600000);

  render(); // render inicial
});
