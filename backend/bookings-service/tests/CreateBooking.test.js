const request = require("supertest");
const express = require("express");
const CreateBooking = require("../src/application/use-cases/CreateBooking");
const BookingController = require("../src/presentation/controllers/BookingController");

// Setup de Datas Dinâmicas
const amanha = new Date();
amanha.setDate(amanha.getDate() + 1);
const amanhaStr = amanha.toISOString();

const depoisDeAmanha = new Date();
depoisDeAmanha.setDate(depoisDeAmanha.getDate() + 2);
const depoisDeAmanhaStr = depoisDeAmanha.toISOString();

// Mocks
const mockBookingRepository = {
  findConflictingBooking: jest.fn(),
  create: jest.fn(),
};

const createBookingUseCase = new CreateBooking(mockBookingRepository);
const bookingController = new BookingController(createBookingUseCase, {}, {}, {});

const app = express();
app.use(express.json());
app.post("/bookings", bookingController.create);

describe("CreateBooking", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Unitário: Use Case", () => {
    it("Deve criar uma reserva com sucesso se não houver conflito", async () => {
      mockBookingRepository.findConflictingBooking.mockResolvedValue(null);
      mockBookingRepository.create.mockResolvedValue({
        id: 1,
        roomId: 1,
        status: "ACTIVE",
      });

      const result = await createBookingUseCase.execute(
        { roomId: 1, userId: 1, startTime: amanhaStr, endTime: depoisDeAmanhaStr },
        "USER"
      );

      expect(result).toHaveProperty("id");
      expect(mockBookingRepository.findConflictingBooking).toHaveBeenCalledTimes(1);
      expect(mockBookingRepository.create).toHaveBeenCalledTimes(1);
    });

    it("Deve lançar erro ao tentar criar reserva no passado", async () => {
      const ontem = new Date();
      ontem.setDate(ontem.getDate() - 1);

      await expect(
        createBookingUseCase.execute(
          { roomId: 1, userId: 1, startTime: ontem.toISOString(), endTime: amanhaStr },
          "USER"
        )
      ).rejects.toThrow("Não é possível criar uma reserva com data no passado.");
    });

    it("Deve lançar erro de conflito de horário", async () => {
      mockBookingRepository.findConflictingBooking.mockResolvedValue({ id: 99 });

      await expect(
        createBookingUseCase.execute(
          { roomId: 1, userId: 1, startTime: amanhaStr, endTime: depoisDeAmanhaStr },
          "USER"
        )
      ).rejects.toThrow("Conflito de horário: A sala já está reservada neste período.");
    });
  });

  describe("Unitário: Controller", () => {
    it("Deve retornar 400 se o Create falhar (Branch do CATCH)", async () => {
      const spy = jest
        .spyOn(createBookingUseCase, "execute")
        .mockRejectedValue(new Error("Erro de validação"));
      await bookingController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("Integração: POST /bookings", () => {
    it("Deve retornar status 201 ao criar reserva via API", async () => {
      mockBookingRepository.findConflictingBooking.mockResolvedValue(null);
      mockBookingRepository.create.mockResolvedValue({ id: 2, status: "ACTIVE" });

      const response = await request(app)
        .post("/bookings")
        .set("x-user-id", "1")
        .set("x-user-role", "USER")
        .send({ roomId: 1, startTime: amanhaStr, endTime: depoisDeAmanhaStr});

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id", 2);
    });
  });
});