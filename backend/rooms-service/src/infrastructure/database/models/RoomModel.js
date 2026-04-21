const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Room = sequelize.define('Room', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'rooms',
  schema: 'public'
});

module.exports = Room;