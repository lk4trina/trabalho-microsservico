const axios = require("axios");

class RoomsProxy {
  constructor(baseURL) {
    this.client = axios.create({ baseURL });
  }

  async getRooms(token) {
    const response = await this.client.get("/rooms", {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  }

  async createRoom(data, token) {
    const response = await this.client.post("/rooms", data, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  }

  async toggleRoom(id, token) {
    const response = await this.client.patch(
      `/rooms/${id}/toggle`,
      {},
      {
        headers: {
          Authorization: token,
        },
      },
    );
    return response.data;
  }
}

module.exports = RoomsProxy;
