const API_URL = "http://localhost:8080/usuario";

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

//cadastro
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = regName.value;
  const email = regEmail.value;
  const senha = regPassword.value;

  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nome, email, senha })
  });

  if (!response.ok) {
    alert("Erro ao cadastrar usuário");
    return;
  }

  alert("Conta criada com sucesso!");
  showLogin();
});


// LOGIN
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginEmail.value;
  const senha = loginPassword.value;

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, senha })
  });

  if (!response.ok) {
    alert("Email ou senha inválidos!");
    return;
  }

  const user = await response.json();

  // 🔥 SALVA USUÁRIO REAL (COM ID)
  localStorage.setItem("loggedUser", JSON.stringify(user));

  window.location.href = "index.html";
});
