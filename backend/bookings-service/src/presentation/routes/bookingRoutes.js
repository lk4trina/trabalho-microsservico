const express = require('express');

module.exports = (bookingController) => {
  const router = express.Router();

  router.post('/bookings', bookingController.create);
  router.get('/bookings/my', bookingController.list);
  router.put('/bookings/:id', bookingController.edit);
  router.patch('/bookings/:id/cancel', bookingController.cancel);

  return router;
};