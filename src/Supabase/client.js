// Aseguramos que cargue las variables si se usa independientemente
require('dotenv').config(); 
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Crear cliente
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;