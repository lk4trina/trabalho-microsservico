class Booking {
  constructor({ id, roomId, userId, startTime, endTime, status = 'ACTIVE' }) {
    
    const missingFields = [];
    if (!roomId) missingFields.push('Sala');
    if (!userId) missingFields.push('Usuário');
    if (!startTime) missingFields.push('Horário de Início');
    if (!endTime) missingFields.push('Horário de Fim');

    if (missingFields.length > 0) {
      throw new Error(`Dado(s) obrigatório(s) em falta: ${missingFields.join(', ')}`);
    }
    
    if (new Date(startTime) >= new Date(endTime)) {
      throw new Error('O horário de fim deve ser posterior ao horário de início');
    }

    this.id = id;
    this.roomId = roomId;
    this.userId = userId;
    this.startTime = new Date(startTime);
    this.endTime = new Date(endTime);
    this.status = status;
  }
}

module.exports = Booking;