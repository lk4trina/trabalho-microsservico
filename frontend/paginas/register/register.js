import { registerRequest } from "../../services/api.js";

async function cadastrar() {
  const username = document.getElementById("reg-user").value;
  const password = document.getElementById("reg-pass").value;
  const confirmPass = document.getElementById("reg-pass-confirm").value;
  const role = document.getElementById("reg-role").value;

  if (password !== confirmPass) {
    alert("As senhas não coincidem!");
    return;
  }

  const res = await registerRequest({ username, password, role });

  if (res.ok) {
    alert("Cadastro realizado com sucesso!");
    window.location.href = "../login/login.html";
  } else {
    const error = await res.json();
    alert(error.error || "Erro no cadastro");
  }
}

window.cadastrar = cadastrar;
