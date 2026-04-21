const express = require("express");
const cors = require("cors");
const roleMiddleware = require("./presentation/middlewares/roleMiddleware");

//const InMemoryUserRepository = require('./infrastructure/repositories/InMemoryUserRepository');
const SqlUserRepository = require("./infrastructure/repositories/SqlUserRepository");
const PasswordHasher = require("./infrastructure/security/PasswordHasher");
const JwtService = require("./infrastructure/security/JWTService");
const RoomsProxy = require("./infrastructure/http/RoomsProxy");

const RegisterUser = require("./application/use-cases/RegisterUser");
const LoginUser = require("./application/use-cases/LoginUser");
const ValidateToken = require("./application/use-cases/ValidateToken");

const AuthController = require("./presentation/controllers/AuthController");
const RoomsGatewayController = require("./presentation/controllers/RoomsGatewayController");

const authRoutes = require("./presentation/routes/authRoutes");
const roomsRoutes = require("./presentation/routes/roomsRoutes");
const authMiddlewareFactory = require("./presentation/middlewares/authMiddleware");

const app = express();
app.use(express.json());
app.use(cors());

const userRepository = new SqlUserRepository(); //new InMemoryUserRepository();
const passwordHasher = new PasswordHasher();
const jwtService = new JwtService("segredo-super-seguro");
const roomsProxy = new RoomsProxy("http://rooms-service:3002");

const registerUser = new RegisterUser(userRepository, passwordHasher);
const loginUser = new LoginUser(userRepository, passwordHasher, jwtService);
const validateToken = new ValidateToken(jwtService);

const authController = new AuthController(registerUser, loginUser);
const roomsGatewayController = new RoomsGatewayController(roomsProxy);
const authMiddleware = authMiddlewareFactory(validateToken);

app.use(authRoutes(authController));
app.use(roomsRoutes(roomsGatewayController, authMiddleware, roleMiddleware));

const sequelize = require("./infrastructure/database/sequelize");
const User = require("./infrastructure/database/models/UserModel");

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
