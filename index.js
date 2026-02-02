
const express = require('express');

const cors = require('cors');

// Crear la aplicación de Express
const app = express();

// Importamos la conexión 
const supabase = require('./src/Supabase/client');
 
//URL
const URL = "http://localhost:5000";

//Routes

//Users
app.get('/usuarios', async (req, res) => {
  const { data, error } = await supabase.from('usuario').select('*');
  if (error) return res.json({ error: error.message });
  res.json({ mensaje: 'Usuarios obtenidos', datos: data });
})

//By ID
app.get('/usuarios/id', async (req, res) => {
  const {data, error } = await supabase.from('usuario').select('id_usuario');
  if ( error) return res.json({error: error.message});
  res.json({mensaje: 'id obtenido',datos: data});
})

//Products Alergeno
app.get('/producto_alergeno', async (req, res) => {
  const { data, error } = await supabase.from('producto_alergeno').select('*');
  if (error) return res.json({ error: error.message });
  res.json({ mensaje: 'Usuarios obtenidos', datos: data });
})

//linea_pedido

app.get('/linea_pedido', async (req, res) => {
  const { data, error } = await supabase.from('linea_pedido').select('*');
  if (error) return res.json({ error: error.message });
  res.json({ mensaje: 'Usuarios obtenidos', datos: data });
})
//Transaccion
app.get('/transaccion', async (req, res) => {
  const { data, error } = await supabase.from('transaccion').select('*');
  if (error) return res.json({ error: error.message });
  res.json({ mensaje: 'transaccion', datos: data });
})
//pedido
app.get('/pedido', async (req, res) => {
  const { data, error } = await supabase.from('pedido').select('*');
  if (error) return res.json({ error: error.message });
  res.json({ mensaje: 'Cargado Pedido', datos: data });
})

//producto
app.get('/producto', async (req, res) => {
  const { data, error } = await supabase.from('producto').select('*');
  if (error) return res.json({ error: error.message });
  res.json({ mensaje: 'Cargado Producto', datos: data });
})
//alergeno
app.get('/alergeno', async (req, res) => {
  const { data, error } = await supabase.from('alergeno').select('*');
  if (error) return res.json({ error: error.message });
  res.json({ mensaje: 'Cargado alergeno.', datos: data });
})
//codigo_rol
app.get('/codigo_rol', async (req, res) => {
  const { data, error } = await supabase.from('codigo_rol').select('*');
  if (error) return res.json({ error: error.message });
  res.json({ mensaje: 'Codigo obtenidos', datos: data });
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