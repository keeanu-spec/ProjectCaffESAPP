
const express = require('express');

const cors = require('cors');

// Crear la aplicación de Express
const app = express();

// Importamos la conexión 
const supabase = require('./src/Supabase/client');


//Rutas

//Usuarios
app.get('/usuarios', async (req, res) => {
  const { data, error } = await supabase.from('usuarios').select('*');
  if (error) return res.json({ error: error.message });
  res.json({ mensaje: 'Usuarios obtenidos', datos: data });
})
//ruta pedidos
app.get('/pedidos', async (req, res) => {
  const { data, error } = await supabase.from('pedidos').select('*');
  
  if (error) return res.json({ error: error.message });
  res.json({ mensaje: 'Conexión exitosa', datos: data });
})

//Tarjetas pago
app.get('/tarjetas_pago', async (req, res) => {
  const { data, error } = await supabase.from('tarjetas_pago').select('*'); 
  
  if (error) return res.json({ error: error.message });
  res.json({ mensaje: 'Conexión exitosa', datos: data });
})

//detalles_pedido

app.get('/detalles_pedido', async (req, res) => {
  const { data, error } = await supabase.from('detalles_pedido').select('*'); 
  
  if (error) return res.json({ error: error.message });
  res.json({ mensaje: 'Conexión exitosa', datos: data });
})

//productos
app.get('/productos', async (req, res) => {
  const { data, error } = await supabase.from('productos').select('*'); 
  
  if (error) return res.json({ error: error.message });
  res.json({ mensaje: 'Conexión exitosa', datos: data });
})

//categorias
app.get('/categorias', async (req, res) => {
  const { data, error } = await supabase.from('categorias').select('*'); 
  
  if (error) return res.json({ error: error.message });
  res.json({ mensaje: 'Categorias obtenidos', datos: data });
})

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