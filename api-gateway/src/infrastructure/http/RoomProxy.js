app.post('/rooms', authMiddleware, async (req, res) => {
  const response = await axios.post('http://localhost:3002/rooms', req.body);
  res.json(response.data);
});

app.patch('/rooms/:id/toggle', authMiddleware, async (req, res) => {
  const response = await axios.patch(
    `http://localhost:3002/rooms/${req.params.id}/toggle`
  );
  res.json(response.data);
});

async createRoom(data) {
  const response = await this.client.post('/rooms', data);
  return response.data;
}

async toggleRoom(id) {
  const response = await this.client.patch(`/rooms/${id}/toggle`);
  return response.data;
}