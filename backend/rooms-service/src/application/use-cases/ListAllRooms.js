class ListAllRooms {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute() {
    //return this.roomRepository.findAll();
    return await this.roomRepository.findAll();
  }
}

module.exports = ListAllRooms;