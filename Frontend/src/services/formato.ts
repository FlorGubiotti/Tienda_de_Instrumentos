const formateadorPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** 850000 -> "$ 850.000". Los precios del catálogo no usan centavos. */
export function formatearPrecio(precio: number): string {
  return formateadorPrecio.format(precio);
}

/*
 * Las denominaciones están guardadas sin tildes. Se corrigen solo al mostrarlas,
 * porque el valor de la base es el que viaja en la URL del filtro.
 */
const NOMBRES_CATEGORIA: Record<string, string> = {
  Percusion: 'Percusión',
  Electronico: 'Electrónico',
};

export function nombreCategoria(denominacion: string): string {
  return NOMBRES_CATEGORIA[denominacion] ?? denominacion;
}
