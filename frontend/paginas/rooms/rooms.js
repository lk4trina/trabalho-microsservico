import {
  getRooms,
  createRoomRequest,
  toggleRoomRequest,
} from "../../services/api.js";

import { getToken, logout, getRole } from "../../utils/auth.js";

let allRooms = [];
let currentFilter = "all";

function isAdminPage() {
  return window.location.pathname.includes("/admin/");
}

function isUserPage() {
  return window.location.pathname.includes("/user/");
}

// FILTRO
function setFilter(filter) {
  currentFilter = filter;
  renderRooms();
}

// RENDER
function renderRooms() {
  const container = document.getElementById("rooms");
  container.innerHTML = "";

  const role = getRole();

  let filteredRooms = allRooms;

  if (currentFilter === "active") {
    filteredRooms = allRooms.filter((r) => r.active);
  }

  if (currentFilter === "inactive") {
    filteredRooms = allRooms.filter((r) => !r.active);
  }

  filteredRooms.forEach((room) => {
    const div = document.createElement("div");
    div.classList.add("room-card");

    if (!room.active) {
      div.classList.add("inactive");
    }

    div.innerHTML = `
      <h3>${room.name}</h3>
      <p>Capacidade: ${room.capacity ?? "-"}</p>
      <p>Status: ${room.active ? "Ativa" : "Inativa"}</p>

      ${
        role === "ADMIN" && isAdminPage()
          ? `<button class="btn-room" onclick="toggleRoom(${room.id})">
              ${room.active ? "Desativar" : "Ativar"}
            </button>`
          : ""
      }
    `;

    container.appendChild(div);
  });
}

// LOAD
async function loadRooms() {
  const token = getToken();
  const role = getRole();

  if (!token || !role) {
    alert("Faça login primeiro");
    window.location.href = "../login/login.html";
    return;
  }

  if (isAdminPage() && role !== "ADMIN") {
    alert("Acesso restrito ao administrador");
    window.location.href = "../login/login.html";
    return;
  }

  if (isUserPage() && role !== "USER") {
    alert("Acesso restrito ao usuário");
    window.location.href = "../login/login.html";
    return;
  }

  try {
    const res = await getRooms(token);
    const data = await res.json();

    if (!res.ok) {
      console.error("Erro ao buscar salas:", data);
      alert(data.error || "Erro ao buscar salas");
      return;
    }

    allRooms = data;
    renderRooms();
  } catch (error) {
    console.error("Erro de rede ao buscar salas:", error);
    alert("Erro ao buscar salas");
  }
}

// CREATE
async function createRoom() {
  const token = getToken();
  const role = getRole();

  if (role !== "ADMIN") {
    alert("Você não tem permissão para criar salas");
    return;
  }

  const name = document.getElementById("roomName")?.value;
  const capacity = document.getElementById("capacity")?.value;

  if (!name || !capacity) {
    alert("Preencha todos os campos");
    return;
  }

  try {
    const res = await createRoomRequest(
      { name, capacity: Number(capacity) },
      token,
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Erro ao criar sala");
      return;
    }

    allRooms.push(data);
    renderRooms();
    closeModal();
  } catch (error) {
    console.error("Erro ao criar sala:", error);
    alert("Erro de conexão ao criar sala");
  }
}

// TOGGLE
async function toggleRoom(id) {
  const token = getToken();
  const role = getRole();

  if (role !== "ADMIN") {
    alert("Você não tem permissão");
    return;
  }

  try {
    const res = await toggleRoomRequest(id, token);
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Erro ao atualizar sala");
      return;
    }

    const room = allRooms.find((r) => r.id === Number(id));
    if (room) {
      room.active = data.active;
    }

    renderRooms();
  } catch (error) {
    console.error("Erro ao atualizar sala:", error);
    alert("Erro de conexão ao atualizar sala");
  }
}

// UI
function openModal() {
  const role = getRole();

  if (role !== "ADMIN") {
    alert("Você não tem permissão");
    return;
  }

  const modal = document.getElementById("modal");
  if (modal) modal.classList.remove("hidden");
}

function closeModal() {
  const modal = document.getElementById("modal");
  if (modal) modal.classList.add("hidden");
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.toggle("collapsed");
}

function myBookings(){
  //if (data.role === "ADMIN") {
    window.location.href = "../bookings/booking.html";
 // } else {
  //  window.location.href = "../user/user.html";
 // }
}

// INIT
window.onload = () => {
  loadRooms();
};

// EXPORTS GLOBAIS
window.setFilter = setFilter;
window.createRoom = createRoom;
window.toggleRoom = toggleRoom;
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleSidebar = toggleSidebar;
window.logout = logout;
window.myBookings = myBookings;