const express = require('express');

module.exports = (bookingsGatewayController, authMiddleware) => {
  const router = express.Router();


  router.post('/bookings', authMiddleware, bookingsGatewayController.create);
  router.get('/bookings/my', authMiddleware, bookingsGatewayController.listUserBookings);
  router.put('/bookings/:id', authMiddleware, bookingsGatewayController.edit);
  router.delete('/bookings/:id', authMiddleware, bookingsGatewayController.delete);

  return router;
};