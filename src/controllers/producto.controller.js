const supabase = require('../Supabase/client');

// Obtener todos los productos disponibles (público)
const obtenerDisponibles = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('producto')
      .select(`
        *,
        producto_alergeno (
          alergeno (
            id_alergeno,
            nombre,
            icono
          )
        )
      `)
      .eq('disponible', true)
      .order('nombre');

    if (error) throw error;

    // Formatear respuesta para incluir alérgenos
    const productos = data.map(producto => ({
      ...producto,
      alergenos: producto.producto_alergeno.map(pa => pa.alergeno)
    }));

    // Eliminar producto_alergeno del objeto
    productos.forEach(p => delete p.producto_alergeno);

    res.json({
      success: true,
      cantidad: productos.length,
      productos
    });
  } catch (error) {
    next(error);
  }
};

// Obtener todos los productos (admin)
const obtenerTodos = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('producto')
      .select(`
        *,
        producto_alergeno (
          alergeno (
            id_alergeno,
            nombre,
            icono
          )
        )
      `)
      .order('nombre');

    if (error) throw error;

    // Formatear respuesta
    const productos = data.map(producto => ({
      ...producto,
      alergenos: producto.producto_alergeno.map(pa => pa.alergeno)
    }));

    productos.forEach(p => delete p.producto_alergeno);

    res.json({
      success: true,
      cantidad: productos.length,
      productos
    });
  } catch (error) {
    next(error);
  }
};

// Obtener producto por ID
const obtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('producto')
      .select(`
        *,
        producto_alergeno (
          alergeno (
            id_alergeno,
            nombre,
            icono
          )
        )
      `)
      .eq('id_producto', id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    // Formatear respuesta
    const producto = {
      ...data,
      alergenos: data.producto_alergeno.map(pa => pa.alergeno)
    };
    delete producto.producto_alergeno;

    res.json({
      success: true,
      producto
    });
  } catch (error) {
    next(error);
  }
};

// Crear producto (admin)
const crear = async (req, res, next) => {
  try {
    const { nombre, descripcion, precio, imagen, alergenos } = req.body;

    // Crear producto
    const { data: producto, error } = await supabase
      .from('producto')
      .insert([{
        nombre,
        descripcion: descripcion || null,
        precio,
        imagen: imagen || null,
        disponible: true
      }])
      .select()
      .single();

    if (error) throw error;

    // Si hay alérgenos, asociarlos al producto
    if (alergenos && alergenos.length > 0) {
      const relacionesAlergenos = alergenos.map(id_alergeno => ({
        id_producto: producto.id_producto,
        id_alergeno
      }));

      const { error: errorAlergenos } = await supabase
        .from('producto_alergeno')
        .insert(relacionesAlergenos);

      if (errorAlergenos) throw errorAlergenos;
    }

    // Obtener producto completo con alérgenos
    const { data: productoCompleto } = await supabase
      .from('producto')
      .select(`
        *,
        producto_alergeno (
          alergeno (
            id_alergeno,
            nombre,
            icono
          )
        )
      `)
      .eq('id_producto', producto.id_producto)
      .single();

    const resultado = {
      ...productoCompleto,
      alergenos: productoCompleto.producto_alergeno.map(pa => pa.alergeno)
    };
    delete resultado.producto_alergeno;

    res.status(201).json({
      success: true,
      mensaje: 'Producto creado exitosamente',
      producto: resultado
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar producto (admin)
const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, imagen, alergenos } = req.body;

    const datosActualizar = {};
    if (nombre) datosActualizar.nombre = nombre;
    if (descripcion !== undefined) datosActualizar.descripcion = descripcion;
    if (precio) datosActualizar.precio = precio;
    if (imagen !== undefined) datosActualizar.imagen = imagen;

    // Actualizar producto
    const { data: producto, error } = await supabase
      .from('producto')
      .update(datosActualizar)
      .eq('id_producto', id)
      .select()
      .single();

    if (error) throw error;

    // Si se proporcionaron alérgenos, actualizar relaciones
    if (alergenos !== undefined) {
      // Eliminar alérgenos existentes
      await supabase
        .from('producto_alergeno')
        .delete()
        .eq('id_producto', id);

      // Insertar nuevos alérgenos
      if (alergenos.length > 0) {
        const relacionesAlergenos = alergenos.map(id_alergeno => ({
          id_producto: id,
          id_alergeno
        }));

        const { error: errorAlergenos } = await supabase
          .from('producto_alergeno')
          .insert(relacionesAlergenos);

        if (errorAlergenos) throw errorAlergenos;
      }
    }

    // Obtener producto completo con alérgenos
    const { data: productoCompleto } = await supabase
      .from('producto')
      .select(`
        *,
        producto_alergeno (
          alergeno (
            id_alergeno,
            nombre,
            icono
          )
        )
      `)
      .eq('id_producto', id)
      .single();

    const resultado = {
      ...productoCompleto,
      alergenos: productoCompleto.producto_alergeno.map(pa => pa.alergeno)
    };
    delete resultado.producto_alergeno;

    res.json({
      success: true,
      mensaje: 'Producto actualizado exitosamente',
      producto: resultado
    });
  } catch (error) {
    next(error);
  }
};

// Cambiar disponibilidad (admin)
const cambiarDisponibilidad = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { disponible } = req.body;

    const { data, error } = await supabase
      .from('producto')
      .update({ disponible })
      .eq('id_producto', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      mensaje: `Producto ${disponible ? 'habilitado' : 'deshabilitado'} exitosamente`,
      producto: data
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar producto (admin)
const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Primero eliminar relaciones con alérgenos
    await supabase
      .from('producto_alergeno')
      .delete()
      .eq('id_producto', id);

    // Luego eliminar el producto
    const { error } = await supabase
      .from('producto')
      .delete()
      .eq('id_producto', id);

    if (error) throw error;

    res.json({
      success: true,
      mensaje: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerDisponibles,
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  cambiarDisponibilidad,
  eliminar
};