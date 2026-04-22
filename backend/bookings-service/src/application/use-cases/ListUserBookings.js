class ListUserBookings {
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

  async execute(userId) {
    return await this.bookingRepository.findByUserId(userId);
  }
}
module.exports = ListUserBookings;