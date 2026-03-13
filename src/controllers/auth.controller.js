const bcrypt = require('bcryptjs');
const supabase = require('../Supabase/client');
const { generarToken } = require('../Utils/jwt');

// Registro de usuario
const registro = async (req, res, next) => {
  try {
    const { nombre, apellidos, email, contrasena, curso, turno } = req.body;

    // Verificar si el email ya existe
    const { data: usuarioExistente } = await supabase
      .from('usuario')
      .select('email')
      .eq('email', email)
      .single();

    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        error: 'El email ya está registrado'
      });
    }

    // Hashear contraseña
    const contrasenaHash = await bcrypt.hash(contrasena, 10);

    // Crear usuario (rol por defecto: alumno)
    const nuevoUsuario = {
      nombre,
      apellidos,
      email,
      contrasena: contrasenaHash,
      curso: curso || null,
      turno: turno || null,
      rol: 'alumno',
      fecha_registro: new Date(),
      ultimo_cambio_turno: null
    };

    const { data, error } = await supabase
      .from('usuario')
      .insert([nuevoUsuario])
      .select()
      .single();

    if (error) throw error;

    // Generar token
    const token = generarToken({
      id_usuario: data.id_usuario,
      email: data.email,
      rol: data.rol
    });

    // No devolver la contraseña
    delete data.contrasena;

    res.status(201).json({
      success: true,
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: data
    });
  } catch (error) {
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { email, contrasena } = req.body;

    // Buscar usuario por email
    const { data: usuario, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !usuario) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generarToken({
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol
    });

    // No devolver la contraseña
    delete usuario.contrasena;

    res.json({
      success: true,
      mensaje: 'Login exitoso',
      token,
      usuario
    });
  } catch (error) {
    next(error);
  }
};

// Obtener perfil (requiere autenticación)
const obtenerPerfil = async (req, res, next) => {
  try {
    // req.usuario viene del middleware verificarAuth
    const usuario = { ...req.usuario };
    delete usuario.contrasena;

    res.json({
      success: true,
      usuario
    });
  } catch (error) {
    next(error);
  }
};

// Cambiar contraseña
const cambiarContrasena = async (req, res, next) => {
  try {
    const { contrasenaActual, contrasenaNueva } = req.body;
    const usuarioId = req.usuario.id_usuario;

    // Obtener usuario con contraseña
    const { data: usuario, error } = await supabase
      .from('usuario')
      .select('contrasena')
      .eq('id_usuario', usuarioId)
      .single();

    if (error) throw error;

    // Verificar contraseña actual
    const contrasenaValida = await bcrypt.compare(contrasenaActual, usuario.contrasena);

    if (!contrasenaValida) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña actual es incorrecta'
      });
    }

    // Hashear nueva contraseña
    const nuevaContrasenaHash = await bcrypt.hash(contrasenaNueva, 10);

    // Actualizar contraseña
    const { error: updateError } = await supabase
      .from('usuario')
      .update({ contrasena: nuevaContrasenaHash })
      .eq('id_usuario', usuarioId);

    if (updateError) throw updateError;

    res.json({
      success: true,
      mensaje: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registro,
  login,
  obtenerPerfil,
  cambiarContrasena
};