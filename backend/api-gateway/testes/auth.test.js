const request = require("supertest");
const app = require("../src/app");

describe("Auth - API Gateway", () => {
  it("deve registrar usuário", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "teste_jest",
      password: "123456",
      role: "ADMIN",
    });

    expect(res.statusCode).toBe(200);
  });

  it("deve fazer login", async () => {
    const res = await request(app).post("/auth/login").send({
      username: "teste_jest",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
