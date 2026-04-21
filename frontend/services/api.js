const BASE_URL = "http://localhost:3000";

// AUTH
export async function loginRequest(data) {
  return fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export async function registerRequest(data) {
  return fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

// ROOMS
export async function getRooms(token) {
  return fetch(`${BASE_URL}/rooms`, {
    headers: { Authorization: "Bearer " + token }
  });
}

export async function createRoomRequest(data, token) {
  return fetch(`${BASE_URL}/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(data)
  });
}

export async function toggleRoomRequest(id, token) {
  return fetch(`${BASE_URL}/rooms/${id}/toggle`, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + token
    }
  });
}