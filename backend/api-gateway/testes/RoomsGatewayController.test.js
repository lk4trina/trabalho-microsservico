const RoomsGatewayController = require("../src/presentation/controllers/RoomsGatewayController");

describe("RoomsGatewayController", () => {
  let roomsProxy;
  let controller;
  let res;

  beforeEach(() => {
    roomsProxy = {
      getRooms: jest.fn(),
      createRoom: jest.fn(),
      updateRoom: jest.fn(),
      deleteRoom: jest.fn(),
      toggleRoom: jest.fn()
    };

    controller = new RoomsGatewayController(roomsProxy);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test("deve listar salas", async () => {
    roomsProxy.getRooms.mockResolvedValue([{ id: 1 }]);

    const req = {
      headers: {
        authorization: "Bearer token"
      }
    };

    await controller.list(req, res);

    expect(roomsProxy.getRooms).toHaveBeenCalledWith("Bearer token");
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  test("deve retornar erro ao listar salas", async () => {
    roomsProxy.getRooms.mockRejectedValue(new Error("erro"));

    const req = {
      headers: {
        authorization: "Bearer token"
      }
    };

    await controller.list(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao buscar salas" });
  });

  test("deve criar sala com sucesso", async () => {
    roomsProxy.createRoom.mockResolvedValue({ id: 1, name: "Sala 1" });

    const req = {
      headers: {
        authorization: "Bearer token"
      },
      body: {
        name: "Sala 1",
        capacity: 10
      }
    };

    await controller.create(req, res);

    expect(roomsProxy.createRoom).toHaveBeenCalledWith(
      { name: "Sala 1", capacity: 10 },
      "Bearer token"
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1, name: "Sala 1" });
  });

  test("deve bloquear criação com dados inválidos", async () => {
    const req = {
      headers: {
        authorization: "Bearer token"
      },
      body: {
        name: "",
        capacity: null
      }
    };

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Dados inválidos" });
  });

  test("deve retornar erro ao criar sala", async () => {
    roomsProxy.createRoom.mockRejectedValue(new Error("erro"));

    const req = {
      headers: {
        authorization: "Bearer token"
      },
      body: {
        name: "Sala 1",
        capacity: 10
      }
    };

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao criar sala" });
  });

  test("deve atualizar sala", async () => {
    roomsProxy.updateRoom.mockResolvedValue({ id: 1, name: "Nova" });

    const req = {
      headers: {
        authorization: "Bearer token"
      },
      params: {
        id: "1"
      },
      body: {
        name: "Nova"
      }
    };

    await controller.update(req, res);

    expect(roomsProxy.updateRoom).toHaveBeenCalledWith(
      "1",
      { name: "Nova" },
      "Bearer token"
    );
    expect(res.json).toHaveBeenCalledWith({ id: 1, name: "Nova" });
  });

  test("deve retornar erro ao atualizar sala", async () => {
    roomsProxy.updateRoom.mockRejectedValue(new Error("erro"));

    const req = {
      headers: {
        authorization: "Bearer token"
      },
      params: {
        id: "1"
      },
      body: {
        name: "Nova"
      }
    };

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao atualizar sala" });
  });

  test("deve deletar sala", async () => {
    roomsProxy.deleteRoom.mockResolvedValue({ success: true });

    const req = {
      headers: {
        authorization: "Bearer token"
      },
      params: {
        id: "1"
      }
    };

    await controller.delete(req, res);

    expect(roomsProxy.deleteRoom).toHaveBeenCalledWith("1", "Bearer token");
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  test("deve retornar erro ao deletar sala", async () => {
    roomsProxy.deleteRoom.mockRejectedValue(new Error("erro"));

    const req = {
      headers: {
        authorization: "Bearer token"
      },
      params: {
        id: "1"
      }
    };

    await controller.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao remover sala" });
  });

  test("deve alternar status da sala", async () => {
    roomsProxy.toggleRoom.mockResolvedValue({ id: 1, active: false });

    const req = {
      headers: {
        authorization: "Bearer token"
      },
      params: {
        id: "1"
      }
    };

    await controller.toggle(req, res);

    expect(roomsProxy.toggleRoom).toHaveBeenCalledWith("1", "Bearer token");
    expect(res.json).toHaveBeenCalledWith({ id: 1, active: false });
  });

  test("deve retornar erro ao alternar status", async () => {
    roomsProxy.toggleRoom.mockRejectedValue(new Error("erro"));

    const req = {
      headers: {
        authorization: "Bearer token"
      },
      params: {
        id: "1"
      }
    };

    await controller.toggle(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Sala não encontrada" });
  });
});