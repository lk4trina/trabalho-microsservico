const CreateRoom = require('../src/application/use-cases/CreateRoom');

describe('CreateRoom', () => {
  let roomRepositoryMock;
  let createRoom;

  beforeEach(() => {
    roomRepositoryMock = {
      create: jest.fn()
    };

    createRoom = new CreateRoom(roomRepositoryMock);
  });

  test('deve criar sala com sucesso', async () => {
    roomRepositoryMock.create.mockResolvedValue({
      id: 1,
      name: 'Sala 1',
      capacity: 10,
      active: true
    });

    const result = await createRoom.execute({
      name: 'Sala 1',
      capacity: 10
    });

    expect(roomRepositoryMock.create).toHaveBeenCalled();

    expect(result.name).toBe('Sala 1');
    expect(result.capacity).toBe(10);
  });
});