const client = require('prom-client');

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const bookingCounter = new client.Counter({
  name: 'bookings_created_total',
  help: 'Total de reservas criadas com sucesso',
});

module.exports = { client, bookingCounter };