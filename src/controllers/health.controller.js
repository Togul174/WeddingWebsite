const healthController = {
  getHealth: (req, res) => {
    res.json({
      success: true,
      message: 'Сервер работает',
      timestamp: new Date().toISOString(),
      endpoints: {
        createGuest: 'POST /create-guest',
        getGuests: 'GET /guests',
        getGuestById: 'GET /guests/:id',
        health: 'GET /api/health'
      }
    });
  }
};

module.exports = healthController;