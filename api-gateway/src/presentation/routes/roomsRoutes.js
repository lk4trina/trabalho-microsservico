const express = require('express');

module.exports = (roomsGatewayController, authMiddleware) => {
  const router = express.Router();

    router.get('/rooms', authMiddleware, roomsGatewayController.list);
    router.get('/rooms', authMiddleware, roomsGatewayController.list);
    router.post('/rooms', authMiddleware, roomsGatewayController.create);
    router.patch('/rooms/:id/toggle', authMiddleware, roomsGatewayController.toggle);

  return router;
};
