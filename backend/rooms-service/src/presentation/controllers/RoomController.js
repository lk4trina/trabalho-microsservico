class RoomController {
  constructor(createRoom, listAllRooms, toggleRoomStatus) {
    this.createRoom = createRoom;
    this.listAllRooms = listAllRooms;
    this.toggleRoomStatus = toggleRoomStatus;
  }

  /*create = (req, res) => {
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
  };*/

  create = async (req, res) => {
    try {
      const room = await this.createRoom.execute(req.body);
      return res.status(201).json(room);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };


  list = async (req, res) => {
    try {
      const rooms = await this.listAllRooms.execute();
      return res.json(rooms); 
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };


  toggleStatus = async (req, res) => {
    try {
      const room = await this.toggleRoomStatus.execute(req.params.id);
      return res.json(room);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  };  
}

module.exports = RoomController;