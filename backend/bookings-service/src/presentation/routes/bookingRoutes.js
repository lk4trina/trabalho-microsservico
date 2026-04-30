const express = require('express');

module.exports = (bookingController) => {
  const router = express.Router();

  router.post('/bookings', bookingController.create);
  router.get('/bookings/my', bookingController.list);
  router.put('/bookings/:id', bookingController.edit);
  router.delete('/bookings/:id', bookingController.delete);

  return router;
};