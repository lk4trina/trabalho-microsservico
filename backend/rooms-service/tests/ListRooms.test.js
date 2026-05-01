const ListRooms = require("../src/application/use-cases/ListAllRooms");

describe("ListRooms", () => {
  let roomRepositoryMock;
  let listRooms;

  beforeEach(() => {
    roomRepositoryMock = {
      findAll: jest.fn(),
    };

    listRooms = new ListRooms(roomRepositoryMock);
  });

  test("deve listar salas", async () => {
    roomRepositoryMock.findAll.mockResolvedValue([
      { id: 1, name: "Sala A", capacity: 10 },
      { id: 2, name: "Sala B", capacity: 20 },
    ]);

    const result = await listRooms.execute();

    expect(roomRepositoryMock.findAll).toHaveBeenCalled();
    expect(result.length).toBe(2);
  });
});
