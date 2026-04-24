import {
  getRooms,
  createBookingRequest,
  getMyBookings,
  cancelBookingRequest,
} from "../../services/api.js";

import { getToken, logout, getRole } from "../../utils/auth.js";

//CRIAR RESERVA

window.openCreateModal = async function () {
  const select = document.getElementById("roomSelect");
  const token = localStorage.getItem("token");

  try {
    const response = await getRooms(token);
    const rooms = await response.json();

    select.innerHTML = rooms
      .filter((r) => r.isActive)
      .map(
        (r) =>
          `<option value="${r.id}">${r.name} (Capacidade: ${r.capacity})</option>`,
      )
      .join("");

    document.getElementById("create-modal").classList.remove("hidden");
  } catch (error) {
    alert("Erro ao carregar salas: " + error.message);
  }
};

window.closeCreateModal = function () {
  document.getElementById("create-modal").classList.add("hidden");
};

window.saveNewBooking = async function () {
  const token = localStorage.getItem("token");
  const data = {
    roomId: document.getElementById("roomSelect").value,
    startTime: document.getElementById("createStartTime").value,
    endTime: document.getElementById("createEndTime").value,
  };

  try {
    const response = await createBookingRequest(data, token);
    if (response.ok) {
      alert("Reserva criada com sucesso!");
      closeCreateModal();
      loadBookings();
    } else {
      const error = await response.json();
      alert("Erro: " + error.message);
    }
  } catch (error) {
    alert("Falha na comunicação com o servidor.");
  }
};

window.goToRooms = function () {
  const role = localStorage.getItem("role");
  if (role === "ADMIN") {
    window.location.href = "../admin/admin.html";
  } else {
    window.location.href = "../user/user.html";
  }
};

// Carregamento de Dados do BFF
async function loadBookings() {
  const listElement = document.getElementById("bookings-list");
  const token = localStorage.getItem("token");

  try {
    const response = await getMyBookings(token);
    if (!response.ok) throw new Error("Erro ao carregar reservas");

    const bookings = await response.json();
    renderBookings(bookings);
  } catch (error) {
    listElement.innerHTML = `<p class="error">Erro ao carregar: ${error.message}</p>`;
  }
}

function renderBookings(bookings) {
  const listElement = document.getElementById("bookings-list");

  if (bookings.length === 0) {
    listElement.innerHTML = "<p>Nenhuma reserva encontrada.</p>";
    return;
  }

  listElement.innerHTML = bookings
    .map(
      (b) => `
        <div class="room-card">
            <div class="room-info">
                <h3>${b.roomName}</h3>
                <p class="room-details">
                    <span><strong>Capacidade:</strong> ${b.roomCapacity}</span></br>  
                    <span><strong>Status:</strong> ${b.status === "ACTIVE" ? "Confirmada" : "Cancelada"}</span>
                </p>
                <p class="booking-time">
                    <i class="fa fa-clock"></i> 
                    ${new Date(b.startTime).toLocaleString()} - ${new Date(b.endTime).toLocaleString()}
                </p>
            </div>
            <div class="room-actions">
                <button onclick="openEditModal(${JSON.stringify(b).replace(/"/g, "&quot;")})">
                    <i class="fa fa-edit"></i> Editar
                </button>
                <button class="btn-cancel" onclick="cancelBooking(${b.id})">
                    <i class="fa fa-trash"></i> Cancelar
                </button>
            </div>
        </div>
    `,
    )
    .join("");
}

/*
function renderBookings(bookings) {
    const listElement = document.getElementById("bookings-list");
    const userRole = localStorage.getItem("role"); 

    if (bookings.length === 0) {
        listElement.innerHTML = "<p>Nenhuma reserva encontrada.</p>";
        return;
    }

    listElement.innerHTML = bookings.map(b => {
        
        let actionButton = "";

        if (b.status === 'CONFIRMED' || b.status === 'ACTIVE') {
            
            actionButton = `
                <button class="btn-cancel" onclick="cancelBooking(${b.id})">
                    <i class="fa fa-trash"></i> Cancelar
                </button>`;
        } 
        else if (b.status === 'CANCELLED' && userRole === 'ADMIN') {
           
            actionButton = `
                <button class="btn-reactivate" onclick="reactivateBooking(${b.id})">
                    <i class="fa fa-undo"></i> Reativar
                </button>`;
        }
        

        return `
            <div class="room-card ${b.status === 'CANCELLED' ? 'card-cancelled' : ''}">
                <div class="room-info">
                    <h3>${b.roomName}</h3>
                    <p class="room-details">
                        <span><strong>Capacidade:</strong> ${b.roomCapacity}</span> </br> 
                        <span><strong>Status:</strong> '${b.status === 'ACTIVE' ? 'Confirmada' : 'Cancelada'}'</span>
                    </p>
                    <p class="booking-time">
                        <i class="fa fa-clock"></i> 
                        ${new Date(b.startTime).toLocaleString()}
                    </p>
                </div>
                <div class="room-actions">
                    ${b.status !== 'CANCELLED' ? `
                        <button onclick="openEditModal(${JSON.stringify(b).replace(/"/g, '&quot;')})">
                            <i class="fa fa-edit"></i> Editar
                        </button>
                    ` : ''}
                    ${actionButton}
                </div>
            </div>
        `;
    }).join("");
}


window.reactivateBooking = async function(id) {
    if (!confirm("Tem certeza que deseja reativar (descancelar) esta reserva?")) {
        return;
    }

    const token = getToken();
    const role = getRole();  

    if (role !== "ADMIN") {
        alert("Acesso negado: Apenas administradores podem reativar reservas.");
        return;
    }

    try {
        const res = await reactivateBookingRequest(id, token);
        
        if (!res.ok) {
            const contentType = res.headers.get("content-type");
            
            if (contentType && contentType.includes("application/json")) {
                const data = await res.json();
                alert(data.error || data.message || "Erro ao reativar a reserva.");
            } else {
                alert(`Erro do servidor: ${res.status}. Verifique se a rota PATCH /reactivate existe no Gateway!`);
            }
            return;
        }

        alert("Reserva reativada com sucesso!");
        loadBookings(); 

    } catch (error) {
        console.error("Erro ao reativar reserva:", error);
        alert("Erro de conexão. O servidor pode estar desligado.");
    }
};

//Ana - talvez essas duas funções mudem ou eu tire
*/

async function fillRoomSelect() {
  const select = document.getElementById("roomSelect");
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token não encontrado no localStorage!");
    return;
  }

  try {
    const response = await getRooms(token);

    if (!response.ok) {
      console.error(`Erro na API: ${response.status} - ${response.statusText}`);
      return;
    }

    const rooms = await response.json();
    console.log("Salas recebidas:", rooms);

    if (!rooms || rooms.length === 0) {
      select.innerHTML = '<option value="">Nenhuma sala disponível</option>';
      return;
    }

    select.innerHTML = rooms
      .filter((r) => r.active) // <-- AQUI FOI CORRIGIDO
      .map((r) => `<option value="${r.id}">${r.name}</option>`)
      .join("");
  } catch (error) {
    console.error("Falha catastrófica ao preencher o select:", error);
  }
}

// EDITAR

window.openEditModal = function (booking) {
  const modal = document.getElementById("edit-modal");
  document.getElementById("edit-room-name").innerText =
    `Sala: ${booking.roomName}`;

  document.getElementById("editStartTime").value = booking.startTime.slice(
    0,
    16,
  );
  document.getElementById("editEndTime").value = booking.endTime.slice(0, 16);

  const saveBtn = document.getElementById("btn-save-edit");
  saveBtn.onclick = () => saveEdit(booking.id);

  modal.classList.remove("hidden");
};

window.closeEditModal = function () {
  document.getElementById("edit-modal").classList.add("hidden");
};

window.saveEdit = async function (bookingId) {
  const token = localStorage.getItem("token");
  const data = {
    startTime: document.getElementById("editStartTime").value,
    endTime: document.getElementById("editEndTime").value,
  };

  try {
    const response = await fetch(
      `http://localhost:3000/bookings/${bookingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      },
    );

    if (response.ok) {
      alert("Reserva atualizada!");
      closeEditModal();
      loadBookings();
    } else {
      const error = await response.json();
      alert("Erro ao editar: " + error.message);
    }
  } catch (error) {
    alert("Erro na conexão.");
  }
};

// CANCELAR
window.cancelBooking = async function (id) {
  if (!confirm("Tem certeza que deseja cancelar esta reserva?")) {
    return;
  }

  const token = getToken();

  try {
    const res = await cancelBookingRequest(id, token);

    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        alert(data.error || "Erro ao cancelar reserva");
      } else {
        alert(`Erro do servidor: ${res.status}.`);
      }
      return;
    }

    alert("Reserva cancelada com sucesso!");

    loadBookings();
  } catch (error) {
    console.error("Erro ao cancelar reserva:", error);
    alert("Erro de conexão ao cancelar reserva");
  }
};

window.toggleSidebar = function () {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
};

document.addEventListener("DOMContentLoaded", () => {
  loadBookings();
  fillRoomSelect();

  const btnCreate = document.getElementById("btn-open-create");
  if (btnCreate) {
    btnCreate.addEventListener("click", () => {
      document.getElementById("create-modal").classList.remove("hidden");
    });
  }
});

window.closeCreateModal = function () {
  document.getElementById("create-modal").classList.add("hidden");
};

window.closeEditModal = function () {
  document.getElementById("edit-modal").classList.add("hidden");
};

// EXPORTS GLOBAIS
window.logout = logout;
