const BookingController = require("../src/presentation/controllers/BookingController");
const EditBooking = require("../src/application/use-cases/EditBooking"); 

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
    let mockRepository, useCase;
    let agora, amanha, depoisDeAmanha, ontem;

    beforeEach(() => {
      mockRepository = { 
        findById: jest.fn(), 
        update: jest.fn(),
        findConflictingBooking: jest.fn() 
      };
      useCase = new EditBooking(mockRepository);

      agora = new Date();
      amanha = new Date(agora); amanha.setDate(amanha.getDate() + 1);
      depoisDeAmanha = new Date(agora); depoisDeAmanha.setDate(depoisDeAmanha.getDate() + 2);
      ontem = new Date(agora); ontem.setDate(ontem.getDate() - 1);
    });

    it("Deve editar a reserva com sucesso", async () => {
      const mockBooking = { id: 1, userId: "1", roomId: 2, startTime: new Date(), endTime: new Date() };
      mockRepository.findById.mockResolvedValue(mockBooking);
      mockRepository.findConflictingBooking.mockResolvedValue(null); // Sem conflitos
      mockRepository.update.mockResolvedValue({ ...mockBooking, roomId: 3 });

      const result = await useCase.execute("1", "1", { 
        startTime: amanha.toISOString(), 
        endTime: depoisDeAmanha.toISOString(), 
        roomId: 3 
      });

      expect(mockRepository.update).toHaveBeenCalled();
      expect(result.roomId).toBe(3);
    });

    it("Deve lançar erro se a reserva não existir", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute("99", "1", { startTime: amanha, endTime: depoisDeAmanha })
      ).rejects.toThrow("Reserva não encontrada.");
    });

    it("Deve lançar erro se o usuário tentar editar reserva de outro", async () => {
      mockRepository.findById.mockResolvedValue({ id: 1, userId: "2" }); 

      await expect(
        useCase.execute("1", "1", { startTime: amanha, endTime: depoisDeAmanha })
      ).rejects.toThrow("Sem permissão para editar esta reserva.");
    });

    it("Deve lançar erro se tentar alterar a reserva para uma data no passado", async () => {
      mockRepository.findById.mockResolvedValue({ id: 1, userId: "1" });

      await expect(
        useCase.execute("1", "1", { 
          startTime: ontem.toISOString(), 
          endTime: amanha.toISOString() 
        })
      ).rejects.toThrow("Não é possível alterar a reserva para uma data no passado.");
    });

    it("Deve lançar erro se a data de início for igual ou maior que a de término", async () => {
      mockRepository.findById.mockResolvedValue({ id: 1, userId: "1" });

      await expect(
        useCase.execute("1", "1", { 
          startTime: depoisDeAmanha.toISOString(), 
          endTime: amanha.toISOString() 
        })
      ).rejects.toThrow("A data de início deve ser anterior à data de término.");
    });

    it("Deve lançar erro se houver conflito de horário com outra reserva", async () => {
      mockRepository.findById.mockResolvedValue({ id: 1, userId: "1", roomId: 2 });
      
      mockRepository.findConflictingBooking.mockResolvedValue({ id: 99 }); 

      await expect(
        useCase.execute("1", "1", { 
          startTime: amanha.toISOString(), 
          endTime: depoisDeAmanha.toISOString(),
          roomId: 2
        })
      ).rejects.toThrow("Conflito de horário: Esta sala já está ocupada neste período.");
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