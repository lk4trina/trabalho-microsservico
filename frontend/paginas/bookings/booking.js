import {
  getRooms,
  createBookingRequest,
  getMyBookings,
  deleteBookingRequest, 
} from "../../services/api.js";
import { getToken, logout, getRole } from "../../utils/auth.js";

let calendar; 

document.addEventListener('DOMContentLoaded', async function() {
    const calendarEl = document.getElementById('calendar');


calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek', 
        locale: 'pt-br', 
        

        buttonText: {
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            list: 'Lista'
        },
        allDayText: '', 

        headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },

        selectable: true,
        

        select: function(info) {

            const start = info.startStr.substring(0, 16);
            const end = info.endStr.substring(0, 16);
            
            document.getElementById("createStartTime").value = start;
            document.getElementById("createEndTime").value = end;
            document.getElementById("create-modal").classList.remove("hidden");
        },
        
        eventClick: function(info) {
            const event = info.event;
            
            document.getElementById("editRoomSelect").value = event.extendedProps.roomId;
            document.getElementById("editStartTime").value = event.startStr.substring(0, 16);
            
            if(event.endStr) {
                document.getElementById("editEndTime").value = event.endStr.substring(0, 16);
            } else {
                document.getElementById("editEndTime").value = event.startStr.substring(0, 16); 
            }

            document.getElementById("btn-save-edit").onclick = () => saveEdit(event.id);
            document.getElementById("btn-delete-booking").onclick = () => deleteBooking(event.id);
            document.getElementById("edit-modal").classList.remove("hidden");
        },
        
        events: async function(info, successCallback, failureCallback) {
          
            try {
                const currentToken = getToken();
                
                if (!currentToken) {
                    console.error("Token vazio! Redirecionando para login...");
                    alert("Sessão expirada. Faça login novamente.");
                    window.location.href = "../login/login.html"; // Ajuste o caminho da sua página de login
                    return;
                }
              
                const response = await getMyBookings(currentToken);
                const data = await response.json();
                
                if(!response.ok) throw new Error(data.error || "Erro ao buscar");

                // Transforma o JSON do BFF no formato que o Calendário entende
                const events = data.map(b => ({
                    id: b.id,
                    title: b.roomName,
                    start: b.startTime,
                    end: b.endTime,
                    backgroundColor: '#e91e63', 
                    borderColor: '#c2185b',
                    extendedProps: { roomId: b.roomId }
                }));
                
                successCallback(events);
            } catch (error) {
                console.error(error);
                failureCallback(error);
            }
        }
    });

    calendar.render();
    fillRoomSelects(); 
});


async function fillRoomSelects() {
  const token = getToken();
  try {
    const response = await getRooms(token);
    const rooms = await response.json();
    
    const options = rooms
      .filter(r => r.active)
      .map(r => `<option value="${r.id}">${r.name} (Capacidade: ${r.capacity})</option>`)
      .join("");
      
    document.getElementById("roomSelect").innerHTML = options;
    document.getElementById("editRoomSelect").innerHTML = options;
  } catch (error) {
    console.error("Erro ao preencher salas:", error);
  }
}

// --- CRIAR ---
window.closeCreateModal = function () {
  document.getElementById("create-modal").classList.add("hidden");
};

window.saveNewBooking = async function () {
  const roomId = document.getElementById("roomSelect").value;
  const startTimeRaw = document.getElementById("createStartTime").value;
  const endTimeRaw = document.getElementById("createEndTime").value;

  if (!roomId || roomId === "") {
      alert("Por favor, selecione uma sala válida.");
      return;
  }
  if (!startTimeRaw || !endTimeRaw) {
      alert("Por favor, preencha os horários.");
      return;
  }

  const startTime = new Date(startTimeRaw).toISOString();
  const endTime = new Date(endTimeRaw).toISOString();

  const token = getToken();
  const data = { roomId, startTime, endTime };

  try {
    const response = await createBookingRequest(data, token);
    if (response.ok) {
      alert("Reserva criada com sucesso!");
      closeCreateModal();
      calendar.refetchEvents();
    } else {
      const error = await response.json();
      alert("Erro: " + (error.message || error.error));
    }
  } catch (error) {
    alert("Falha na comunicação com o servidor.");
  }
};

// --- EDITAR ---
window.closeEditModal = function () {
  document.getElementById("edit-modal").classList.add("hidden");
};

window.saveEdit = async function (bookingId) {
  const roomId = document.getElementById("editRoomSelect").value;
  const startTimeRaw = document.getElementById("editStartTime").value;
  const endTimeRaw = document.getElementById("editEndTime").value;

  const startTime = new Date(startTimeRaw).toISOString();
  const endTime = new Date(endTimeRaw).toISOString();

  const token = getToken();
  const data = { roomId, startTime, endTime };

  try {
    const response = await fetch(`http://localhost:3000/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Reserva atualizada!");
      closeEditModal();
      calendar.refetchEvents();
    } else {
      const error = await response.json();
      alert("Erro ao eaaaaditar: " + (error.message || error.error));
    }
  } catch (error) {
    alert("Erro na conexão.");
  }
};


// --- EXCLUIR ---
window.deleteBooking = async function(id) {
    if (!confirm("Tem certeza que deseja EXCLUIR esta reserva? Essa ação não tem volta!")) return;
    
    const token = getToken();
    try {
        const res = await deleteBookingRequest(id, token); // <-- Atualizado aqui!
        
        if (res.status === 204 || res.ok) {
            alert("Reserva excluída permanentemente!");
            closeEditModal();
            calendar.refetchEvents(); 
        } else {
            const data = await res.json();
            alert("Erro ao excluir: " + (data.error || "Verifique o Gateway."));
        }
    } catch (error) {
        alert("Erro de conexão ao tentar excluir.");
    }
}

// --- CONTROLES GLOBAIS ---
window.goToRooms = function () {
  const role = getRole();
  if (role === "ADMIN") { window.location.href = "../admin/admin.html"; } 
  else { window.location.href = "../user/user.html"; }
};

window.toggleSidebar = function () {
  document.getElementById("sidebar").classList.toggle("collapsed");
};

window.logout = logout;