const Booking = require('../../domain/entities/Booking');

class CreateBooking {
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async execute(data) {
    const booking = new Booking(data);

    const conflict = await this.bookingRepository.findConflictingBooking(
      booking.roomId, booking.startTime, booking.endTime
    );

    if (conflict) {
      throw new Error('Conflito de horário: A sala já está reservada neste período.');
    }

    return await this.bookingRepository.create({
      roomId: booking.roomId,
      userId: booking.userId,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status
    });
  }
}
module.exports = CreateBooking;