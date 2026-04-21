class User {
  constructor({ username, password, role = 'USER' }) {
    if (!username || typeof username !== 'string') {
      throw new Error('Username é obrigatório');
    }

    if (!password || typeof password !== 'string' || password.length < 3) {
      throw new Error('Password deve ter pelo menos 3 caracteres');
    }

    if (!['ADMIN', 'USER'].includes(role)) {
      throw new Error('Tipo de usuário inválido');
    }

    this.username = username;
    this.password = password;
    this.role = role;
  }
}

module.exports = User;