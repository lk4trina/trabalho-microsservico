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

  async update(id, data) {
    const room = await Room.findByPk(id);

    if (!room) return null;

    if (data.name !== undefined) room.name = data.name;
    if (data.capacity !== undefined) room.capacity = data.capacity;
    if (data.active !== undefined) room.active = data.active;

    await room.save();

    return room;
  }

  async delete(id) {
    const room = await Room.findByPk(id);

    if (!room) return null;

    await room.destroy();

    return true;
  }
}

module.exports = SqlRoomRepository;
