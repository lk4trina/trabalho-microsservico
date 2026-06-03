const axios = require("axios");
const BookingsProxy = require("../src/infrastructure/http/BookingsProxy");

jest.mock("axios");

describe("BookingsProxy", () => {
  let proxy;
  let client;

  beforeEach(() => {
    client = {
      post: jest.fn(),
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };

    axios.create.mockReturnValue(client);
    proxy = new BookingsProxy("http://booking-test");
  });

  test("deve criar reserva", async () => {
    client.post.mockResolvedValue({ data: { id: 1 } });

    const result = await proxy.createBooking({ roomId: 1 }, 10, "user");

    expect(client.post).toHaveBeenCalledWith(
      "/bookings",
      { roomId: 1 },
      { headers: { "x-user-id": 10, "x-user-role": "user" } }
    );
    expect(result).toEqual({ id: 1 });
  });

  test("deve listar reservas do usuário", async () => {
    client.get.mockResolvedValue({ data: [{ id: 1 }] });

    const result = await proxy.getUserBookings(10, "user");

    expect(client.get).toHaveBeenCalledWith(
      "/bookings/my",
      { headers: { "x-user-id": 10, "x-user-role": "user" } }
    );
    expect(result).toEqual([{ id: 1 }]);
  });

  test("deve editar reserva", async () => {
    client.put.mockResolvedValue({ data: { id: 1, status: "editada" } });

    const result = await proxy.editBooking(1, { date: "2026-01-01" }, 10, "user");

    expect(client.put).toHaveBeenCalledWith(
      "/bookings/1",
      { date: "2026-01-01" },
      { headers: { "x-user-id": 10, "x-user-role": "user" } }
    );
    expect(result).toEqual({ id: 1, status: "editada" });
  });

  test("deve deletar reserva", async () => {
    client.delete.mockResolvedValue({ data: { success: true } });

    const result = await proxy.deleteBooking(1, 10, "user");

    expect(client.delete).toHaveBeenCalledWith(
      "/bookings/1",
      { headers: { "x-user-id": 10, "x-user-role": "user" } }
    );
    expect(result).toEqual({ success: true });
  });
});