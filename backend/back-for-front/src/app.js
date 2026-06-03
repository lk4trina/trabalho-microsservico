const express = require('express');
const cors = require('cors');
const ApiGatewayProxy = require('./infrastructure/http/ApiGatewayProxy');
const GetAggregatedUserBookings = require('./application/use-cases/GetAggregatedUserBookings');
const BffController = require('./presentation/controllers/BffController');
const bffRoutes = require('./presentation/routes/bffRoutes');

const app = express();

app.use(express.json());
app.use(cors());

const apiGatewayProxy = new ApiGatewayProxy(
  process.env.API_GATEWAY_URL || 'http://api_gateway:3000'
);

const getAggregatedUserBookings = new GetAggregatedUserBookings(apiGatewayProxy);
const bffController = new BffController(getAggregatedUserBookings);

app.get('/', (req, res) => {
  res.send('BFF rodando');
});

app.use(bffRoutes(bffController));

module.exports = app;