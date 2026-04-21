class LoginUser {
  constructor(userRepository, passwordHasher, jwtService) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.jwtService = jwtService;
  }

  async execute({ username, password }) {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const validPassword = await this.passwordHasher.compare(
      password,
      user.password,
    );

    if (!validPassword) {
      throw new Error("Senha inválida");
    }

    const token = this.jwtService.sign({
      username: user.username,
      role: user.role,
    });

    return {
      token,
      role: user.role,
      username: user.username,
    };
  }
}

module.exports = LoginUser;