const Booking = require('../../domain/entities/Booking');

class CreateBooking {
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async execute(data) {
    
    const booking = new Booking(data);
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    const now = new Date();

   
    if (start < now) {
      throw new Error('Não é possível criar uma reserva com data no passado.');
    }
    
    if (start >= end) {
      throw new Error('A data de início deve ser anterior à data de término.');
    }

    
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