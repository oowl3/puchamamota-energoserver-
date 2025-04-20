export function isUserDataIncomplete(user: any) {
    return (
      !user.nombre ||
      !user.apellido ||
      user.edad === '0' ||
      user.genero === 'desconocido' ||
      !user.telefono
    );
  }
  