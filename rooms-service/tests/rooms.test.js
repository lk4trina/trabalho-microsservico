const request = require('supertest');
const express = require('express');

const app = require('../index'); // depois ajustamos export

describe('Rooms', () => {
  it('deve criar uma sala', async () => {
    const res = await request(app)
      .post('/rooms')
      .send({ name: "Sala 1", capacity: 10 });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Sala 1");
  });
});