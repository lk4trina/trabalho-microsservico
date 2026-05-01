const RegisterUser = require("../src/application/use-cases/RegisterUser");

describe("RegisterUser Use Case", () => {
  let userRepositoryMock;
  let passwordHasherMock;
  let registerUser;

  beforeEach(() => {
    userRepositoryMock = {
      findByUsername: jest.fn(),
      create: jest.fn(),
    };

    passwordHasherMock = {
      hash: jest.fn(),
    };

    registerUser = new RegisterUser(userRepositoryMock, passwordHasherMock);
  });

  test("deve registrar usuário com sucesso", async () => {
    userRepositoryMock.findByUsername.mockResolvedValue(null);
    passwordHasherMock.hash.mockResolvedValue("senha-hash");

    userRepositoryMock.create.mockResolvedValue({
      id: 1,
      username: "teste",
      password: "senha-hash",
      role: "USER",
    });

    const result = await registerUser.execute({
      username: "teste",
      password: "123456",
      role: "USER",
    });

    expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith("teste");
    expect(passwordHasherMock.hash).toHaveBeenCalledWith("123456");
    expect(userRepositoryMock.create).toHaveBeenCalledWith({
      username: "teste",
      password: "senha-hash",
      role: "USER",
    });

    expect(result.username).toBe("teste");
    expect(result.role).toBe("USER");
  });

  test("deve impedir usuário duplicado", async () => {
    userRepositoryMock.findByUsername.mockResolvedValue({
      username: "teste",
    });

    await expect(
      registerUser.execute({
        username: "teste",
        password: "123456",
        role: "USER",
      }),
    ).rejects.toThrow();
  });
});
