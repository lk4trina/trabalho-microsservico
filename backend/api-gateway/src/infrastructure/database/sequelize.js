const { Sequelize } = require('sequelize');

const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: { 
          require: true, 
          rejectUnauthorized: false
        }
      },
      logging: false
    })
  : new Sequelize('postgres', 'postgres', 'P@ulinha2003', {
      host: process.env.DB_HOST || 'db', 
      port: 5432,
      dialect: 'postgres',
      logging: console.log 
    });

module.exports = sequelize;