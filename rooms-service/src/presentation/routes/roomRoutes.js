const express = require('express');

module.exports = (roomController) => {
  const router = express.Router();

  router.post('/rooms', roomController.create);
  router.get('/rooms', roomController.list);
  router.patch('/rooms/:id/toggle', roomController.toggleStatus);

  return router;
};