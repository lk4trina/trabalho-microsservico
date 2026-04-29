const { Op } = require('sequelize');
const Booking = require('../database/models/BookingModel');

class SqlBookingRepository {
  async create(bookingData) {
    return await Booking.create(bookingData);
  }

  async update(booking) {
    return await booking.save();
  }

  async findById(id) {
    return await Booking.findByPk(id);
  }

  async findByUserId(userId) {
    return await Booking.findAll({ where: { userId }, order: [['startTime', 'DESC']] });
  }

async delete(id) {
  return await Booking.destroy({ where: { id } });
}

async findAll() {
  return await Booking.findAll({ order: [['startTime', 'ASC']] });
}

  async findConflictingBooking(roomId, startTime, endTime, excludeBookingId = null) {
    const whereClause = {
      roomId,
      status: 'ACTIVE', 
      startTime: { [Op.lt]: new Date(endTime) },
      endTime: { [Op.gt]: new Date(startTime) }
    };

    if (excludeBookingId) {
      whereClause.id = { [Op.ne]: excludeBookingId }; 
    }

    return await Booking.findOne({ where: whereClause });
  }
}

module.exports = SqlBookingRepository;