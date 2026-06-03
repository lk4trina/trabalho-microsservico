const BookingController = require("../src/presentation/controllers/BookingController");

describe("ListUserBookings", () => {
  let req, res, bookingController;

  beforeEach(() => {
    bookingController = new BookingController({}, {}, {}, {});
    req = {
      headers: { "x-user-id": "1", "x-user-role": "USER" },
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe("Unitário: Controller", () => {
    it("Deve retornar 200 ao Listar com sucesso", async () => {
      bookingController.listUserBookings = {
        execute: jest.fn().mockResolvedValue([]),
      };
      
      await bookingController.list(req, res);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it("Deve retornar 500 se o Listar falhar (Branch do CATCH)", async () => {
      bookingController.listUserBookings = {
        execute: jest.fn().mockRejectedValue(new Error("Erro interno")),
      };
      
      await bookingController.list(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});