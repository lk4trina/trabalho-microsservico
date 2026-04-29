class DeleteBooking {
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async execute(id, userId, userRole) {
    const booking = await this.bookingRepository.findById(id);

    if (!booking) {
      throw new Error('Reserva não encontrada');
    }

    if (userRole !== 'ADMIN' && booking.userId !== userId) {
      throw new Error('Você não tem permissão para excluir esta reserva');
    }

    return await this.bookingRepository.delete(id);
  }
}

module.exports = DeleteBooking;