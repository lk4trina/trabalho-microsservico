import {
  getRooms,
  createRoomRequest,
  toggleRoomRequest,
  updateRoomRequest,
  deleteRoomRequest,
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
  <div class="room-header">
    <h3>${room.name}</h3>

    ${
      role === "ADMIN" && isAdminPage()
        ? `
      <div class="room-actions">
        <i class="fa fa-pen icon edit" onclick="openEditModal(${room.id})"></i>
        <i class="fa fa-trash icon delete" onclick="deleteRoom(${room.id})"></i>
      </div>
    `
        : ""
    }
  </div>

  <p>Capacidade: ${room.capacity ?? "-"}</p>
  <p>Status: ${room.active ? "Ativa" : "Inativa"}</p>

  ${
    role === "ADMIN" && isAdminPage()
      ? `
    <button class="btn-room" onclick="toggleRoom(${room.id})">
      ${room.active ? "Desativar" : "Ativar"}
    </button>
  `
      : ""
  }

${
  role === "USER" && isUserPage() && room.active
    ? `
    <button class="btn-room" onclick="goToBooking(${room.id}, '${room.name}')">
      Reservar
    </button>
  `
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
      alert(data.error || "Erro ao buscar salas");
      return;
    }

    allRooms = data;
    renderRooms();
  } catch (error) {
    console.error(error);
    alert("Erro ao buscar salas");
  }
}

// CREATE
async function createRoom() {
  const token = getToken();
  const role = getRole();

  if (role !== "ADMIN") {
    alert("Você não tem permissão");
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
      alert(data.error);
      return;
    }

    allRooms.push(data);
    renderRooms();
    closeModal();
  } catch (error) {
    console.error(error);
    alert("Erro ao criar sala");
  }
}

// UPDATE
async function updateRoom(id) {
  const token = getToken();

  const name = document.getElementById("editRoomName").value;
  const capacity = document.getElementById("editCapacity").value;

  if (!name || !capacity) {
    alert("Preencha os campos");
    return;
  }

  try {
    const res = await updateRoomRequest(
      id,
      { name, capacity: Number(capacity) },
      token,
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    const room = allRooms.find((r) => r.id === Number(id));
    if (room) {
      room.name = data.name;
      room.capacity = data.capacity;
    }

    renderRooms();
    closeEditModal();
  } catch (error) {
    console.error(error);
    alert("Erro ao editar sala");
  }
}

// DELETE
async function deleteRoom(id) {
  const token = getToken();

  if (!confirm("Tem certeza que deseja excluir?")) return;

  try {
    const res = await deleteRoomRequest(id, token);
    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    allRooms = allRooms.filter((r) => r.id !== id);
    renderRooms();
  } catch (error) {
    console.error(error);
    alert("Erro ao excluir sala");
  }
}

// EDIT MODAL
let editingRoomId = null;

function openEditModal(id) {
  const room = allRooms.find((r) => r.id === Number(id));
  if (!room) return;

  editingRoomId = id;

  document.getElementById("editRoomName").value = room.name;
  document.getElementById("editCapacity").value = room.capacity;

  document.getElementById("editModal").classList.remove("hidden");
}

function closeEditModal() {
  document.getElementById("editModal").classList.add("hidden");

  document.getElementById("editRoomName").value = "";
  document.getElementById("editCapacity").value = "";
  document.getElementById("modal").classList.add("hidden");

  editingRoomId = null;
}

function confirmEdit() {
  if (editingRoomId) {
    updateRoom(editingRoomId);
  }
}

// TOGGLE
async function toggleRoom(id) {
  const token = getToken();

  try {
    const res = await toggleRoomRequest(id, token);
    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    const room = allRooms.find((r) => r.id === Number(id));
    if (room) {
      room.active = data.active;
    }

    renderRooms();
  } catch (error) {
    console.error(error);
    alert("Erro ao atualizar sala");
  }
}

// UI
function openModal() {
  const role = getRole();

  if (role !== "ADMIN") {
    alert("Sem permissão");
    return;
  }

  document.getElementById("modal")?.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal")?.classList.add("hidden");
}

function toggleSidebar() {
  document.getElementById("sidebar")?.classList.toggle("collapsed");
}

function myBookings() {
  window.location.href = "../bookings/booking.html";
}

function goToBooking(roomId, roomName) {
  localStorage.setItem("selectedRoomId", roomId);
  localStorage.setItem("selectedRoomName", roomName);

  window.location.href = "../bookings/booking.html";
}

// INIT
window.onload = () => {
  loadRooms();
};

// EXPORTS
window.setFilter = setFilter;
window.createRoom = createRoom;
window.toggleRoom = toggleRoom;
window.deleteRoom = deleteRoom;
window.openEditModal = openEditModal;
window.closeEditModal = closeEditModal;
window.confirmEdit = confirmEdit;
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleSidebar = toggleSidebar;
window.logout = logout;
window.myBookings = myBookings;
window.goToBooking = goToBooking;
