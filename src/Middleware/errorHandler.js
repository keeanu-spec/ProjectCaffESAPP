const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
  
    // Error de validación de Supabase
    if (err.code === '23505') {
      return res.status(400).json({
        success: false,
        error: 'Ya existe un registro con esos datos'
      });
    }
  
    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token inválido'
      });
    }
  
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado'
      });
    }
  
    // Error genérico
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Error interno del servidor'
    });
  };
  
  module.exports = errorHandler;