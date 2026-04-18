const express = require('express');
const cors = require('cors');

const InMemoryUserRepository = require('./infrastructure/repositories/InMemoryUserRepository');
const PasswordHasher = require('./infrastructure/security/PasswordHasher');
const JwtService = require('./infrastructure/security/JwtService');
const RoomsProxy = require('./infrastructure/http/RoomsProxy');

const RegisterUser = require('./application/use-cases/RegisterUser');
const LoginUser = require('./application/use-cases/LoginUser');
const ValidateToken = require('./application/use-cases/ValidateToken');

const AuthController = require('./presentation/controllers/AuthController');
const RoomsGatewayController = require('./presentation/controllers/RoomsGatewayController');

const authRoutes = require('./presentation/routes/authRoutes');
const roomsRoutes = require('./presentation/routes/roomsRoutes');
const authMiddlewareFactory = require('./presentation/middlewares/authMiddleware');

const app = express();
app.use(express.json());
app.use(cors());

const userRepository = new InMemoryUserRepository();
const passwordHasher = new PasswordHasher();
const jwtService = new JwtService('segredo-super-seguro');
const roomsProxy = new RoomsProxy('http://localhost:3002');

const registerUser = new RegisterUser(userRepository, passwordHasher);
const loginUser = new LoginUser(userRepository, passwordHasher, jwtService);
const validateToken = new ValidateToken(jwtService);

const authController = new AuthController(registerUser, loginUser);
const roomsGatewayController = new RoomsGatewayController(roomsProxy);
const authMiddleware = authMiddlewareFactory(validateToken);

app.use(authRoutes(authController));
app.use(roomsRoutes(roomsGatewayController, authMiddleware));

module.exports = app;