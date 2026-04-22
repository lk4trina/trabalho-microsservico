const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'P@ulinha2003', {
  host: process.env.DB_HOST || 'db', 
  port: 5432,
  dialect: 'postgres',
  logging: console.log 
});

module.exports = sequelize;