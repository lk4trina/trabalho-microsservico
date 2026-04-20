class AuthController {
  constructor(registerUser, loginUser) {
    this.registerUser = registerUser;
    this.loginUser = loginUser;
  }

  register = async (req, res) => {
    try {
      const user = await this.registerUser.execute(req.body);

      return res.status(201).json({
        username: user.username,
        role: user.role,
        message: 'Usuário criado com sucesso'
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const token = await this.loginUser.execute(req.body);
      return res.json({ token });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  };
}

module.exports = AuthController;