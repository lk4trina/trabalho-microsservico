const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Sua conexão

const User = sequelize.define('User', {

  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true 
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USER' 
  }
}, {
  tableName: 'users', 
  schema: 'public'
});

module.exports = User;