const express = require("express");
const client = require('prom-client');
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Middlewares
const { metricsMiddleware } = require("./presentation/middlewares/metricsMiddleware");
const roleMiddleware = require("./presentation/middlewares/roleMiddleware");
const authMiddlewareFactory = require("./presentation/middlewares/authMiddleware");

// Infraestrutura e Dependências
const SqlUserRepository = require("./infrastructure/repositories/SqlUserRepository");
const PasswordHasher = require("./infrastructure/security/PasswordHasher");
const JwtService = require("./infrastructure/security/JWTService");
const RoomsProxy = require("./infrastructure/http/RoomsProxy");
const BookingsProxy = require("./infrastructure/http/BookingsProxy");

// Casos de Uso
const RegisterUser = require("./application/use-cases/RegisterUser");
const LoginUser = require("./application/use-cases/LoginUser");
const ValidateToken = require("./application/use-cases/ValidateToken");

// Controllers
const AuthController = require("./presentation/controllers/AuthController");
const RoomsGatewayController = require("./presentation/controllers/RoomsGatewayController");
const BookingsGatewayController = require("./presentation/controllers/BookingsGatewayController");

// Rotas
const authRoutes = require("./presentation/routes/authRoutes");
const roomsRoutes = require("./presentation/routes/roomsRoutes");
const bookingsRoutes = require("./presentation/routes/bookingsRoutes");

const app = express();

app.use(express.json());
app.use(cors());

// --- Middlewares de Observabilidade e Documentação ---

if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("Swagger habilitado em /api-docs");
}

app.use(metricsMiddleware);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// --- Injeção de Dependências e Setup de Serviços ---

const userRepository = new SqlUserRepository();
const passwordHasher = new PasswordHasher();
const jwtService = new JwtService("segredo-super-seguro");

const roomsProxy = new RoomsProxy("http://rooms_service:3002");
const bookingsProxy = new BookingsProxy("http://bookings_service:3001");

const registerUser = new RegisterUser(userRepository, passwordHasher);
const loginUser = new LoginUser(userRepository, passwordHasher, jwtService);
const validateToken = new ValidateToken(jwtService);

const authController = new AuthController(registerUser, loginUser);
const roomsGatewayController = new RoomsGatewayController(roomsProxy);
const bookingsGatewayController = new BookingsGatewayController(bookingsProxy);

const authMiddleware = authMiddlewareFactory(validateToken);

// --- Rotas da Aplicação ---

app.use(authRoutes(authController));
app.use(roomsRoutes(roomsGatewayController, authMiddleware, roleMiddleware));
app.use(bookingsRoutes(bookingsGatewayController, authMiddleware));

// --- Inicialização do Banco de Dados ---

const sequelize = require("./infrastructure/database/sequelize");

async function inicializarBanco() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Tabelas criadas/sincronizadas com sucesso!");
  } catch (error) {
    console.error("Erro ao sincronizar banco:", error);
  }
}

inicializarBanco();

module.exports = app;