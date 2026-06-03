const PasswordHasher = require("../src/infrastructure/security/PasswordHasher");

describe("PasswordHasher", () => {
  const hasher = new PasswordHasher();

  test("deve gerar hash e comparar senha correta", async () => {
    const hash = await hasher.hash("123456");
    const result = await hasher.compare("123456", hash);

    expect(result).toBe(true);
  });

  test("deve retornar false para senha incorreta", async () => {
    const hash = await hasher.hash("123456");
    const result = await hasher.compare("errada", hash);

    expect(result).toBe(false);
  });
}); 