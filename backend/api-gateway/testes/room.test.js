const request = require("supertest");
const app = require("../src/app");

let token;

describe("Rooms - API Gateway", () => {
  beforeAll(async () => {
    const res = await request(app).post("/auth/login").send({
      username: "teste_jest",
      password: "123456",
    });

    token = res.body.token;
  });

  it("deve criar sala", async () => {
    const res = await request(app)
      .post("/rooms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Sala Teste Jest",
        capacity: 5,
      });

    expect(res.statusCode).toBe(200);
  });

  it("deve listar salas", async () => {
    const res = await request(app)
      .get("/rooms")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
