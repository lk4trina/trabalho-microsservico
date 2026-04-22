class BookingController {
  constructor(createBooking, editBooking, cancelBooking, listUserBookings) {
    this.createBooking = createBooking;
    this.editBooking = editBooking;
    this.cancelBooking = cancelBooking;
    this.listUserBookings = listUserBookings;
  }

  create = async (req, res) => {
    try {
      const userId = Number(req.headers['x-user-id']); 
      const booking = await this.createBooking.execute({ ...req.body, userId });
      return res.status(201).json(booking);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  edit = async (req, res) => {
    try {
      const userId = Number(req.headers['x-user-id']);
      const booking = await this.editBooking.execute(req.params.id, userId, req.body);
      return res.json(booking);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  cancel = async (req, res) => {
    try {
      const userId = Number(req.headers['x-user-id']);
      const booking = await this.cancelBooking.execute(req.params.id, userId);
      return res.json(booking);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };


  list = async (req, res) => {
    try {
      const userId = Number(req.headers['x-user-id']);
      const bookings = await this.listUserBookings.execute(userId);
      return res.json(bookings);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };;
}

module.exports = BookingController;