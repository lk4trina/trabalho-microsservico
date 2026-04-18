class Room {
  constructor({ id, name, capacity, active = true }) {
    if (!name || typeof name !== 'string') {
      throw new Error('Nome da sala é obrigatório');
    }

    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error('Capacidade deve ser um número maior que zero');
    }

    this.id = id;
    this.name = name;
    this.capacity = capacity;
    this.active = active;
  }
}

module.exports = Room;