// view.js
const cardBtn = document.getElementById("cardView");
const tableBtn = document.getElementById("tableView");

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
