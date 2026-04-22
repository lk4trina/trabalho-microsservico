class ListActiveRooms {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute() {
    const rooms = await this.roomRepository.findAll();

    return rooms.filter((room) => room.active);
  }
}

module.exports = ListActiveRooms;
