const JwtService = require("../src/infrastructure/security/JWTService");

describe("JwtService", () => {
  const service = new JwtService("test-secret");

  test("deve gerar e validar token", () => {
    const token = service.sign({ id: 1, role: "admin" });
    const decoded = service.verify(token);

    expect(decoded.id).toBe(1);
    expect(decoded.role).toBe("admin");
  });

  test("deve lançar erro para token inválido", () => {
    expect(() => service.verify("token-invalido")).toThrow();
  });
});