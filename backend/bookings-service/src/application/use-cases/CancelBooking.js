class CancelBooking {
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async execute(id, userId) {

    const booking = await this.bookingRepository.findById(id);

    if (!booking) {
      throw new Error('Reserva não encontrada');
    }

   
    if (booking.userId !== userId) {
      throw new Error('Você não tem permissão para cancelar esta reserva');
    }


    if (booking.status === 'CANCELLED') {
      throw new Error('Esta reserva já está cancelada');
    }

 
    booking.status = 'CANCELLED';
    

    return await this.bookingRepository.update(booking);
  }
}

module.exports = CancelBooking;