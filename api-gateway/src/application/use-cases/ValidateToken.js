class ValidateToken {
  constructor(jwtService) {
    this.jwtService = jwtService;
  }

  execute(token) {
    return this.jwtService.verify(token);
  }
}

module.exports = ValidateToken;