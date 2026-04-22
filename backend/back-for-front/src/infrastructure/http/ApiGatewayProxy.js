const axios = require('axios');

class ApiGatewayProxy {
  constructor(baseURL) {
    this.client = axios.create({ baseURL });
  }

  async getUserBookings(token) {
    const response = await this.client.get('/bookings/my', {
      headers: { Authorization: token }
    });
    return response.data;
  }

  async getRooms(token) {
    const response = await this.client.get('/rooms', {
      headers: { Authorization: token }
    });
    return response.data;
  }
}

module.exports = ApiGatewayProxy;