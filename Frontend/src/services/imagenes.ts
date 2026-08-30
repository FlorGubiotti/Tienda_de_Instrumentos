/*
 * Las fotos de instrumento las sirve el backend, no el frontend: así una foto
 * subida desde el formulario aparece en la tienda sin tener que reconstruir
 * ni redesplegar el frontend. /images/** no cuelga de /api/, así que hay que
 * quedarse solo con el origen de VITE_API_URL, no con la URL completa.
 */
const origenBackend = new URL(import.meta.env.VITE_API_URL).origin;

export function urlImagen(nombreArchivo: string): string {
  return `${origenBackend}/images/${nombreArchivo}`;
}
