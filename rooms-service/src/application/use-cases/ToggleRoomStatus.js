class ToggleRoomStatus {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  execute(id) {
    const room = this.roomRepository.findById(Number(id));

    if (!room) {
      throw new Error('Sala não encontrada');
    }

    room.active = !room.active;

    console.log("NOVO STATUS:", room.active); // debug

    return this.roomRepository.update(room);
  }
}

module.exports = ToggleRoomStatus;