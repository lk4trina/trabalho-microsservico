const Room = require('../database/models/RoomModel');

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


    return await room.update(updatedRoom);
  }
}

module.exports = SqlRoomRepository;