const express = require('express');
const router = express.Router();
const {
  obtenerTodos,
  obtenerPorId,
  obtenerPorRol,
  obtenerPorTurno,
  actualizar,
  cambiarTurno,
  canjearCodigoRol,
  eliminar
} = require('../controllers/user.controller');
const { verificarAuth, verificarRol } = require('../Middleware/auth.middleware');
const {
  validarActualizarUsuario,
  validarCambiarTurno
} = require('../Middleware/validator');

// Todas las rutas requieren autenticación
router.use(verificarAuth);

// Obtener todos los usuarios (solo admin)
router.get('/', verificarRol('admin'), obtenerTodos);

// Obtener usuarios por rol (solo admin)
router.get('/rol/:rol', verificarRol('admin'), obtenerPorRol);

// Obtener usuarios por turno (solo admin)
router.get('/turno/:turno', verificarRol('admin'), obtenerPorTurno);

// Obtener usuario por ID (admin o el propio usuario)
router.get('/:id', obtenerPorId);

// Actualizar usuario (admin o el propio usuario)
router.put('/:id', validarActualizarUsuario, actualizar);

// Cambiar turno (cualquier usuario autenticado puede cambiar su propio turno)
router.put('/:id/turno', validarCambiarTurno, cambiarTurno);

// Canjear código de rol profesor/pas (cualquier usuario autenticado)
router.post('/:id/canjear-codigo', canjearCodigoRol);

// Eliminar usuario (solo admin)
router.delete('/:id', verificarRol('admin'), eliminar);

module.exports = router;