const express = require('express');

module.exports = (bookingsGatewayController, authMiddleware) => {
  const router = express.Router();


  router.post('/bookings', authMiddleware, bookingsGatewayController.create);
  router.get('/bookings/my', authMiddleware, bookingsGatewayController.listUserBookings);
  router.put('/bookings/:id', authMiddleware, bookingsGatewayController.edit);
  router.patch('/bookings/:id/cancel', authMiddleware, bookingsGatewayController.cancel);

  return router;
};