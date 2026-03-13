const express = require('express');
const router = express.Router();
const {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
  } = require('../controllers/alergeno.controller.js');
const { verificarAuth, verificarRol } = require('../Middleware/auth.middleware');
const { validarAlergeno } = require('../Middleware/validator');

// Rutas públicas
router.get('/', obtenerTodos);
router.get('/:id', obtenerPorId);

// Rutas protegidas (solo admin)
router.post('/', verificarAuth, verificarRol('admin'), validarAlergeno, crear);
router.put('/:id', verificarAuth, verificarRol('admin'), validarAlergeno, actualizar);
router.delete('/:id', verificarAuth, verificarRol('admin'), eliminar);

module.exports = router;