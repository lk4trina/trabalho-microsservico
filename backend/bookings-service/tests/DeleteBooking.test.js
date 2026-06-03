const BookingController = require("../src/presentation/controllers/BookingController");
const DeleteBooking = require("../src/application/use-cases/DeleteBooking"); 

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

  describe("Unitário: Use Case", () => {
    let mockRepository, useCase;

    beforeEach(() => {
      mockRepository = { findById: jest.fn(), delete: jest.fn() };
      useCase = new DeleteBooking(mockRepository);
    });

    it("Deve deletar a reserva com sucesso se pertencer ao usuário", async () => {
      mockRepository.findById.mockResolvedValue({ id: 1, userId: "1" });
      mockRepository.delete.mockResolvedValue(true);

      await expect(useCase.execute("1", "1", "USER")).resolves.not.toThrow();
      expect(mockRepository.delete).toHaveBeenCalledWith("1");
    });

    it("Deve lançar erro se a reserva não for encontrada", async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(useCase.execute("99", "1", "USER")).rejects.toThrow();
    });

    it("Deve impedir que o usuário delete a reserva de outro usuário, mesmo sendo ADMIN", async () => {
      mockRepository.findById.mockResolvedValue({ id: 1, userId: "2" }); 
      await expect(useCase.execute("1", "1", "ADMIN")).rejects.toThrow(); 
    });
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