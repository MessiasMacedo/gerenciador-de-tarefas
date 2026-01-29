// priority.js
const priorityButtons = document.querySelectorAll(".priority-btn");

priorityButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    priorityButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    selectedPriority = btn.dataset.level;
  });
});

function getPriority() {
  return selectedPriority;
}
