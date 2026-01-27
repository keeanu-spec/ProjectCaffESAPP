require('dotenv').config(); // Cargar variables de entorno del archivo .env
const express = require('express');
const cors = require('cors');

// Crear la aplicación de Express
const app = express();

//  (Configuraciones) 
// Permitir que el frontend se comunique con el backend
app.use(cors());
// Permitir que el servidor entienda datos en formato JSON.
app.use(express.json());

// Rutas de prueba 
app.get('/', (req, res) => {
  res.send('Server working ');
});

//  Arrancar el servidor 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});