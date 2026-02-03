// ELEMENTOS
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const subtitle = document.getElementById("formSubtitle");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const regName = document.getElementById("regName");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");

// TROCA DE TELAS
function showRegister() {
  loginForm.classList.add("d-none");
  registerForm.classList.remove("d-none");
  subtitle.innerText = "Crie sua conta";
}

function showLogin() {
  registerForm.classList.add("d-none");
  loginForm.classList.remove("d-none");
  subtitle.innerText = "Entre na sua conta";
}

// CADASTRO
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = regName.value;
  const email = regEmail.value;
  const password = regPassword.value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(u => u.email === email)) {
    alert("Esse email já está cadastrado!");
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Conta criada com sucesso!");
  showLogin();
});

// LOGIN
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginEmail.value;
  const password = loginPassword.value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Email ou senha inválidos!");
    return;
  }

  window.location.href = "index.html";
});
