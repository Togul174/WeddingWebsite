const errorHandler = {
  // Обработка 404
  notFound: (req, res) => {
    res.status(404).json({
      success: false,
      error: 'Маршрут не найден',
      path: req.path
    });
  },

  // Глобальный обработчик ошибок
  globalError: (err, req, res, next) => {
    console.error('🔥 Глобальная ошибка:', err);
    
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
};

module.exports = errorHandler;