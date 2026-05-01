const LoginUser = require('../src/application/use-cases/LoginUser');

describe('LoginUser Use Case', () => {
  let userRepositoryMock;
  let passwordHasherMock;
  let jwtServiceMock;
  let loginUser;

  beforeEach(() => {
    userRepositoryMock = {
      findByUsername: jest.fn()
    };

    passwordHasherMock = {
      compare: jest.fn()
    };

    jwtServiceMock = {
      sign: jest.fn()
    };

    loginUser = new LoginUser(
      userRepositoryMock,
      passwordHasherMock,
      jwtServiceMock
    );
  });

  test('deve fazer login com sucesso', async () => {
    userRepositoryMock.findByUsername.mockResolvedValue({
      id: 1,
      username: 'teste',
      password: 'hash',
      role: 'USER'
    });

    passwordHasherMock.compare.mockResolvedValue(true);
    jwtServiceMock.sign.mockReturnValue('token-fake');

    const result = await loginUser.execute({
      username: 'teste',
      password: '123456'
    });

    expect(userRepositoryMock.findByUsername).toHaveBeenCalledWith('teste');
    expect(passwordHasherMock.compare).toHaveBeenCalledWith(
      '123456',
      'hash'
    );
    expect(jwtServiceMock.sign).toHaveBeenCalled();
    expect(result.token).toBe('token-fake');
  });

  test('deve falhar com senha inválida', async () => {
    userRepositoryMock.findByUsername.mockResolvedValue({
      username: 'teste',
      password: 'hash',
      role: 'USER'
    });

    passwordHasherMock.compare.mockResolvedValue(false);

    await expect(
      loginUser.execute({
        username: 'teste',
        password: 'errada'
      })
    ).rejects.toThrow('Senha inválida');
  });
});