const request = require("supertest");
const app = require("../src/app");

describe("Rooms Service", () => {
  it("deve criar sala diretamente", async () => {
    const res = await request(app).post("/rooms").send({
      name: "Sala Service",
      capacity: 10,
    });

    expect(res.statusCode).toBe(200);
  });

  it("deve listar salas", async () => {
    const res = await request(app).get("/rooms");

    expect(res.statusCode).toBe(200);
  });
});
