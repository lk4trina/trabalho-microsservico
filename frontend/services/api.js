const RENDER_BASE_URL = "https://api-gateway-homol.onrender.com";
const LOCAL_BASE_URL = "http://localhost:3000";

const RENDER_BFF_URL = "https://bff-t8a8.onrender.com";
const LOCAL_BFF_URL = "http://localhost:3003";

const BACKEND_ENV_KEY = "backend_env";

const ERROS_CONEXAO_BACKEND = [
  "ENOTFOUND",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "getaddrinfo",
  "SequelizeConnectionError",
  "dpg-",
];

function usandoLocal() {
  return localStorage.getItem(BACKEND_ENV_KEY) === "local";
}

function definirAmbienteLocal() {
  localStorage.setItem(BACKEND_ENV_KEY, "local");
}

function limparAmbiente() {
  localStorage.removeItem(BACKEND_ENV_KEY);
}

async function deveTentarLocal(response, endpoint) {
  if (
    response.status === 400 ||
    response.status === 401 ||
    response.status >= 500
  ) {
    try {
      const body = await response.clone().text();

      if (
        endpoint === "/login" ||
        endpoint === "/register" ||
        body.includes("Token inválido") ||
        ERROS_CONEXAO_BACKEND.some((erro) => body.includes(erro))
      ) {
        return true;
      }
    } catch (error) {
      return response.status >= 500;
    }
  }

  return false;
}

async function fetchComFallback(renderBaseUrl, localBaseUrl, endpoint, options = {}) {
  const renderUrl = `${renderBaseUrl}${endpoint}`;
  const localUrl = `${localBaseUrl}${endpoint}`;

  if (usandoLocal()) {
    return fetch(localUrl, options);
  }

  try {
    const response = await fetch(renderUrl, options);

    if (await deveTentarLocal(response, endpoint)) {
      console.warn(`Render falhou. Usando Kubernetes local: ${localUrl}`);
      definirAmbienteLocal();
      return fetch(localUrl, options);
    }

    return response;
  } catch (error) {
    console.warn("Não foi possível acessar o Render. Usando Kubernetes local...", error);
    definirAmbienteLocal();
    return fetch(localUrl, options);
  }
}

// AUTH
export async function loginRequest(data) {
  limparAmbiente();

  return fetchComFallback(RENDER_BASE_URL, LOCAL_BASE_URL, "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function registerRequest(data) {
  limparAmbiente();

  return fetchComFallback(RENDER_BASE_URL, LOCAL_BASE_URL, "/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

// ROOMS
export async function getRooms(token) {
  return fetchComFallback(RENDER_BASE_URL, LOCAL_BASE_URL, "/rooms", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}

export async function createRoomRequest(data, token) {
  return fetchComFallback(RENDER_BASE_URL, LOCAL_BASE_URL, "/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });
}

export async function updateRoomRequest(id, data, token) {
  return fetchComFallback(RENDER_BASE_URL, LOCAL_BASE_URL, `/rooms/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });
}

export async function deleteRoomRequest(id, token) {
  return fetchComFallback(RENDER_BASE_URL, LOCAL_BASE_URL, `/rooms/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}

export async function toggleRoomRequest(id, token) {
  return fetchComFallback(RENDER_BASE_URL, LOCAL_BASE_URL, `/rooms/${id}/toggle`, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}

// BOOKINGS
export async function createBookingRequest(data, token) {
  return fetchComFallback(RENDER_BASE_URL, LOCAL_BASE_URL, "/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });
}

export async function deleteBookingRequest(id, token) {
  return fetchComFallback(RENDER_BASE_URL, LOCAL_BASE_URL, `/bookings/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}

// BFF
export async function getMyBookings(token) {
  return fetchComFallback(RENDER_BFF_URL, LOCAL_BFF_URL, "/dashboard/my-bookings", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}