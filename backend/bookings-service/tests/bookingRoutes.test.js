const request = require("supertest");
const express = require("express");
const bookingRoutes = require("../src/presentation/routes/bookingRoutes");

describe("Unitário: Rotas de Booking", () => {
  it("Deve configurar os endpoints e chamar os métodos do Controller", async () => {

    const mockController = {
      create: jest.fn((req, res) => res.status(201).send()),
      edit: jest.fn((req, res) => res.status(200).send()),
      delete: jest.fn((req, res) => res.status(204).send()),
      list: jest.fn((req, res) => res.status(200).send())
    };

    const app = express();
    app.use(express.json());

    app.use(bookingRoutes(mockController));

    await request(app).post("/bookings").send({});
    expect(mockController.create).toHaveBeenCalled();

    await request(app).put("/bookings/1").send({});
    expect(mockController.edit).toHaveBeenCalled();

    await request(app).delete("/bookings/1");
    expect(mockController.delete).toHaveBeenCalled();
  });
});