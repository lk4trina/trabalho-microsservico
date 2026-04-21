/*class ListActiveRooms {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

 // execute() {
 //   return this.roomRepository.findAll().filter(room => room.active);
 // }

  async execute() { 

    const rooms = await this.roomRepository.findAll(); 
    

    return rooms.filter(room => room.active);
  } //Ana - 21/04/2026: se for descomentar isso, usa essa função daí

}

module.exports = ListActiveRooms;*/