const BASE_URL = "http://localhost:3000";
const BFF_URL = "http://localhost:3003";

// AUTH
export async function loginRequest(data) {
  return fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function registerRequest(data) {
  return fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ROOMS
export async function getRooms(token) {
  return fetch(`${BASE_URL}/rooms`, {
    headers: { Authorization: "Bearer " + token },
  });
}

export async function createRoomRequest(data, token) {
  return fetch(`${BASE_URL}/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });
}

// UPDATE ROOM
export async function updateRoomRequest(id, data, token) {
  return fetch(`${BASE_URL}/rooms/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });
}

// DELETE ROOM
export async function deleteRoomRequest(id, token) {
  return fetch(`${BASE_URL}/rooms/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}

// TOGGLE
export async function toggleRoomRequest(id, token) {
  return fetch(`${BASE_URL}/rooms/${id}/toggle`, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}

// BOOKINGS
export async function createBookingRequest(data, token) {
  return fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });
}

// BFF
export async function getMyBookings(token) {
  return fetch(`${BFF_URL}/dashboard/my-bookings`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}

export async function cancelBookingRequest(id, token) {
  return fetch(`${BASE_URL}/bookings/${id}/cancel`, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}

//Ana - vou verificar se isso fica ainda
/*export async function reactivateBookingRequest(id, token) {
  return fetch(`${BASE_URL}/bookings/${id}/reactivate`, {
    method: "PATCH", 
    headers: { Authorization: "Bearer " + token }
  });
}*/
