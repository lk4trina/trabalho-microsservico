class InMemoryRoomRepository {
  constructor() {
    this.rooms = [];
    this.currentId = 1;
  }

  create(room) {
    const newRoom = { ...room, id: this.currentId++ };
    this.rooms.push(newRoom);
    return newRoom;
  }

  findAll() {
    return this.rooms;
  }

  findById(id) {
    return this.rooms.find(room => room.id === Number(id));
  }

  update(updatedRoom) {
    const index = this.rooms.findIndex(room => room.id === updatedRoom.id);
    if (index === -1) return null;

    this.rooms[index] = updatedRoom;
    return updatedRoom;
  }
}

module.exports = InMemoryRoomRepository;