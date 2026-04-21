const User = require('../database/models/UserModel'); 

class SqlUserRepository {
  async create(userData) {

    return await User.create(userData);
  }

  async findByUsername(username) {
   
    return await User.findOne({ where: { username } });
  }
}

module.exports = SqlUserRepository;