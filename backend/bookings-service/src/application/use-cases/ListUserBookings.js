class ListUserBookings {
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository;
  }

async execute(userId, userRole) {

    if (userRole === 'ADMIN') {
      return await this.bookingRepository.findAll();
    }
 
    return await this.bookingRepository.findByUserId(userId);
  }
}
module.exports = ListUserBookings;