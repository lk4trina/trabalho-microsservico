class ToggleRoomStatus {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute(id) {
    const room = await this.roomRepository.findById(id);

    if (!room) {
      throw new Error("Sala não encontrada");
    }

    room.active = !room.active;

    await this.roomRepository.update(room);

    return room;
  }
}

module.exports = ToggleRoomStatus;
