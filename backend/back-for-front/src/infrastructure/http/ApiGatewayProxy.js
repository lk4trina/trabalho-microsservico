const axios = require("axios");

class ApiGatewayProxy {
  constructor(baseURL) {
    this.client = axios.create({ baseURL });
  }

  async getUserBookings(token) {
    // CORREÇÃO: Apenas um "headers" e passamos a variável "token" direto!
    const response = await this.client.get("/bookings/my", {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  }

  async getRooms(token) {
    // CORREÇÃO: Apenas um "headers" e passamos a variável "token" direto!
    const response = await this.client.get("/rooms", {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  }
}

module.exports = ApiGatewayProxy;