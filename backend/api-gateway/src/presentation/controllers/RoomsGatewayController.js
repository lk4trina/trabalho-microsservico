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
      console.error("Erro list:", error);
      return res.status(500).json({ error: "Erro ao buscar salas" });
    }
  };

  create = async (req, res) => {
    try {
      const token = req.headers.authorization;
      const { name, capacity } = req.body;

      if (!name || !capacity) {
        return res.status(400).json({ error: "Dados inválidos" });
      }

      const room = await this.roomsProxy.createRoom({ name, capacity }, token);

      return res.status(201).json(room);
    } catch (error) {
      console.error("Erro create:", error);
      return res.status(500).json({ error: "Erro ao criar sala" });
    }
  };

  update = async (req, res) => {
    try {
      const token = req.headers.authorization;
      const room = await this.roomsProxy.updateRoom(
        req.params.id,
        req.body,
        token,
      );
      return res.json(room);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar sala" });
    }
  };

  delete = async (req, res) => {
    try {
      const token = req.headers.authorization;
      const result = await this.roomsProxy.deleteRoom(req.params.id, token);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao remover sala" });
    }
  };

  toggle = async (req, res) => {
    try {
      const token = req.headers.authorization;

      const room = await this.roomsProxy.toggleRoom(req.params.id, token);

      return res.json(room);
    } catch (error) {
      console.error("Erro toggle:", error);
      return res.status(404).json({ error: "Sala não encontrada" });
    }
  };
}

module.exports = RoomsGatewayController;
