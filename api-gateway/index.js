const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

const SECRET = "segredo";

const users = [];

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 8);

  users.push({ email, password: hashed });

  res.json({ message: "Usuário criado" });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).send("Usuário não encontrado");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).send("Senha inválida");

  const token = jwt.sign({ email }, SECRET);

  res.json({ token });
});

function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).send("Sem token");

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).send("Token inválido");
  }
}

app.get('/teste', auth, (req, res) => {
  res.send("Acesso permitido");
});

app.listen(3000, () => console.log("Gateway rodando na 3000"));