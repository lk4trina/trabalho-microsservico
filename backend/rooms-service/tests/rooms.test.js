const request = require("supertest");
const app = require("../src/app");

let token;

// 🔥 token fake (mesmo segredo do JWT)
const jwt = require("jsonwebtoken");

beforeAll(() => {
  token = jwt.sign({ id: 1, role: "ADMIN" }, "segredo-super-seguro");
});

describe("Rooms Service", () => {
  it("deve criar sala", async () => {
    const res = await request(app)
      .post("/rooms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Sala Teste Service",
        capacity: 5,
      });

    expect(res.statusCode).toBe(201);
  });

  it("deve listar salas", async () => {
    const res = await request(app)
      .get("/rooms")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("deve alternar status da sala", async () => {
    const create = await request(app)
      .post("/rooms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Sala Toggle",
        capacity: 5,
      });

    const id = create.body.id;

    const res = await request(app)
      .patch(`/rooms/${id}/toggle`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});
