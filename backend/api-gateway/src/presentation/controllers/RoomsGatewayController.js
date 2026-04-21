class RoomsGatewayController {
  constructor(roomsProxy) {
    this.roomsProxy = roomsProxy;
  }

  list = async (req, res) => {
    try {
      const token = req.headers.authorization;
      const rooms = await this.roomsProxy.getRooms(token);
      return res.json(rooms);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar salas" });
    }
  };

  create = async (req, res) => {
    try {
      const { name, capacity } = req.body;

      if (!name || !capacity) {
        return res.status(400).json({ error: "Dados inválidos" });
      }

      const room = await this.roomsProxy.createRoom({ name, capacity });
      return res.status(201).json(room);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar sala" });
    }
  };

  toggle = async (req, res) => {
    try {
      const room = await this.roomsProxy.toggleRoom(req.params.id);
      return res.json(room);
    } catch (error) {
      console.error(error);
      return res.status(404).json({ error: "Sala não encontrada" });
    }
  };
}

module.exports = RoomsGatewayController;
