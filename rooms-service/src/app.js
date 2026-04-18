const express = require('express');
const cors = require('cors');

const InMemoryRoomRepository = require('./infrastructure/repositories/InMemoryRoomRepository');
const CreateRoom = require('./application/use-cases/CreateRoom');
const ListActiveRooms = require('./application/use-cases/ListActiveRooms');
const ToggleRoomStatus = require('./application/use-cases/ToggleRoomStatus');
const RoomController = require('./presentation/controllers/RoomController');
const roomRoutes = require('./presentation/routes/roomRoutes');

const app = express();
app.use(express.json());
app.use(cors());

const roomRepository = new InMemoryRoomRepository();

const createRoom = new CreateRoom(roomRepository);
const listActiveRooms = new ListActiveRooms(roomRepository);
const toggleRoomStatus = new ToggleRoomStatus(roomRepository);

const roomController = new RoomController(
  createRoom,
  listActiveRooms,
  toggleRoomStatus
);

app.use(roomRoutes(roomController));

module.exports = app;