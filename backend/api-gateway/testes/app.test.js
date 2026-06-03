const request = require("supertest");

jest.mock("../src/infrastructure/database/sequelize", () => ({
  authenticate: jest.fn().mockResolvedValue(),
  sync: jest.fn().mockResolvedValue()
}));

jest.mock("../src/infrastructure/repositories/SqlUserRepository", () => {
  return jest.fn().mockImplementation(() => ({}));
});

describe("API Gateway app", () => {
  let app;

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
    app = require("../src/app");
  });

  test("GET / deve retornar mensagem do API Gateway", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("API Gateway rodando");
  });

  test("GET /metrics deve retornar métricas", async () => {
    const response = await request(app).get("/metrics");

    expect(response.status).toBe(200);
    expect(response.text).toContain("http");
  });
});