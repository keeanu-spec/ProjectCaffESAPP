const { verificarToken } = require('../Utils/jwt');
const supabase = require('../Supabase/client');

const verificarAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No se proporcionó token de autenticación'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verificarToken(token);

    // Obtener usuario completo de la base de datos
    const { data: usuario, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('id_usuario', decoded.id_usuario)
      .single();

    if (error || !usuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Añadir usuario a la request
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token inválido o expirado'
    });
  }
};

const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado'
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para realizar esta acción'
      });
    }

    next();
  };
};

module.exports = { verificarAuth, verificarRol };