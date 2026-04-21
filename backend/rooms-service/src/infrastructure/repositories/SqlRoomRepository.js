const Room = require("../database/models/RoomModel");

class SqlRoomRepository {
  async create(roomData) {
    return await Room.create(roomData);
  }

  async findAll() {
    return await Room.findAll();
  }

  async findById(id) {
    return await Room.findByPk(id);
  }

  async update(updatedRoom) {
    const room = await Room.findByPk(updatedRoom.id);

    if (!room) return null;

    // 🔥 atualiza campos
    room.name = updatedRoom.name;
    room.capacity = updatedRoom.capacity;
    room.active = updatedRoom.active;

    await room.save();

    return room;
  }
}

module.exports = SqlRoomRepository;
