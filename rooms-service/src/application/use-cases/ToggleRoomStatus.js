class ToggleRoomStatus {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  execute(id) {
    const room = this.roomRepository.findById(id);

    if (!room) {
      throw new Error('Sala não encontrada');
    }

    room.active = !room.active;
    return this.roomRepository.update(room);
  }
}

module.exports = ToggleRoomStatus;