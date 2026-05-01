const UpdateRoom = require("../src/application/use-cases/UpdateRoom");

describe("UpdateRoom", () => {
  let roomRepositoryMock;
  let updateRoom;

  beforeEach(() => {
    roomRepositoryMock = {
      findById: jest.fn(),
    };

    updateRoom = new UpdateRoom(roomRepositoryMock);
  });

  test("deve atualizar sala com sucesso", async () => {
    const roomMock = {
      id: 1,
      name: "Sala Antiga",
      capacity: 10,
      active: true,
      save: jest.fn().mockResolvedValue(true),
    };

    roomRepositoryMock.findById.mockResolvedValue(roomMock);

    const result = await updateRoom.execute(1, {
      name: "Sala Atualizada",
      capacity: 25,
    });

    expect(roomRepositoryMock.findById).toHaveBeenCalledWith(1);

    expect(roomMock.name).toBe("Sala Atualizada");
    expect(roomMock.capacity).toBe(25);

    expect(roomMock.save).toHaveBeenCalled();

    expect(result.name).toBe("Sala Atualizada");
    expect(result.capacity).toBe(25);
  });
});
