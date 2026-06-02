const BookingController = require("../src/presentation/controllers/BookingController");

describe("DeleteBooking", () => {
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
    it("Deve retornar 204 ao Deletar com sucesso", async () => {
      bookingController.deleteBooking = {
        execute: jest.fn().mockResolvedValue(),
      };
      
      await bookingController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("Deve retornar 400 se o Deletar falhar (Branch do CATCH)", async () => {
      bookingController.deleteBooking = {
        execute: jest.fn().mockRejectedValue(new Error("Erro ao deletar")),
      };
      
      await bookingController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});