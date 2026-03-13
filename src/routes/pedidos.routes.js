const express = require('express');
const router = express.Router();
const {
  verificarHorario,
  obtenerMisPedidos,
  obtenerTodos,
  obtenerPorFecha,
  crearPedido
} = require('../controllers/pedido.controller');
const { verificarAuth, verificarRol } = require('../Middleware/auth.middleware');
const { validarPedido } = require('../Middleware/validator');

// Todas las rutas requieren autenticación
router.use(verificarAuth);

// Verificar si puede hacer pedido según horario
router.get('/verificar-horario', verificarHorario);

// Obtener mis pedidos
router.get('/mis-pedidos', obtenerMisPedidos);

// Crear pedido (valida horario automáticamente)
router.post('/', validarPedido, crearPedido);

// Rutas de admin
router.get('/admin/todos', verificarRol('admin'), obtenerTodos);
router.get('/admin/fecha/:fecha', verificarRol('admin'), obtenerPorFecha);

module.exports = router;