let token = null;

async function login() {
  const username = document.getElementById("user").value;
  const password = document.getElementById("pass").value;

  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  token = data.token;
  alert("Logado!");
}

async function loadRooms() {
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
      <button onclick="toggleRoom(${room.id})">
        ${room.active ? "Desativar" : "Ativar"}
      </button>
    `;

    container.appendChild(div);
  });
}

async function createRoom() {
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

    async function toggleRoom(id) {
  await fetch(`http://localhost:3000/rooms/${id}/toggle`, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + token
    }
  });

  loadRooms();
}