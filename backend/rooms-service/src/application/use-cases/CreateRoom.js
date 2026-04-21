const Room = require('../../domain/entities/Room');

class CreateRoom {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

/*  execute({ name, capacity }) {
    const room = new Room({ name, capacity, active:true });
    return this.roomRepository.create(room);
  }
*/

  async execute({ name, capacity }) {
    const room = new Room({ name, capacity });
    
    return await this.roomRepository.create(room); 
  }
}

module.exports = CreateRoom;