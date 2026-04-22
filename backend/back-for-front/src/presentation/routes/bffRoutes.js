const express = require('express');

module.exports = (bffController) => {
  const router = express.Router();

  router.get('/dashboard/my-bookings', bffController.getDashboardData);

  return router;
};