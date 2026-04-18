class RoomsGatewayController {
  constructor(roomsProxy) {
    this.roomsProxy = roomsProxy;
  }

  list = async (req, res) => {
    try {
      const rooms = await this.roomsProxy.getRooms();
      return res.json(rooms);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar salas' });
    }
  };
}

create = async (req, res) => {
  try {
    const room = await this.roomsProxy.createRoom(req.body);
    return res.status(201).json(room);
  } catch {
    return res.status(500).json({ error: 'Erro ao criar sala' });
  }
};

toggle = async (req, res) => {
  try {
    const room = await this.roomsProxy.toggleRoom(req.params.id);
    return res.json(room);
  } catch {
    return res.status(500).json({ error: 'Erro ao atualizar sala' });
  }
};

module.exports = RoomsGatewayController;