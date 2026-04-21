class ToggleRoomStatus {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

 /* execute(id) {
    const room = this.roomRepository.findById(Number(id));

    if (!room) {
      throw new Error('Sala não encontrada');
    }

    room.active = !room.active;

    console.log("NOVO STATUS:", room.active); // debug

    return this.roomRepository.update(room);
  }*/

  async execute(id) {
  
    const room = await this.roomRepository.findById(id);

    if (!room) {
      throw new Error('Sala não encontrada');
    }

    room.active = !room.active;
    
    
    return await this.roomRepository.update(room);
  }    
}

module.exports = ToggleRoomStatus;