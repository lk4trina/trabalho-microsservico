const axios = require("axios");
const RoomsProxy = require("../src/infrastructure/http/RoomsProxy");

jest.mock("axios");

describe("RoomsProxy", () => {
  let proxy;
  let client;

  beforeEach(() => {
    client = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn()
    };

    axios.create.mockReturnValue(client);
    proxy = new RoomsProxy("http://rooms-test");
  });

  test("deve listar salas", async () => {
    client.get.mockResolvedValue({ data: [{ id: 1 }] });

    const result = await proxy.getRooms("Bearer token");

    expect(client.get).toHaveBeenCalledWith("/rooms", {
      headers: {
        Authorization: "Bearer token"
      }
    });

    expect(result).toEqual([{ id: 1 }]);
  });

  test("deve criar sala", async () => {
    client.post.mockResolvedValue({ data: { id: 1 } });

    const result = await proxy.createRoom(
      { name: "Sala 1" },
      "Bearer token"
    );

    expect(client.post).toHaveBeenCalledWith(
      "/rooms",
      { name: "Sala 1" },
      {
        headers: {
          Authorization: "Bearer token"
        }
      }
    );

    expect(result).toEqual({ id: 1 });
  });

  test("deve atualizar sala", async () => {
    client.put.mockResolvedValue({ data: { id: 1, name: "Nova" } });

    const result = await proxy.updateRoom(
      1,
      { name: "Nova" },
      "Bearer token"
    );

    expect(client.put).toHaveBeenCalledWith(
      "/rooms/1",
      { name: "Nova" },
      {
        headers: {
          Authorization: "Bearer token"
        }
      }
    );

    expect(result).toEqual({ id: 1, name: "Nova" });
  });

  test("deve deletar sala", async () => {
    client.delete.mockResolvedValue({ data: { success: true } });

    const result = await proxy.deleteRoom(1, "Bearer token");

    expect(client.delete).toHaveBeenCalledWith("/rooms/1", {
      headers: {
        Authorization: "Bearer token"
      }
    });

    expect(result).toEqual({ success: true });
  });

  test("deve alternar status da sala", async () => {
    client.patch.mockResolvedValue({ data: { active: false } });

    const result = await proxy.toggleRoom(1, "Bearer token");

    expect(client.patch).toHaveBeenCalledWith(
      "/rooms/1/toggle",
      {},
      {
        headers: {
          Authorization: "Bearer token"
        }
      }
    );

    expect(result).toEqual({ active: false });
  });
});