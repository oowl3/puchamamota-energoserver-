interface UserData {
  nombre?: string;
  apellido?: string;
  edad?: number | string;
  genero?: string;
  telefono?: string;
}

export function isUserDataIncomplete(user: UserData) {
  return (
    !user.nombre ||
    !user.apellido ||
    user.edad === '0' ||
    user.genero === 'desconocido' ||
    !user.telefono
  );
}