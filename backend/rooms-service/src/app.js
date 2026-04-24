const express = require("express");
const cors = require("cors");

const SqlRoomRepository = require("./infrastructure/repositories/SqlRoomRepository");

const CreateRoom = require("./application/use-cases/CreateRoom");
const ListAllRooms = require("./application/use-cases/ListAllRooms");
const ListActiveRooms = require("./application/use-cases/ListActiveRooms");
const ToggleRoomStatus = require("./application/use-cases/ToggleRoomStatus");

const RoomController = require("./presentation/controllers/RoomController");

const roomRoutes = require("./presentation/routes/roomRoutes");

const authMiddleware = require("./presentation/middlewares/authmiddleware");

const app = express();
app.use(express.json());
app.use(cors());

app.use(authMiddleware);


const roomRepository = new SqlRoomRepository();

const createRoom = new CreateRoom(roomRepository);
const listAllRooms = new ListAllRooms(roomRepository);
const listActiveRooms = new ListActiveRooms(roomRepository);
const toggleRoomStatus = new ToggleRoomStatus(roomRepository);

const roomController = new RoomController(
  createRoom,
  listAllRooms,
  listActiveRooms,
  toggleRoomStatus
);

app.use(roomRoutes(roomController));

const sequelize = require("./infrastructure/database/sequelize");
const Room = require("./infrastructure/database/models/RoomModel");

async function inicializarBanco() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Tabelas do Rooms Service criadas/sincronizadas com sucesso!");
  } catch (error) {
    console.error("Erro ao sincronizar banco do Rooms Service:", error);
  }
}

inicializarBanco();

module.exports = app;