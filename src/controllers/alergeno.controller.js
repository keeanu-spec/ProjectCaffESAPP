const supabase = require('../Supabase/client');

// Obtener todos los alérgenos (público)
const obtenerTodos = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('alergeno')
      .select('*')
      .order('nombre');

    if (error) throw error;

    res.json({
      success: true,
      cantidad: data.length,
      alergenos: data
    });
  } catch (error) {
    next(error);
  }
};

// Obtener alérgeno por ID (público)
const obtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('alergeno')
      .select('*')
      .eq('id_alergeno', id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Alérgeno no encontrado'
      });
    }

    res.json({
      success: true,
      alergeno: data
    });
  } catch (error) {
    next(error);
  }
};

// Crear alérgeno (admin)
const crear = async (req, res, next) => {
  try {
    const { nombre, icono } = req.body;

    const { data, error } = await supabase
      .from('alergeno')
      .insert([{
        nombre,
        icono: icono || null
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      mensaje: 'Alérgeno creado exitosamente',
      alergeno: data
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar alérgeno (admin)
const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, icono } = req.body;

    const datosActualizar = {};
    if (nombre) datosActualizar.nombre = nombre;
    if (icono !== undefined) datosActualizar.icono = icono;

    const { data, error } = await supabase
      .from('alergeno')
      .update(datosActualizar)
      .eq('id_alergeno', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      mensaje: 'Alérgeno actualizado exitosamente',
      alergeno: data
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar alérgeno (admin)
const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Primero eliminar relaciones con productos
    await supabase
      .from('producto_alergeno')
      .delete()
      .eq('id_alergeno', id);

    // Luego eliminar el alérgeno
    const { error } = await supabase
      .from('alergeno')
      .delete()
      .eq('id_alergeno', id);

    if (error) throw error;

    res.json({
      success: true,
      mensaje: 'Alérgeno eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};