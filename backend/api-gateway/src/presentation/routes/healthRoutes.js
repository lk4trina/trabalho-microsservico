const express = require("express");

module.exports = function () {
  const router = express.Router();

  router.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok"
    });
  });

  router.get("/health/details", (req, res) => {
    res.status(200).json({
      status: "ok",
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || "1.1.0"
    });
  });

  return router;
};