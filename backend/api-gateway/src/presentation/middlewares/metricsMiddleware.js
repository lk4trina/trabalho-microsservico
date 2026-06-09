const client = require("prom-client");

client.collectDefaultMetrics();

// Contador de requisições HTTP da aplicação
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total de requisicoes HTTP",
  labelNames: ["method", "route", "status", "status_group"],
});

function getStatusGroup(statusCode) {
  if (statusCode >= 200 && statusCode < 300) return "2xx";
  if (statusCode >= 300 && statusCode < 400) return "3xx";
  if (statusCode >= 400 && statusCode < 500) return "4xx";
  if (statusCode >= 500) return "5xx";
  return "unknown";
}

function getRoute(req) {
  if (req.route && req.route.path) {
    return req.route.path;
  }

  if (req.baseUrl) {
    return req.baseUrl;
  }

  return req.path;
}

const metricsMiddleware = (req, res, next) => {
  const ignoredRoutes = ["/metrics", "/favicon.ico"];

  res.on("finish", () => {
    const route = getRoute(req);

    if (ignoredRoutes.includes(route)) {
      return;
    }

    httpRequestCounter.inc({
      method: req.method,
      route,
      status: String(res.statusCode),
      status_group: getStatusGroup(res.statusCode),
    });
  });

  next();
};

const metricsEndpoint = async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
};

module.exports = {
  metricsMiddleware,
  metricsEndpoint,
};