class User {
  constructor({ username, password }) {
    if (!username || typeof username !== 'string') {
      throw new Error('Username é obrigatório');
    }

    if (!password || typeof password !== 'string' || password.length < 3) {
      throw new Error('Password deve ter pelo menos 3 caracteres');
    }

    this.username = username;
    this.password = password;
  }
}

module.exports = User;