import { loginRequest } from "../../services/api.js";
import { setUser } from "../../utils/auth.js";

async function login() {
  const username = document.getElementById("user").value;
  const password = document.getElementById("pass").value;

  const res = await loginRequest({ username, password });
  const data = await res.json();

  if (!data.token) {
    alert("Erro no login");
    return;
  }

  setUser(data);

  // 🔥 REDIRECIONAMENTO POR ROLE
  if (data.role === "ADMIN") {
    window.location.href = "../admin/admin.html";
  } else {
    window.location.href = "../user/user.html";
  }
}

window.login = login;
