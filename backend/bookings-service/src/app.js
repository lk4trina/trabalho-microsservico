const express = require('express');
const cors = require('cors');
const sequelize = require('./infrastructure/database/sequelize');
const BookingModel = require('./infrastructure/database/models/BookingModel');

const SqlBookingRepository = require('./infrastructure/repositories/SqlBookingRepository');
const CreateBooking = require('./application/use-cases/CreateBooking');
const EditBooking = require('./application/use-cases/EditBooking');
const DeleteBooking = require('./application/use-cases/DeleteBooking');
const ListUserBookings = require('./application/use-cases/ListUserBookings');
const BookingController = require('./presentation/controllers/BookingController');


const bookingRoutes = require('./presentation/routes/bookingRoutes');

const app = express();
app.use(express.json());
app.use(cors());

const bookingRepository = new SqlBookingRepository();
const bookingController = new BookingController(
  new CreateBooking(bookingRepository),
  new EditBooking(bookingRepository),
  new DeleteBooking(bookingRepository),
  new ListUserBookings(bookingRepository)
);


app.use(bookingRoutes(bookingController));


async function inicializarBanco() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Tabela de Reservas (Bookings) sincronizada com sucesso!");
  } catch (error) {
    console.error("Erro ao sincronizar BD de Reservas:", error);
  }
}
inicializarBanco();

module.exports = app;