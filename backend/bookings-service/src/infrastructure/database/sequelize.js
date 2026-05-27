const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'postgres', 
  process.env.DB_USER || 'postgres', 
  process.env.DB_PASS || 'P@ulinha2003', 
  {
    host: process.env.DB_HOST || 'db', 
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log 
  }
);

module.exports = sequelize;