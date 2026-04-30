const request = require('supertest');
const express = require('express');
const CreateBooking = require('../src/application/use-cases/CreateBooking');
const BookingController = require('../src/presentation/controllers/BookingController');

// 1. Setup de Datas Dinâmicas (para nunca dar erro de "data no passado")
const amanha = new Date();
amanha.setDate(amanha.getDate() + 1);
const amanhaStr = amanha.toISOString();

const depoisDeAmanha = new Date();
depoisDeAmanha.setDate(depoisDeAmanha.getDate() + 2);
const depoisDeAmanhaStr = depoisDeAmanha.toISOString();

// 2. Mocks do Repositório 
const mockBookingRepository = {
  findConflictingBooking: jest.fn(),
  create: jest.fn(),
};

const createBookingUseCase = new CreateBooking(mockBookingRepository);
const bookingController = new BookingController(createBookingUseCase, {}, {}, {});

const app = express();
app.use(express.json());

app.post('/bookings', bookingController.create); 

describe('Bookings Service - Testes de Criação e Conflitos', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  describe('Unitário: CreateBooking Use Case', () => {
    
    it('Deve criar uma reserva com sucesso se não houver conflito', async () => {
      mockBookingRepository.findConflictingBooking.mockResolvedValue(null); 
      mockBookingRepository.create.mockResolvedValue({ id: 1, roomId: 1, status: 'ACTIVE' });

      const result = await createBookingUseCase.execute({
        roomId: 1, userId: 1, startTime: amanhaStr, endTime: depoisDeAmanhaStr
      }, 'USER');

      expect(result).toHaveProperty('id');
      expect(mockBookingRepository.findConflictingBooking).toHaveBeenCalledTimes(1);
      expect(mockBookingRepository.create).toHaveBeenCalledTimes(1);
    });

    it('Deve lançar erro ao tentar criar reserva no passado', async () => {
      const ontem = new Date();
      ontem.setDate(ontem.getDate() - 1);
      
      await expect(createBookingUseCase.execute({
        roomId: 1, userId: 1, startTime: ontem.toISOString(), endTime: amanhaStr
      }, 'USER')).rejects.toThrow('Não é possível criar uma reserva com data no passado.');
    });

    it('Deve lançar erro de conflito de horário', async () => {
      mockBookingRepository.findConflictingBooking.mockResolvedValue({ id: 99 }); 

      await expect(createBookingUseCase.execute({
        roomId: 1, userId: 1, startTime: amanhaStr, endTime: depoisDeAmanhaStr
      }, 'USER')).rejects.toThrow('Conflito de horário: A sala já está reservada neste período.');
    });
  });

  /*
describe('Unitário: BookingController', () => {
    let req, res;

    beforeEach(() => {
      req = { 
        headers: { 'x-user-id': '1', 'x-user-role': 'USER' }, 
        body: {}, 
        params: { id: '1' } 
      };
      res = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn(), 
        send: jest.fn() 
      };
    });

    it('Deve retornar 400 se o Create falhar (Branch do CATCH)', async () => {
      createBookingUseCase.execute = jest.fn().mockRejectedValue(new Error('Erro de validação'));
      await bookingController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('Deve retornar 200 ao Editar com sucesso', async () => {
      bookingController.editBooking = { execute: jest.fn().mockResolvedValue({ id: 1 }) };
      await bookingController.edit(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('Deve retornar 400 se o Editar falhar (Branch do CATCH)', async () => {
      bookingController.editBooking = { execute: jest.fn().mockRejectedValue(new Error('Erro ao editar')) };
      await bookingController.edit(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('Deve retornar 204 ao Deletar com sucesso', async () => {
      bookingController.deleteBooking = { execute: jest.fn().mockResolvedValue() };
      await bookingController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('Deve retornar 400 se o Deletar falhar (Branch do CATCH)', async () => {
      bookingController.deleteBooking = { execute: jest.fn().mockRejectedValue(new Error('Erro ao deletar')) };
      await bookingController.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('Deve retornar 200 ao Listar com sucesso', async () => {
      bookingController.listUserBookings = { execute: jest.fn().mockResolvedValue([]) };
      await bookingController.list(req, res);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('Deve retornar 500 se o Listar falhar (Branch do CATCH)', async () => {
      bookingController.listUserBookings = { execute: jest.fn().mockRejectedValue(new Error('Erro interno')) };
      await bookingController.list(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
  */

  describe('Integração: POST /bookings', () => {
    it('Deve retornar status 201 ao criar reserva via API', async () => {
      mockBookingRepository.findConflictingBooking.mockResolvedValue(null);
      mockBookingRepository.create.mockResolvedValue({ id: 2, status: 'ACTIVE' });

      const response = await request(app)
        .post('/bookings')
        .set('x-user-id', '1') // Simula o Gateway passando o ID
        .set('x-user-role', 'USER') // Simula o Gateway passando o tipo de usuário
        .send({
          roomId: 1,
          startTime: amanhaStr,
          endTime: depoisDeAmanhaStr
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 2);
    });
  });
});