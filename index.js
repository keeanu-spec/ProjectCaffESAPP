require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');

const app = express();

// ==========================
// SEGURIDAD
// ==========================

// Helmet - protege headers HTTP
app.use(helmet());

// CORS - configuración segura
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' })); // Limitar tamaño de body

// XSS Protection - prevenir ataques XSS
app.use(xss());

// HPP Protection - prevenir HTTP Parameter Pollution
app.use(hpp());

// Rate limiting - máximo 100 requests por IP cada 15 minutos
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutos
  max: 200,
  message: {
    success: false,
    error: 'Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Rate limiting más estricto para autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Solo 5 intentos de login cada 15 min
  message: {
    success: false,
    error: 'Demasiados intentos de login, intenta de nuevo en 15 minutos'
  }
});

// ==========================
// RUTAS
// ==========================

// Ruta de comprobación
app.get('/', (req, res) => {
  res.json({
    success: true,
    mensaje: '🍔 API Cafetería IES José Zerpa funcionando',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      productos: '/api/productos',
      pedidos: '/api/pedidos',
      alergenos: '/api/alergenos'
    }
  });
});

// Importar rutas
const authRoutes = require('./src/routes/auth.routes.js');
const usuarioRoutes = require('./src/routes/user.routes.js');
const productoRoutes = require('./src/routes/products.routes.js');
const pedidoRoutes = require('./src/routes/pedidos.routes.js');
const alergenoRoutes = require('./src/routes/Alergeno.routes.js');

// Usar rutas (con rate limiting específico para auth)
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/alergenos', alergenoRoutes);

// ==========================
// MANEJO DE ERRORES
// ==========================

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores global
const errorHandler = require('./src/Middleware/errorHandler');
app.use(errorHandler);

// ==========================
// SERVIDOR
// ==========================

const PORT = process.env.PORT || 5000;

// Solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`🔒 Seguridad activada: Helmet, XSS, HPP, Rate Limiting`);
  });
} else {
  // En producción usa HTTPS
  app.listen(PORT, () => {
    console.log(`🚀 Servidor en producción en puerto ${PORT}`);
  });
}

module.exports = app; // Para testing
