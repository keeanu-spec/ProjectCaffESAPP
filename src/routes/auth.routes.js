const express = require('express');
const router = express.Router();
const {
  registro,
  login,
  obtenerPerfil,
  cambiarContrasena
} = require('../controllers/auth.controller');
const { verificarAuth } = require('../Middleware/auth.middleware');
const {
  validarRegistro,
  validarLogin
} = require('../Middleware/validator');

// Rutas públicas
router.post('/registro', validarRegistro, registro);
router.post('/login', validarLogin, login);

// Rutas protegidas (requieren autenticación)
router.get('/perfil', verificarAuth, obtenerPerfil);
router.put('/cambiar-contrasena', verificarAuth, cambiarContrasena);

module.exports = router;
