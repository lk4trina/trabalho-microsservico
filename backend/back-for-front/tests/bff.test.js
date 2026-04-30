const request = require('supertest');
const express = require('express');
const GetAggregatedUserBookings = require('../src/application/use-cases/GetAggregatedUserBookings');
const BffController = require('../src/presentation/controllers/BffController');

// 1. Mock do ApiGatewayProxy
const mockApiGatewayProxy = {
  getUserBookings: jest.fn(),
  getRooms: jest.fn()
};


const getAggregatedUserBookingsUseCase = new GetAggregatedUserBookings(mockApiGatewayProxy);
const bffController = new BffController(getAggregatedUserBookingsUseCase);


const app = express();
app.use(express.json());

app.use('/dashboard/my-bookings', (req, res, next) => {
    req.headers['authorization'] = 'Bearer fake-token';
    next();
}, bffController.getDashboardData); 

describe('BFF Service - Testes de Agregação de Dados', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Unitário: GetAggregatedUserBookings Use Case', () => {
    it('Deve agregar as reservas com os nomes das salas corretamente', async () => {
      mockApiGatewayProxy.getUserBookings.mockResolvedValue([
        { id: 10, roomId: 1, startTime: '2026-05-01T10:00:00Z', endTime: '2026-05-01T12:00:00Z' }
      ]);
      
      mockApiGatewayProxy.getRooms.mockResolvedValue([
        { id: 1, name: 'Sala Ada Lovelace', capacity: 10 }
      ]);

      const result = await getAggregatedUserBookingsUseCase.execute('Bearer fake-token');

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('roomName', 'Sala Ada Lovelace');
      expect(result[0]).toHaveProperty('roomCapacity', 10); 
    });

    it('Deve preencher com "Sala Desconhecida" se a sala for apagada', async () => {
      mockApiGatewayProxy.getUserBookings.mockResolvedValue([
        { id: 11, roomId: 99, startTime: '2026-05-01', endTime: '2026-05-01' }
      ]);
      mockApiGatewayProxy.getRooms.mockResolvedValue([]); 

      const result = await getAggregatedUserBookingsUseCase.execute('Bearer fake-token');

      expect(result[0]).toHaveProperty('roomName', 'Sala Desconhecida');
    });
  });

   /* describe('Unitário: BffController', () => {
    let req, res;

    beforeEach(() => {
      req = { headers: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });

    it('Deve retornar erro 401 se não enviar token (Branch do IF)', async () => {
      await bffController.getDashboardData(req, res);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido ao BFF' });
    });

it('Deve retornar erro 500 se o Caso de Uso falhar (Branch do CATCH)', async () => {
      req.headers['authorization'] = 'Bearer token-invalido';
      
      mockApiGatewayProxy.getUserBookings.mockRejectedValue(new Error('Erro interno do servidor (BFF)'));

      await bffController.getDashboardData(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno do servidor (BFF)' });
    });
  });  */

  describe('Integração: GET /dashboard/my-bookings', () => {
    it('Deve retornar status 200 e a lista agregada', async () => {
      mockApiGatewayProxy.getUserBookings.mockResolvedValue([{ id: 1, roomId: 1 }]);
      mockApiGatewayProxy.getRooms.mockResolvedValue([{ id: 1, name: 'Sala Tech' }]);

      const response = await request(app).get('/dashboard/my-bookings');

      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty('roomName', 'Sala Tech');
      expect(mockApiGatewayProxy.getUserBookings).toHaveBeenCalledWith('Bearer fake-token');
    });
  });
});