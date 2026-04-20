class InMemoryUserRepository {
  constructor() {
    this.users = [];
  }

  create(user) {
    this.users.push(user);
    return user;
  }

  findByUsername(username) {
    return this.users.find(user => user.username === username);
  }
}

module.exports = InMemoryUserRepository;