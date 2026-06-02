const BookingController = require("../src/presentation/controllers/BookingController");

describe("EditBooking", () => {
  let req, res, bookingController;

  beforeEach(() => {
    bookingController = new BookingController({}, {}, {}, {});
    req = {
      headers: { "x-user-id": "1", "x-user-role": "USER" },
      body: {},
      params: { id: "1" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe("Unitário: Controller", () => {
    it("Deve retornar 200 ao Editar com sucesso", async () => {
      bookingController.editBooking = {
        execute: jest.fn().mockResolvedValue({ id: 1 }),
      };
      
      await bookingController.edit(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    it("Deve retornar 400 se o Editar falhar (Branch do CATCH)", async () => {
      bookingController.editBooking = {
        execute: jest.fn().mockRejectedValue(new Error("Erro ao editar")),
      };
      
      await bookingController.edit(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});