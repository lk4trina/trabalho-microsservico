class BookingController {
  constructor(createBooking, editBooking, deleteBooking, listUserBookings) {
    this.createBooking = createBooking;
    this.editBooking = editBooking;
    this.deleteBooking = deleteBooking; 
    this.listUserBookings = listUserBookings;
  }

create = async (req, res) => {
    try {
      const userId = Number(req.headers['x-user-id']); 
      const userRole = req.headers['x-user-role']; 
      
      const booking = await this.createBooking.execute({ ...req.body, userId }, userRole);
      
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

  delete = async (req, res) => {
    try {
      const userId = Number(req.headers['x-user-id']);
      const userRole = req.headers['x-user-role']; 
      
      await this.deleteBooking.execute(req.params.id, userId, userRole);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  list = async (req, res) => {
    try {
      const userId = Number(req.headers['x-user-id']);
      const userRole = req.headers['x-user-role']; 
      
      const bookings = await this.listUserBookings.execute(userId, userRole);
      return res.json(bookings);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
}

module.exports = BookingController;