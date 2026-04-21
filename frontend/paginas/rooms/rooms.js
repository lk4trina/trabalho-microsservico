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

  if (!token) {
    alert("Faça login primeiro");
    window.location.href = "../login/login.html";
    return;
  }

  try {
    const res = await getRooms(token);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Erro ao carregar salas:", errorData);
      alert(errorData.error || "Erro ao carregar salas");
      return;
    }

    allRooms = await res.json();
    renderRooms();
  } catch (error) {
    console.error("Erro de rede ao carregar salas:", error);
    alert("Erro de conexão ao carregar salas");
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

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Erro ao criar sala:", errorData);
      alert(errorData.error || "Erro ao criar sala");
      return;
    }

    const newRoom = await res.json();
    allRooms.push(newRoom);
    renderRooms();
    closeModal();
  } catch (error) {
    console.error("Erro de rede ao criar sala:", error);
    alert("Erro de conexão ao criar sala");
  }
}

// TOGGLE
async function toggleRoom(id) {
  console.log("clicou no toggle", id);

  const token = getToken();
  const role = getRole();

  if (role !== "ADMIN") {
    alert("Você não tem permissão");
    return;
  }

  try {
    const res = await toggleRoomRequest(id, token);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Erro ao alterar sala:", errorData);
      alert(errorData.error || "Erro ao alterar sala");
      return;
    }

    const updated = await res.json();
    const room = allRooms.find((r) => r.id === Number(id));

    if (room) {
      room.active = updated.active;
    }

    renderRooms();
  } catch (error) {
    console.error("Erro de rede no toggle:", error);
    alert("Erro de conexão ao atualizar sala");
  }
}

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
