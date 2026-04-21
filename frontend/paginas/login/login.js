import { loginRequest } from "../../services/api.js";
import { setUser } from "../../utils/auth.js";

async function login() {
  const username = document.getElementById("user").value;
  const password = document.getElementById("pass").value;

  if (!username || !password) {
    alert("Preencha usuário e senha");
    return;
  }

  try {
    const res = await loginRequest({ username, password });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Erro no login");
      return;
    }

    if (!data.token || !data.role) {
      alert("Resposta de login inválida");
      return;
    }

    setUser(data);

    if (data.role === "ADMIN") {
      window.location.href = "../admin/admin.html";
    } else {
      window.location.href = "../user/user.html";
    }
  } catch (error) {
    console.error("Erro no login:", error);
    alert("Erro de conexão com o servidor");
  }
}

window.login = login;