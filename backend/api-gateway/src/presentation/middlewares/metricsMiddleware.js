const client = require('prom-client');

// Registra as métricas padrão do Node.js
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Define o contador de requisições
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requisicoes HTTP',
  labelNames: ['method', 'route', 'status']
});

const metricsMiddleware = (req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode
    });
  });
  next();
};

const metricsEndpoint = async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
};

module.exports = { metricsMiddleware, metricsEndpoint };