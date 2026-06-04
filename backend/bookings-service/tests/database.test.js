const sequelize = require("../src/infrastructure/database/sequelize");
const BookingModel = require("../src/infrastructure/database/models/BookingModel");

describe("Unitário: Configuração do Banco de Dados", () => {
  it("Deve inicializar a instância do Sequelize corretamente", () => {

    expect(sequelize).toBeDefined();
    expect(sequelize.config).toBeDefined();
  });

  it("Deve definir o BookingModel corretamente", () => {

    expect(BookingModel).toBeDefined();
    expect(BookingModel.name).toBe("Booking"); 
  });
});