module.exports = (validateToken) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ error: 'Token não informado' });
      }

      const [, token] = authHeader.split(' ');
      const decoded = validateToken.execute(token);

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };
};