// backend/src/Supabase/client.js
require('dotenv').config(); // Aseguramos que cargue las variables si se usa independientemente
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Crear cliente
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ESTA LÍNEA ES LA CLAVE DEL ERROR ---
// Debe ser module.exports directo, sin llaves {}
module.exports = supabase;