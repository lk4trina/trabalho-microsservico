const roleMiddlewareFactory = require("../src/presentation/middlewares/roleMiddleware");

describe("roleMiddleware", () => {
  test("deve permitir admin", () => {
    const roleMiddleware = roleMiddlewareFactory("admin");

    const req = { user: { role: "admin" } };
    const res = {};
    const next = jest.fn();

    roleMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("deve bloquear usuário comum", () => {
    const roleMiddleware = roleMiddlewareFactory("admin");

    const req = { user: { role: "user" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    roleMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Permissão insuficiente" });
    expect(next).not.toHaveBeenCalled();
  });

  test("deve bloquear quando não houver usuário", () => {
    const roleMiddleware = roleMiddlewareFactory("admin");

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    roleMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Acesso negado" });
    expect(next).not.toHaveBeenCalled();
  });
});