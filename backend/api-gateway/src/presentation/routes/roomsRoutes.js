const express = require('express');

module.exports = (roomsGatewayController, authMiddleware, roleMiddleware) => {
  const router = express.Router();

  router.get('/rooms', authMiddleware, roomsGatewayController.list);
  router.post('/rooms', authMiddleware, roleMiddleware('ADMIN'), roomsGatewayController.create);
  router.patch('/rooms/:id/toggle', authMiddleware, roleMiddleware('ADMIN'), roomsGatewayController.toggle);

  return router;
};