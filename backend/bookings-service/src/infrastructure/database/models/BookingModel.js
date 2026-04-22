const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Booking = sequelize.define('Booking', {
  roomId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false }, 
  startTime: { type: DataTypes.DATE, allowNull: false },
  endTime: { type: DataTypes.DATE, allowNull: false },
  status: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    defaultValue: 'ACTIVE' //'ACTIVE' ou 'CANCELLED'
  }
}, {
  tableName: 'bookings',
  schema: 'public'
});

module.exports = Booking;