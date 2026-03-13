const puedeHacerPedido = (usuario) => {
  // Si es profesor/pas o admin, puede pedir siempre
  if (usuario.rol === 'profesor_pas' || usuario.rol === 'admin') {
    return { puede: true };
  }

  const ahora = new Date();
  const horaActual = ahora.getHours();
  const minutosActuales = ahora.getMinutes();
  const tiempoEnMinutos = horaActual * 60 + minutosActuales;

  const horarios = {
    manana: {
      inicio: 8 * 60,      // 08:00
      fin: 14 * 60,        // 14:00
      nombre: 'mañana'
    },
    tarde: {
      inicio: 14 * 60 + 30, // 14:30
      fin: 20 * 60 + 30,    // 20:30
      nombre: 'tarde'
    },
    noche: {
      inicio: 23 * 60,      // 23:00
      fin: 6 * 60,          // 06:00 (del día siguiente)
      nombre: 'noche'
    }
  };

  const turnoUsuario = horarios[usuario.turno];

  if (!turnoUsuario) {
    return {
      puede: false,
      mensaje: 'Turno no válido'
    };
  }

  // Turno noche es especial (cruza medianoche)
  if (usuario.turno === 'noche') {
    // Puede pedir de 06:00 a 23:00
    const dentroHorario = tiempoEnMinutos >= 6 * 60 && tiempoEnMinutos < 23 * 60;
    
    if (dentroHorario) {
      return { puede: true };
    } else {
      return {
        puede: false,
        mensaje: `No puedes hacer pedidos durante tu horario escolar (23:00 - 06:00). Puedes pedir de 06:00 a 23:00.`
      };
    }
  }

  // Para turnos mañana y tarde
  const dentroHorario = tiempoEnMinutos >= turnoUsuario.inicio && tiempoEnMinutos < turnoUsuario.fin;

  if (dentroHorario) {
    return {
      puede: false,
      mensaje: `No puedes hacer pedidos durante tu horario escolar (${turnoUsuario.nombre}). Intenta antes o después de tu turno.`
    };
  }

  return { puede: true };
};

module.exports = { puedeHacerPedido };
