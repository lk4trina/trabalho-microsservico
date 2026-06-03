 const authMiddlewareFactory = require("../src/presentation/middlewares/authMiddleware");

describe("authMiddleware", () => {
  test("deve negar quando não houver token", async () => {
    const validateToken = { execute: jest.fn() };
    const middleware = authMiddlewareFactory(validateToken);

    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("deve aceitar token válido", async () => {
    const validateToken = {
      execute: jest.fn().mockReturnValue({ id: 1, role: "admin" })
    };

    const middleware = authMiddlewareFactory(validateToken);

    const req = {
      headers: {
        authorization: "Bearer token-valido"
      }
    };
    const res = {};
    const next = jest.fn();

    await middleware(req, res, next);

    expect(req.user.id).toBe(1);
    expect(req.user.role).toBe("admin");
    expect(next).toHaveBeenCalled();
  });

  test("deve negar token inválido", async () => {
    const validateToken = {
      execute: jest.fn(() => {
        throw new Error("Token inválido");
      })
    };

    const middleware = authMiddlewareFactory(validateToken);

    const req = {
      headers: {
        authorization: "Bearer token-ruim"
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});