function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// LOGIN
async function login() {
  const username = document.getElementById("user").value;
  const password = document.getElementById("pass").value;

  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (!data.token) {
    alert("Erro no login");
    return;
  }

  setToken(data.token);
  window.location.href = "rooms.html";
}

// LISTAR SALAS
async function loadRooms() {
  const token = getToken();

  if (!token) {
    alert("Faça login primeiro");
    window.location.href = "login.html";
    return;
  }

  const res = await fetch("http://localhost:3000/rooms", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const rooms = await res.json();

  const container = document.getElementById("rooms");
  container.innerHTML = "";

  rooms.forEach(room => {
    const div = document.createElement("div");
    div.className = "room-card";

    div.innerHTML = `
      <h3>${room.name}</h3>
      <p>Capacidade: ${room.capacity}</p>
      <button id="btn-room" onclick="toggleRoom(${room.id})">
        ${room.active ? "Desativar" : "Ativar"}
      </button>
    `;

    container.appendChild(div);
  });
}

// CRIAR SALA
async function createRoom() {
  const token = getToken();

  const name = document.getElementById("roomName").value;
  const capacity = document.getElementById("capacity").value;

  await fetch("http://localhost:3000/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ name, capacity: Number(capacity) })
  });

  loadRooms();
}

// TOGGLE
async function toggleRoom(id) {
  const token = getToken();

  await fetch(`http://localhost:3000/rooms/${id}/toggle`, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + token
    }
  });

  loadRooms();
}