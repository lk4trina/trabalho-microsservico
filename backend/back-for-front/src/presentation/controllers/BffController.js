class BffController {
  constructor(getAggregatedUserBookings) {
    this.getAggregatedUserBookings = getAggregatedUserBookings;
  }

  getDashboardData = async (req, res) => {
    try {

      const token = req.headers['authorization']; 
      
      if (!token) {
        return res.status(401).json({ error: "Token não fornecido ao BFF" });
      }

      const data = await this.getAggregatedUserBookings.execute(token);
      return res.json(data);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || 'Erro interno no BFF';
      return res.status(error.response?.status || 500).json({ error: errorMsg });
    }
  };
}

module.exports = BffController;