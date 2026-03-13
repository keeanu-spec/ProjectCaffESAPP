const supabase = require('../Supabase/client');

// Obtener todos los usuarios (solo admin)
const obtenerTodos = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('id_usuario, nombre, apellidos, email, curso, turno, rol, fecha_registro')
      .order('fecha_registro', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      cantidad: data.length,
      usuarios: data
    });
  } catch (error) {
    next(error);
  }
};

// Obtener usuario por ID
const obtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('usuario')
      .select('id_usuario, nombre, apellidos, email, curso, turno, rol, fecha_registro, ultimo_cambio_turno')
      .eq('id_usuario', id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      usuario: data
    });
  } catch (error) {
    next(error);
  }
};

// Obtener usuarios por rol
const obtenerPorRol = async (req, res, next) => {
  try {
    const { rol } = req.params;

    const { data, error } = await supabase
      .from('usuario')
      .select('id_usuario, nombre, apellidos, email, curso, turno, rol, fecha_registro')
      .eq('rol', rol);

    if (error) throw error;

    res.json({
      success: true,
      cantidad: data.length,
      usuarios: data
    });
  } catch (error) {
    next(error);
  }
};

// Obtener usuarios por turno
const obtenerPorTurno = async (req, res, next) => {
  try {
    const { turno } = req.params;

    const { data, error } = await supabase
      .from('usuario')
      .select('id_usuario, nombre, apellidos, email, curso, turno, rol, fecha_registro')
      .eq('turno', turno);

    if (error) throw error;

    res.json({
      success: true,
      cantidad: data.length,
      usuarios: data
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar usuario
const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, apellidos, email, curso } = req.body;

    const datosActualizar = {};
    if (nombre) datosActualizar.nombre = nombre;
    if (apellidos) datosActualizar.apellidos = apellidos;
    if (email) datosActualizar.email = email;
    if (curso !== undefined) datosActualizar.curso = curso;

    const { data, error } = await supabase
      .from('usuario')
      .update(datosActualizar)
      .eq('id_usuario', id)
      .select('id_usuario, nombre, apellidos, email, curso, turno, rol')
      .single();

    if (error) throw error;

    res.json({
      success: true,
      mensaje: 'Usuario actualizado exitosamente',
      usuario: data
    });
  } catch (error) {
    next(error);
  }
};

// Cambiar turno (con cooldown de 24h)
const cambiarTurno = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { turno } = req.body;

    // Obtener usuario
    const { data: usuario, error: errorUsuario } = await supabase
      .from('usuario')
      .select('ultimo_cambio_turno, rol')
      .eq('id_usuario', id)
      .single();

    if (errorUsuario || !usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Verificar cooldown de 24h
    if (usuario.ultimo_cambio_turno) {
      const ultimoCambio = new Date(usuario.ultimo_cambio_turno);
      const ahora = new Date();
      const diferenciaHoras = (ahora - ultimoCambio) / (1000 * 60 * 60);

      if (diferenciaHoras < 24) {
        const horasRestantes = Math.ceil(24 - diferenciaHoras);
        return res.status(400).json({
          success: false,
          error: `Debes esperar ${horasRestantes} horas para cambiar de turno nuevamente`
        });
      }
    }

    // Actualizar turno
    const { data, error } = await supabase
      .from('usuario')
      .update({
        turno,
        ultimo_cambio_turno: new Date()
      })
      .eq('id_usuario', id)
      .select('id_usuario, nombre, apellidos, email, curso, turno, rol')
      .single();

    if (error) throw error;

    res.json({
      success: true,
      mensaje: 'Turno actualizado exitosamente',
      usuario: data
    });
  } catch (error) {
    next(error);
  }
};

// Canjear código de rol profesor/pas
const canjearCodigoRol = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { codigo } = req.body;

    // Verificar si el código es válido
    const { data: codigoValido, error: errorCodigo } = await supabase
      .from('codigo_rol')
      .select('*')
      .eq('codigo', codigo)
      .eq('activo', true)
      .single();

    if (errorCodigo || !codigoValido) {
      return res.status(400).json({
        success: false,
        error: 'Código inválido o inactivo'
      });
    }

    // Cambiar rol a profesor_pas
    const { data, error } = await supabase
      .from('usuario')
      .update({
        rol: 'profesor_pas',
        turno: null // Los profesor/pas no tienen turno
      })
      .eq('id_usuario', id)
      .select('id_usuario, nombre, apellidos, email, rol')
      .single();

    if (error) throw error;

    res.json({
      success: true,
      mensaje: 'Rol actualizado a Profesor/PAS exitosamente',
      usuario: data
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar usuario
const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('usuario')
      .delete()
      .eq('id_usuario', id);

    if (error) throw error;

    res.json({
      success: true,
      mensaje: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerTodos,
  obtenerPorId,
  obtenerPorRol,
  obtenerPorTurno,
  actualizar,
  cambiarTurno,
  canjearCodigoRol,
  eliminar
};