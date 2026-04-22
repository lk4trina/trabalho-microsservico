const axios = require('axios');

class BookingsProxy {
  constructor(baseURL) {
    this.client = axios.create({ baseURL });
  }


  getHeaders(userId) {
    return { headers: { 'x-user-id': userId } };
  }

  async createBooking(data, userId) {
    const response = await this.client.post('/bookings', data, this.getHeaders(userId));
    return response.data;
  }

  async getUserBookings(userId) {
    const response = await this.client.get('/bookings/my', this.getHeaders(userId));
    return response.data;
  }

  async editBooking(id, data, userId) {
    const response = await this.client.put(`/bookings/${id}`, data, this.getHeaders(userId));
    return response.data;
  }

  async cancelBooking(id, userId) {
    const response = await this.client.patch(`/bookings/${id}/cancel`, {}, this.getHeaders(userId));
    return response.data;
  }
}

module.exports = BookingsProxy;