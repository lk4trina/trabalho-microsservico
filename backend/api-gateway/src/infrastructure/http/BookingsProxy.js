const axios = require('axios');

class BookingsProxy {
  constructor(baseURL) {
    this.client = axios.create({ baseURL });
  }


  getHeaders(userId, userRole) {
    return { 
      headers: { 
        'x-user-id': userId,
        'x-user-role': userRole 
      } 
    };
  }

async createBooking(data, userId, userRole) {
    const response = await this.client.post('/bookings', data, this.getHeaders(userId, userRole));
    return response.data;
  }

  async getUserBookings(userId, userRole) {
    const response = await this.client.get('/bookings/my', this.getHeaders(userId, userRole));
    return response.data;
  }

  async editBooking(id, data, userId, userRole) {
    const response = await this.client.put(`/bookings/${id}`, data, this.getHeaders(userId, userRole));
    return response.data;
  }

  async deleteBooking(id, userId, userRole) {
    const response = await this.client.delete(`/bookings/${id}`, this.getHeaders(userId, userRole));
    return response.data;
  }
}

module.exports = BookingsProxy;