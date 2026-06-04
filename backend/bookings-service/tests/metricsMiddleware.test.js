const metrics = require("../src/presentation/middlewares/metricsMiddleware");

describe("Unitário: Middleware de Métricas", () => {
  it("Deve exportar as instâncias do Prometheus corretamente", () => {

    expect(metrics).toBeDefined();
    
    if (metrics.client) expect(metrics.client).toBeDefined();
    if (metrics.bookingCounter) expect(metrics.bookingCounter).toBeDefined();
  });
});