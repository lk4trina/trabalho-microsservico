const BookingsGatewayController = require("../src/presentation/controllers/BookingsGatewayController");

describe("BookingsGatewayController", () => {
  let bookingsProxy;
  let controller;
  let res;

  beforeEach(() => {
    bookingsProxy = {
      createBooking: jest.fn(),
      getUserBookings: jest.fn(),
      editBooking: jest.fn(),
      deleteBooking: jest.fn()
    };

    controller = new BookingsGatewayController(bookingsProxy);

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  test("deve criar reserva com sucesso", async () => {
    bookingsProxy.createBooking.mockResolvedValue({ id: 1 });

    const req = {
      body: { roomId: 2 },
      user: { id: 10, role: "user" }
    };

    await controller.create(req, res);

    expect(bookingsProxy.createBooking).toHaveBeenCalledWith(
      { roomId: 2 },
      10,
      "user"
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1 });
  });

  test("deve retornar erro ao criar reserva", async () => {
    bookingsProxy.createBooking.mockRejectedValue({
      response: {
        data: {
          error: "Sala indisponível"
        }
      }
    });

    const req = {
      body: { roomId: 2 },
      user: { id: 10, role: "user" }
    };

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Sala indisponível" });
  });

  test("deve listar reservas do usuário", async () => {
    bookingsProxy.getUserBookings.mockResolvedValue([{ id: 1 }]);

    const req = {
      user: { id: 10, role: "user" }
    };

    await controller.listUserBookings(req, res);

    expect(bookingsProxy.getUserBookings).toHaveBeenCalledWith(10, "user");
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  test("deve retornar erro ao listar reservas", async () => {
    bookingsProxy.getUserBookings.mockRejectedValue(new Error("erro"));

    const req = {
      user: { id: 10, role: "user" }
    };

    await controller.listUserBookings(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro ao buscar reservas no gateway"
    });
  });

  test("deve editar reserva com sucesso", async () => {
    bookingsProxy.editBooking.mockResolvedValue({ id: 1, status: "editada" });

    const req = {
      params: { id: "1" },
      body: { date: "2026-01-01" },
      user: { id: 10, role: "user" }
    };

    await controller.edit(req, res);

    expect(bookingsProxy.editBooking).toHaveBeenCalledWith(
      "1",
      { date: "2026-01-01" },
      10,
      "user"
    );
    expect(res.json).toHaveBeenCalledWith({ id: 1, status: "editada" });
  });

  test("deve retornar erro ao editar reserva", async () => {
    bookingsProxy.editBooking.mockRejectedValue({
      response: {
        data: {
          error: "Reserva não encontrada"
        }
      }
    });

    const req = {
      params: { id: "1" },
      body: { date: "2026-01-01" },
      user: { id: 10, role: "user" }
    };

    await controller.edit(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Reserva não encontrada" });
  });

  test("deve excluir reserva com sucesso", async () => {
    bookingsProxy.deleteBooking.mockResolvedValue();

    const req = {
      params: { id: "1" },
      user: { id: 10, role: "user" }
    };

    await controller.delete(req, res);

    expect(bookingsProxy.deleteBooking).toHaveBeenCalledWith(
      "1",
      10,
      "user"
    );
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  test("deve retornar erro ao excluir reserva", async () => {
    bookingsProxy.deleteBooking.mockRejectedValue({
      response: {
        data: {
          error: "Erro ao excluir"
        }
      }
    });

    const req = {
      params: { id: "1" },
      user: { id: 10, role: "user" }
    };

    await controller.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao excluir" });
  });
});