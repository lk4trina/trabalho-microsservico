const ToggleRoomStatus = require("../src/application/use-cases/ToggleRoomStatus");

describe("ToggleRoomStatus", () => {
  let roomRepositoryMock;
  let toggleRoomStatus;

  beforeEach(() => {
    roomRepositoryMock = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    toggleRoomStatus = new ToggleRoomStatus(roomRepositoryMock);
  });

  test("deve ativar/desativar sala", async () => {
    roomRepositoryMock.findById.mockResolvedValue({
      id: 1,
      name: "Sala A",
      capacity: 10,
      active: true,
    });

    roomRepositoryMock.update.mockResolvedValue({
      id: 1,
      name: "Sala A",
      capacity: 10,
      active: false,
    });

    const result = await toggleRoomStatus.execute(1);

    expect(roomRepositoryMock.findById).toHaveBeenCalledWith(1);
    expect(roomRepositoryMock.update).toHaveBeenCalled();
    expect(result.active).toBe(false);
  });
});
