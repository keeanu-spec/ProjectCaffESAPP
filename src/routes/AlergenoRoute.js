const express = require('express');
const router = express.Router();
const supabase = require('../Supabase/client');

router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('alergeno').select('*');
    if (error) return res.json({ error: error.message });
    res.json({ mensaje: 'Work', datos: data });
  })

  //Search by ID
router.get('/:id',  async(req, res) =>{
    const id = req.params.id;
    const { data, error } = (await supabase.from('alergeno').select('nombre').eq('id_alergeno',id)).data();
    if (error) return res.json({ error: error.message });
    res.json({ mensaje: 'Work ', datos: data });
})

module.exports=router;