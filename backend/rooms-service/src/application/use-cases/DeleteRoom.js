class DeleteRoom {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute(id) {
    const room = await this.roomRepository.findById(id);

    if (!room) {
      throw new Error("Sala não encontrada");
    }

    await room.destroy();

    return { message: "Sala removida com sucesso" };
  }
}

module.exports = DeleteRoom;
