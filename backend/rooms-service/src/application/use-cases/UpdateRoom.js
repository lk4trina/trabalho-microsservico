class UpdateRoom {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute(id, data) {
    const room = await this.roomRepository.findById(id);

    if (!room) {
      throw new Error("Sala não encontrada");
    }

    room.name = data.name ?? room.name;
    room.capacity = data.capacity ?? room.capacity;

    await room.save();

    return room;
  }
}

module.exports = UpdateRoom;
