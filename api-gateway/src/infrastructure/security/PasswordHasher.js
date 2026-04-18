const bcrypt = require('bcryptjs');

class PasswordHasher {
  async hash(password) {
    return bcrypt.hash(password, 10);
  }

  async compare(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = PasswordHasher;