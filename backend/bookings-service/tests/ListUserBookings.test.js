const BookingController = require("../src/presentation/controllers/BookingController");
const ListUserBookings = require("../src/application/use-cases/ListUserBookings"); 

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

  describe("Unitário: Use Case", () => {
    let mockRepository, useCase;

    beforeEach(() => {
      mockRepository = { findByUserId: jest.fn() };
      useCase = new ListUserBookings(mockRepository);
    });

    it("Deve retornar as reservas do próprio usuário", async () => {
      mockRepository.findByUserId.mockResolvedValue([{ id: 1, userId: "1" }]);
      
      const result = await useCase.execute("1", "USER");
      expect(mockRepository.findByUserId).toHaveBeenCalledWith("1");
      expect(result).toHaveLength(1);
    });

    it("Deve restringir a listagem aos dados do próprio usuário, mesmo se for ADMIN", async () => {
      mockRepository.findByUserId.mockResolvedValue([{ id: 2, userId: "1" }]);
      
      const result = await useCase.execute("1", "ADMIN"); 
      
      expect(mockRepository.findByUserId).toHaveBeenCalledWith("1");
      expect(result[0].userId).toBe("1");
    });
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