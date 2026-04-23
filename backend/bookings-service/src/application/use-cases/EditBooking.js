class EditBooking {
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async execute(id, userId, { startTime, endTime }) {
    const booking = await this.bookingRepository.findById(id);

    if (!booking) throw new Error('Reserva não encontrada.');
    if (booking.userId !== userId) throw new Error('Sem permissão para editar esta reserva.');
    
    if (booking.status === 'CANCELLED') throw new Error('Não é possível editar uma reserva cancelada.');

    const conflict = await this.bookingRepository.findConflictingBooking(
      booking.roomId, startTime, endTime, booking.id
    );

    if (conflict) throw new Error('Conflito de horário ao editar.');

    booking.startTime = new Date(startTime);
    booking.endTime = new Date(endTime);

    return await this.bookingRepository.update(booking);
  }
}
module.exports = EditBooking;