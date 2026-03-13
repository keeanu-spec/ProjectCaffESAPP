const supabase = require('../Supabase/client');
const { puedeHacerPedido } = require('../Utils/verificarHorario');

// Verificar si puede hacer pedido según horario
const verificarHorario = async (req, res, next) => {
  try {
    const usuario = req.usuario;
    const verificacion = puedeHacerPedido(usuario);

    res.json({
      success: true,
      puede_pedir: verificacion.puede,
      mensaje: verificacion.mensaje || 'Puedes realizar tu pedido'
    });
  } catch (error) {
    next(error);
  }
};

// Obtener mis pedidos
const obtenerMisPedidos = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id_usuario;

    const { data, error } = await supabase
      .from('pedido')
      .select(`
        *,
        linea_pedido (
          *,
          producto (
            id_producto,
            nombre,
            precio
          )
        ),
        transaccion (
          id_transaccion,
          importe,
          metodo_pago,
          referencia_pago
        )
      `)
      .eq('id_usuario', usuarioId)
      .order('fecha_pago', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      cantidad: data.length,
      pedidos: data
    });
  } catch (error) {
    next(error);
  }
};

// Obtener todos los pedidos (admin)
const obtenerTodos = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('pedido')
      .select(`
        *,
        usuario (
          id_usuario,
          nombre,
          apellidos,
          curso,
          rol
        ),
        linea_pedido (
          *,
          producto (
            id_producto,
            nombre,
            precio
          )
        ),
        transaccion (
          id_transaccion,
          importe,
          metodo_pago,
          referencia_pago
        )
      `)
      .order('fecha_pago', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      cantidad: data.length,
      pedidos: data
    });
  } catch (error) {
    next(error);
  }
};

// Obtener pedidos por fecha (admin)
const obtenerPorFecha = async (req, res, next) => {
  try {
    const { fecha } = req.params;

    // Crear rango de fecha (todo el día)
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(0, 0, 0, 0);
    
    const fechaFin = new Date(fecha);
    fechaFin.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('pedido')
      .select(`
        *,
        usuario (
          id_usuario,
          nombre,
          apellidos,
          curso,
          rol
        ),
        linea_pedido (
          *,
          producto (
            id_producto,
            nombre,
            precio
          )
        )
      `)
      .gte('fecha_pago', fechaInicio.toISOString())
      .lte('fecha_pago', fechaFin.toISOString())
      .order('fecha_pago', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      fecha,
      cantidad: data.length,
      pedidos: data
    });
  } catch (error) {
    next(error);
  }
};

// Crear pedido
const crearPedido = async (req, res, next) => {
  try {
    const { lineas } = req.body; // lineas = [{ id_producto, cantidad }, ...]
    const usuario = req.usuario;

    // Verificar horario
    const verificacion = puedeHacerPedido(usuario);
    if (!verificacion.puede) {
      return res.status(400).json({
        success: false,
        error: verificacion.mensaje
      });
    }

    // Obtener productos para calcular total
    const idsProductos = lineas.map(l => l.id_producto);
    const { data: productos, error: errorProductos } = await supabase
      .from('producto')
      .select('*')
      .in('id_producto', idsProductos);

    if (errorProductos) throw errorProductos;

    // Verificar que todos los productos existen y están disponibles
    const productosMap = {};
    productos.forEach(p => {
      productosMap[p.id_producto] = p;
    });

    for (const linea of lineas) {
      const producto = productosMap[linea.id_producto];
      if (!producto) {
        return res.status(400).json({
          success: false,
          error: `Producto con ID ${linea.id_producto} no existe`
        });
      }
      if (!producto.disponible) {
        return res.status(400).json({
          success: false,
          error: `Producto "${producto.nombre}" no está disponible`
        });
      }
    }

    // Calcular total
    let total = 0;
    lineas.forEach(linea => {
      const producto = productosMap[linea.id_producto];
      total += producto.precio * linea.cantidad;
    });

    // Crear pedido
    const { data: pedido, error: errorPedido } = await supabase
      .from('pedido')
      .insert([{
        id_usuario: usuario.id_usuario,
        fecha_pago: new Date(),
        total
      }])
      .select()
      .single();

    if (errorPedido) throw errorPedido;

    // Crear líneas de pedido
    const lineasPedido = lineas.map(linea => ({
      id_pedido: pedido.id_pedido,
      id_producto: linea.id_producto,
      cantidad: linea.cantidad,
      precio_unitario: productosMap[linea.id_producto].precio
    }));

    const { error: errorLineas } = await supabase
      .from('linea_pedido')
      .insert(lineasPedido);

    if (errorLineas) throw errorLineas;

    // Crear transacción (simulada como tarjeta de crédito)
    const { error: errorTransaccion } = await supabase
      .from('transaccion')
      .insert([{
        id_pedido: pedido.id_pedido,
        importe: total,
        metodo_pago: 'tarjeta_credito',
        referencia_pago: `REF-${Date.now()}-${pedido.id_pedido}` // Referencia simulada
      }]);

    if (errorTransaccion) throw errorTransaccion;

    // Obtener pedido completo
    const { data: pedidoCompleto } = await supabase
      .from('pedido')
      .select(`
        *,
        linea_pedido (
          *,
          producto (
            id_producto,
            nombre,
            precio
          )
        ),
        transaccion (
          id_transaccion,
          importe,
          metodo_pago,
          referencia_pago
        )
      `)
      .eq('id_pedido', pedido.id_pedido)
      .single();

    res.status(201).json({
      success: true,
      mensaje: 'Pedido creado exitosamente. Se ha enviado a imprimir el ticket.',
      pedido: pedidoCompleto
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verificarHorario,
  obtenerMisPedidos,
  obtenerTodos,
  obtenerPorFecha,
  crearPedido
};