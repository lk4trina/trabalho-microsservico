const request = require("supertest");
const express = require("express");
const CreateBooking = require("../src/application/use-cases/CreateBooking");
const BookingController = require("../src/presentation/controllers/BookingController");

const amanha = new Date();
amanha.setDate(amanha.getDate() + 1);
const amanhaStr = amanha.toISOString();
const depoisDeAmanha = new Date();
depoisDeAmanha.setDate(depoisDeAmanha.getDate() + 2);
const depoisDeAmanhaStr = depoisDeAmanha.toISOString();

describe("CreateBooking - Conjunto Completo", () => {
  let mockBookingRepository;
  let createBookingUseCase;
  let bookingController;
  let app;

  beforeEach(() => {
    mockBookingRepository = {
      findConflictingBooking: jest.fn(),
      create: jest.fn(),
    };

    createBookingUseCase = new CreateBooking(mockBookingRepository);
    bookingController = new BookingController(createBookingUseCase, {}, {}, {});

    app = express();
    app.use(express.json());
    app.post("/bookings", bookingController.create);
  });

  describe("Unitário: Use Case", () => {
    it("Deve criar uma reserva com sucesso se não houver conflito", async () => {
      mockBookingRepository.findConflictingBooking.mockResolvedValue(null);
      mockBookingRepository.create.mockResolvedValue({ id: 1, roomId: 1, status: "ACTIVE" });
      
      const result = await createBookingUseCase.execute(
        { roomId: 1, userId: 1, startTime: amanhaStr, endTime: depoisDeAmanhaStr },
        "USER"
      );

      expect(result).toHaveProperty("id");
    });
  });

  describe("Unitário: Controller", () => {
    let req, res;
    beforeEach(() => {
      req = { headers: { "x-user-id": "1", "x-user-role": "USER" }, body: {} };
      res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    });

    it("Deve retornar 400 se o Create falhar (Branch do CATCH)", async () => {
      jest.spyOn(createBookingUseCase, "execute").mockRejectedValue(new Error("Erro de validação"));      
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