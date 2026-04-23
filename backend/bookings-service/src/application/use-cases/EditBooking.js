class EditBooking {
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async execute(id, userId, { startTime, endTime }) {
    const booking = await this.bookingRepository.findById(id);

    
    if (!booking) throw new Error('Reserva não encontrada.');
    if (booking.userId !== userId) throw new Error('Sem permissão para editar esta reserva.');
    if (booking.status === 'CANCELLED') throw new Error('Não é possível editar uma reserva cancelada.');

    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start < now) {
      throw new Error('Não é possível alterar a reserva para uma data no passado.');
    }
    
    if (start >= end) {
      throw new Error('A data de início deve ser anterior à data de término.');
    }

    
    const conflict = await this.bookingRepository.findConflictingBooking(
      booking.roomId, startTime, endTime, booking.id
    );

    if (conflict) throw new Error('Conflito de horário ao editar.');

   
    booking.startTime = start;
    booking.endTime = end;

    return await this.bookingRepository.update(booking);
  }
}
module.exports = EditBooking;