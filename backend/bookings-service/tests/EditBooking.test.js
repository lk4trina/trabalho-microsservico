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

  describe("Unitário: Use Case", () => {
    let mockRepository, EditBooking, useCase;

    beforeEach(() => {
      mockRepository = { findById: jest.fn(), update: jest.fn() };
      EditBooking = require("../../src/application/use-cases/EditBooking");
      useCase = new EditBooking(mockRepository);
    });

    it("Deve editar a reserva com sucesso se pertencer ao usuário", async () => {
      const mockBooking = { id: 1, userId: "1", updateParams: jest.fn() };
      mockRepository.findById.mockResolvedValue(mockBooking);
      mockRepository.update.mockResolvedValue({ id: 1, status: "CANCELLED" });

      const result = await useCase.execute("1", { status: "CANCELLED" }, "1", "USER");
      expect(result.status).toBe("CANCELLED");
    });

    it("Deve lançar erro se tentar editar reserva de outro usuário", async () => {
      const mockBooking = { id: 1, userId: "2" }; 
      mockRepository.findById.mockResolvedValue(mockBooking);

      await expect(useCase.execute("1", { status: "CANCELLED" }, "1", "USER")).rejects.toThrow();
    });
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