const AuthController = require("../src/presentation/controllers/AuthController");

describe("AuthController", () => {
  test("deve registrar usuário com sucesso", async () => {
    const registerUser = {
      execute: jest.fn().mockResolvedValue({
        username: "leticia",
        role: "admin"
      })
    };

    const loginUser = {};
    const controller = new AuthController(registerUser, loginUser);

    const req = {
      body: {
        username: "leticia",
        password: "123456",
        role: "admin"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await controller.register(req, res);

    expect(registerUser.execute).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      username: "leticia",
      role: "admin",
      message: "Usuário criado com sucesso"
    });
  });

  test("deve retornar erro ao falhar registro", async () => {
    const registerUser = {
      execute: jest.fn().mockRejectedValue(new Error("Usuário já existe"))
    };

    const loginUser = {};
    const controller = new AuthController(registerUser, loginUser);

    const req = { body: { username: "leticia" } };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await controller.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Usuário já existe" });
  });

  test("deve fazer login com sucesso", async () => {
    const registerUser = {};
    const loginUser = {
      execute: jest.fn().mockResolvedValue({
        token: "token-teste",
        user: { id: 1, username: "leticia" }
      })
    };

    const controller = new AuthController(registerUser, loginUser);

    const req = {
      body: {
        username: "leticia",
        password: "123456"
      }
    };

    const res = {
      json: jest.fn()
    };

    await controller.login(req, res);

    expect(loginUser.execute).toHaveBeenCalledWith(req.body);
    expect(res.json).toHaveBeenCalledWith({
      token: "token-teste",
      user: { id: 1, username: "leticia" }
    });
  });

  test("deve retornar erro ao falhar login", async () => {
    const registerUser = {};
    const loginUser = {
      execute: jest.fn().mockRejectedValue(new Error("Credenciais inválidas"))
    };

    const controller = new AuthController(registerUser, loginUser);

    const req = {
      body: {
        username: "leticia",
        password: "errada"
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await controller.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Credenciais inválidas" });
  });
});