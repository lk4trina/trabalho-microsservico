class BookingsGatewayController {
  constructor(bookingsProxy) {
    this.bookingsProxy = bookingsProxy;
  }

create = async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const booking = await this.bookingsProxy.createBooking(req.body, userId, userRole);
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao criar reserva no gateway' });
    }
  };

  listUserBookings = async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role; 
      const bookings = await this.bookingsProxy.getUserBookings(userId, userRole);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar reservas no gateway' });
    }
  };

edit = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;
      const booking = await this.bookingsProxy.editBooking(id, req.body, userId, userRole);
      res.json(booking);
    } catch (error) {
      const msg = error.response && error.response.data ? error.response.data.error : error.message;
      res.status(400).json({ error: msg });
    }
  };


  delete = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role; 
      
      await this.bookingsProxy.deleteBooking(id, userId, userRole);
      res.status(204).send(); 
    } catch (error) {
      res.status(400).json({ error: 'Erro ao excluir reserva no gateway' });
    }
  };
}

module.exports = BookingsGatewayController;