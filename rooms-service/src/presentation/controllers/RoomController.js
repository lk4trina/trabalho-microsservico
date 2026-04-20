class RoomController {
  constructor(createRoom, listAllRooms, toggleRoomStatus) {
    this.createRoom = createRoom;
    this.listAllRooms = listAllRooms;
    this.toggleRoomStatus = toggleRoomStatus;
  }

  create = (req, res) => {
    try {
      const room = this.createRoom.execute(req.body);
      return res.status(201).json(room);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  list = (req, res) => {
    const rooms = this.listAllRooms.execute();
    return res.json(rooms);
  };

  toggleStatus = (req, res) => {
    try {
      const room = this.toggleRoomStatus.execute(req.params.id);
      return res.json(room);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  };
}

module.exports = RoomController;