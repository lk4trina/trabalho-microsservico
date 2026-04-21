export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "../login/login.html";
}

export function setUser(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
}

export function getRole() {
  return localStorage.getItem("role");
}