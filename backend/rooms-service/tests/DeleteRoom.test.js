const DeleteRoom = require("../src/application/use-cases/DeleteRoom");

describe("DeleteRoom", () => {
  let roomRepositoryMock;
  let deleteRoom;

  beforeEach(() => {
    roomRepositoryMock = {
      findById: jest.fn(),
    };

    deleteRoom = new DeleteRoom(roomRepositoryMock);
  });

  test("deve excluir sala com sucesso", async () => {
    const roomMock = {
      id: 1,
      name: "Sala A",
      destroy: jest.fn().mockResolvedValue(true),
    };

    roomRepositoryMock.findById.mockResolvedValue(roomMock);

    const result = await deleteRoom.execute(1);

    expect(roomRepositoryMock.findById).toHaveBeenCalledWith(1);

    expect(roomMock.destroy).toHaveBeenCalled();

    expect(result.message).toBe("Sala removida com sucesso");
  });
});
