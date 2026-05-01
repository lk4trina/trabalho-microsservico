const ValidateToken = require('../src/application/use-cases/ValidateToken');

describe('ValidateToken Use Case', () => {
  test('deve validar token corretamente', () => {
    const jwtServiceMock = {
      verify: jest.fn().mockReturnValue({
        id: 1,
        username: 'teste',
        role: 'USER'
      })
    };

    const validateToken = new ValidateToken(jwtServiceMock);

    const result = validateToken.execute('token-fake');

    expect(jwtServiceMock.verify).toHaveBeenCalledWith('token-fake');
    expect(result.username).toBe('teste');
    expect(result.role).toBe('USER');
  });
});