const express = require('express');
const router = express.Router();
const supabase = require('../Supabase/client');

router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('usuario').select('*');
    if (error) return res.json({ error: error.message });
    res.json({ mensaje: 'Usuarios obtenidos', datos: data });
  })
//Search by ID
router.get('/:id',  async(req, res) =>{
    const id = req.params.id;
    const { data, error } = await supabase.from('usuario').select('*').eq('id_usuario',id).single();
    if (error) return res.json({ error: error.message });
    res.json({ mensaje: 'Usuario obtenido', datos: data });
})


module.exports=router;




