class BookingsGatewayController {
  constructor(bookingsProxy) {
    this.bookingsProxy = bookingsProxy;
  }

  create = async (req, res) => {
    try {
      
      const userId = req.user.id || req.user.username; 
      
      const booking = await this.bookingsProxy.createBooking(req.body, userId);
      return res.status(201).json(booking);
    } catch (error) {
      console.error(error);
    
      const errorMsg = error.response?.data?.error || 'Erro ao criar reserva';
      return res.status(error.response?.status || 500).json({ error: errorMsg });
    }
  };

  listUserBookings = async (req, res) => {
    try {
      const userId = req.user.id || req.user.username;
      const bookings = await this.bookingsProxy.getUserBookings(userId);
      return res.json(bookings);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || 'Erro ao buscar reservas';
      return res.status(error.response?.status || 500).json({ error: errorMsg });
    }
  };

  edit = async (req, res) => {
    try {
      const userId = req.user.id || req.user.username;
      const booking = await this.bookingsProxy.editBooking(req.params.id, req.body, userId);
      return res.json(booking);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || 'Erro ao editar reserva';
      return res.status(error.response?.status || 500).json({ error: errorMsg });
    }
  };

  cancel = async (req, res) => {
    try {
      const userId = req.user.id || req.user.username;
      const booking = await this.bookingsProxy.cancelBooking(req.params.id, userId);
      return res.json(booking);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || 'Erro ao cancelar reserva';
      return res.status(error.response?.status || 500).json({ error: errorMsg });
    }
  };
}

module.exports = BookingsGatewayController;