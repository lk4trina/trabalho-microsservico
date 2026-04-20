let currentFilter = "all";
let allRooms = [];

function setFilter(filter) {
  currentFilter = filter;
  renderRooms();
}

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

  const res = await fetch("http://localhost:3002/login", {
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

// render room

function renderRooms() {
  const container = document.getElementById("rooms");
  container.innerHTML = "";

  let filteredRooms = allRooms;

  if (currentFilter === "active") {
    filteredRooms = allRooms.filter(room => room.active);
  }

  if (currentFilter === "inactive") {
    filteredRooms = allRooms.filter(room => !room.active);
  }

  filteredRooms.forEach(room => {
    const div = document.createElement("div");

    div.classList.add("room-card");
    if (!room.active) div.classList.add("inactive");

    div.innerHTML = `
      <h3>${room.name}</h3>
      <p>Capacidade: ${room.capacity}</p>
      <p>Status: ${room.active ? "Ativa" : "Inativa"}</p>
      <button class="btn-room" onclick="toggleRoom(${room.id}, this)">
        ${room.active ? "Desativar" : "Ativar"}
      </button>
    `;

    container.appendChild(div);
  });
}

// LISTAR SALAS
async function loadRooms() {
  const token = getToken();

  if (!token) {
    alert("Faça login primeiro");
    window.location.href = "login.html";
    return;
  }

  const res = await fetch("http://localhost:3002/rooms", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  allRooms = await res.json();
  renderRooms();
}

// CRIAR SALA
async function createRoom() {
  const token = getToken();

  const name = document.getElementById("roomName").value;
  const capacity = document.getElementById("capacity").value;

  const res = await fetch("http://localhost:3002/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ name, capacity: Number(capacity) })
  });

  const newRoom = await res.json();

  allRooms.push(newRoom);

  renderRooms();
}

// TOGGLE
async function toggleRoom(id, button) {
  const token = getToken();

  const res = await fetch(`http://localhost:3002/rooms/${id}/toggle`, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const updatedRoom = await res.json();

  //atualiza o estado local
  const room = allRooms.find(r => r.id === Number(id));
  room.active = updatedRoom.active;

  //render com filtro
  renderRooms();
}

function openModal() {
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
}

window.addEventListener("load", () => {
  if (window.location.pathname.includes("rooms.html")) {
    loadRooms();
  }
});