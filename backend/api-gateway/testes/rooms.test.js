const request = require("supertest");
const app = require("../src/app");

let token;

describe("Rooms - API Gateway", () => {
  it("deve registrar usuário", async () => {
    const res = await request(app).post("/register").send({
      username: "teste_api",
      password: "123456",
      role: "ADMIN",
    });

    expect(res.statusCode).toBe(201);
  });

  it("deve fazer login e gerar token", async () => {
    const res = await request(app).post("/login").send({
      username: "teste_api",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    token = res.body.token;
    expect(token).toBeDefined();
  });

  it("deve criar sala", async () => {
    const res = await request(app)
      .post("/rooms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Sala Teste",
        capacity: 10,
      });

    expect(res.statusCode).toBe(201);
  });

  it("deve listar salas", async () => {
    const res = await request(app)
      .get("/rooms")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
