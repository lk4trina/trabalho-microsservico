const User = require('../../domain/entities/User');

class RegisterUser {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ username, password }) {
    const existingUser = this.userRepository.findByUsername(username);

    if (existingUser) {
      throw new Error('Usuário já existe');
    }

    const user = new User({ username, password });
    const hashedPassword = await this.passwordHasher.hash(user.password);

    return this.userRepository.create({
      username: user.username,
      password: hashedPassword
    });
  }
}

module.exports = RegisterUser;