const axios = require('axios');

class RoomsProxy {
  constructor(baseURL) {
    this.client = axios.create({ baseURL });
  }

  async getRooms() {
    const response = await this.client.get('/rooms');
    return response.data;
  }

  async createRoom(data) {
  const response = await this.client.post('/rooms', data);
  return response.data;
  }

  async toggleRoom(id) {
  const response = await this.client.patch(`/rooms/${id}/toggle`);
  return response.data;
  }
}

module.exports = RoomsProxy;