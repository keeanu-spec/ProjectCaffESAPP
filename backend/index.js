
const express = require('express');

const cors = require('cors');

// Crear la aplicación de Express
const app = express();

// Importamos la conexión 
const supabase = require('./src/Supabase/client');
 
//URL
const URL = "http://localhost:5000";

//importes routes
const userRoutes = require('./src/routes/userRoutes');
  // const productsRoutes = require('./src/routes/productsRoutes');
const alergenoRoute = require('./src/routes/AlergenoRoute');
  // const codeRoute = require('./src/routes/CodeRoute');
  // const pedidosRoutes = require('./src/routes/PedidosRoutes');
  // const lineaPedidoRoute = require('./src/routes/lineaPedidoRoute');
  // const transaccionRoutes = require('./src/routes/TransaccionRoutes');
  // const productsAlergenoRoute = require('./src/routes/productsAlergenoRoutes');

//Routes
app.use('/usuarios',userRoutes)
// app.use('/productsRoutes',productsRoutes)
 app.use('/alergenoRoute',alergenoRoute)
// app.use('/codeRoute',codeRoute)
// app.use('/pedidosRoutes',pedidosRoutes)
// app.use('/lineaPedidoRoute',lineaPedidoRoute)
// app.use('/transaccionRoutes',transaccionRoutes)
// app.use('/productsAlergenoRoute',productsAlergenoRoute)


// carga del env
require('dotenv').config(); 




//  (Configuraciones) 
// Permitir que el frontend se comunique con el backend
app.use(cors());
// Permitir que el servidor entienda datos en formato JSON.
app.use(express.json());

// Ruta de Comprobacion
app.get('/', (req, res) => {
  res.send('Server working ');
});


//  Arrancar el servidor 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` ${PORT}`);
});