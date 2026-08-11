export interface Sesion {
  token: string;
  nombreUsuario: string;
  rol: string;
}

const CLAVE_SESION = 'usuario';

/** Lee el payload del JWT. No valida la firma: eso lo hace el backend. */
function leerPayload(token: string): { exp?: number } | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function tokenExpirado(token: string): boolean {
  const payload = leerPayload(token);
  if (!payload?.exp) {
    // Si no se puede leer la expiración, se trata al token como no utilizable
    return true;
  }
  // exp viene en segundos
  return payload.exp * 1000 <= Date.now();
}

/** Devuelve la sesión guardada, o null si no hay o si el token ya venció. */
export function obtenerSesion(): Sesion | null {
  const json = localStorage.getItem(CLAVE_SESION);
  if (!json) {
    return null;
  }
  try {
    const sesion = JSON.parse(json) as Sesion;
    if (!sesion?.token || tokenExpirado(sesion.token)) {
      localStorage.removeItem(CLAVE_SESION);
      return null;
    }
    return sesion;
  } catch {
    localStorage.removeItem(CLAVE_SESION);
    return null;
  }
}

export function guardarSesion(sesion: Sesion): void {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

export function cerrarSesion(): void {
  localStorage.removeItem(CLAVE_SESION);
}

/** Cierra la sesión y manda al login. Se usa cuando el backend rechaza el token. */
export function cerrarSesionYRedirigir(): void {
  cerrarSesion();
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}
