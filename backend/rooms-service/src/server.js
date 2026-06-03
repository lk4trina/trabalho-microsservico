const app = require('./app');

const PORT = process.env.PORT || 30002


app.listen(PORT, () => {
  console.log(`Rooms service rodando na porta ${PORT}`);
});