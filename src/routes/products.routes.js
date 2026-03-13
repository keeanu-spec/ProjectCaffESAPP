const express = require('express');
const router = express.Router();
const {
  obtenerDisponibles,
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  cambiarDisponibilidad,
  eliminar
} = require('../controllers/producto.controller');
const { verificarAuth, verificarRol } = require('../Middleware/auth.middleware');
const { validarProducto } = require('../Middleware/validator');

// Rutas públicas
router.get('/', obtenerDisponibles); // Solo productos disponibles
router.get('/:id', obtenerPorId);

// Rutas protegidas (solo admin)
router.get('/admin/todos', verificarAuth, verificarRol('admin'), obtenerTodos);
router.post('/', verificarAuth, verificarRol('admin'), validarProducto, crear);
router.put('/:id', verificarAuth, verificarRol('admin'), validarProducto, actualizar);
router.patch('/:id/disponibilidad', verificarAuth, verificarRol('admin'), cambiarDisponibilidad);
router.delete('/:id', verificarAuth, verificarRol('admin'), eliminar);

module.exports = router;