const { body, param, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const manejarErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      success: false,
      errores: errores.array().map(err => ({
        campo: err.path,
        mensaje: err.msg
      }))
    });
  }
  next();
};

// Validaciones de autenticación
const validarRegistro = [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('apellidos').trim().notEmpty().withMessage('Los apellidos son requeridos'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('curso').optional().trim(),
  body('turno')
    .optional()
    .isIn(['manana', 'tarde', 'noche'])
    .withMessage('Turno debe ser: manana, tarde o noche'),
  manejarErrores
];

const validarLogin = [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('contrasena').notEmpty().withMessage('La contraseña es requerida'),
  manejarErrores
];

// Validaciones de usuario
const validarActualizarUsuario = [
  param('id').isInt().withMessage('ID inválido'),
  body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('apellidos').optional().trim().notEmpty().withMessage('Los apellidos no pueden estar vacíos'),
  body('email').optional().isEmail().withMessage('Email inválido').normalizeEmail(),
  body('curso').optional().trim(),
  manejarErrores
];

const validarCambiarTurno = [
  param('id').isInt().withMessage('ID inválido'),
  body('turno')
    .isIn(['manana', 'tarde', 'noche'])
    .withMessage('Turno debe ser: manana, tarde o noche'),
  manejarErrores
];

// Validaciones de producto
const validarProducto = [
  body('nombre').trim().notEmpty().withMessage('El nombre del producto es requerido'),
  body('descripcion').optional().trim(),
  body('precio')
    .isFloat({ min: 0.01 })
    .withMessage('El precio debe ser un número positivo'),
  body('disponible').optional().isBoolean().withMessage('Disponible debe ser true o false'),
  body('imagen').optional().trim(),
  body('alergenos').optional().isArray().withMessage('Los alérgenos deben ser un array'),
  manejarErrores
];

// Validaciones de pedido
const validarPedido = [
  body('lineas').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
  body('lineas.*.id_producto').isInt().withMessage('ID de producto inválido'),
  body('lineas.*.cantidad').isInt({ min: 1 }).withMessage('Cantidad debe ser al menos 1'),
  manejarErrores
];

// Validaciones de alérgeno
const validarAlergeno = [
  body('nombre').trim().notEmpty().withMessage('El nombre del alérgeno es requerido'),
  body('icono').optional().trim(),
  manejarErrores
];

module.exports = {
  validarRegistro,
  validarLogin,
  validarActualizarUsuario,
  validarCambiarTurno,
  validarProducto,
  validarPedido,
  validarAlergeno
};