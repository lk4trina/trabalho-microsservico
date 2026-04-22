class GetAggregatedUserBookings {
  constructor(apiGatewayProxy) {
    this.apiGatewayProxy = apiGatewayProxy;
  }

  async execute(token) {

    const [bookings, rooms] = await Promise.all([
      this.apiGatewayProxy.getUserBookings(token),
      this.apiGatewayProxy.getRooms(token)
    ]);

    const roomsMap = rooms.reduce((acc, room) => {
      acc[room.id] = room;
      return acc;
    }, {});

    const aggregatedBookings = bookings.map(booking => {
      const room = roomsMap[booking.roomId];
      
      return {
        id: booking.id,
        roomId: booking.roomId,
        roomName: room ? room.name : 'Sala Desconhecida',
        roomCapacity: room ? room.capacity : '-',
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status
      };
    });

    return aggregatedBookings;
  }
}

module.exports = GetAggregatedUserBookings;