const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

let rooms = [];

app.post('/rooms', (req, res) => {
  const { name, capacity } = req.body;

  if (!name || capacity <= 0) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const room = {
    id: rooms.length + 1,
    name,
    capacity,
    active: true
  };

  rooms.push(room);

  res.json(room);
});

app.get('/rooms', (req, res) => {
  const activeRooms = rooms.filter(r => r.active);
  res.json(activeRooms);
});

app.put('/rooms/:id', (req, res) => {
  const room = rooms.find(r => r.id == req.params.id);

  if (!room) return res.status(404).json({ error: "Sala não encontrada" });

  room.active = !room.active;

  res.json(room);
});

// rota proxy
app.get('/rooms', authMiddleware, async (req, res) => {
  const response = await axios.get('http://localhost:3002/rooms');
  res.json(response.data);
});

app.listen(3002, () => console.log("Rooms rodando na 3002"));