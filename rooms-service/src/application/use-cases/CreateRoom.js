const Room = require('../../domain/entities/Room');

class CreateRoom {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  execute({ name, capacity }) {
    const room = new Room({ name, capacity });
    return this.roomRepository.create(room);
  }
}

module.exports = CreateRoom;