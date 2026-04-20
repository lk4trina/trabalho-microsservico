class ListAllRooms {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  execute() {
    return this.roomRepository.findAll();
  }
}

module.exports = ListAllRooms;