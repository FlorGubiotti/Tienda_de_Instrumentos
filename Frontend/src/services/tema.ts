export type Tema = 'claro' | 'oscuro';

const CLAVE_TEMA = 'tema';

/**
 * Aplica el tema al documento.
 *
 * Se escriben dos atributos: data-tema lo usan nuestros tokens.css, y
 * data-bs-theme lo usa Bootstrap 5.3 para adaptar sus propios componentes
 * (navbar, alerts, modales) sin que tengamos que reescribirlos.
 *
 * Ojo: la misma lógica está duplicada en un script inline en index.html, que
 * corre antes de que monte React para que no se vea un parpadeo claro al
 * entrar en modo oscuro. Si cambia la clave o los atributos, hay que tocar
 * los dos lados.
 */
function aplicar(tema: Tema): void {
  const raiz = document.documentElement;

  /*
   * Las transiciones se apagan durante el cambio. Hay dos motivos:
   *
   * 1. Sin esto, las propiedades con `transition` (el fondo de los botones,
   *    por ejemplo) se quedan con el color del modo anterior hasta recargar:
   *    el navegador no las vuelve a calcular cuando cambia la variable que
   *    las alimenta.
   * 2. Aunque funcionara, ver la página entera haciendo un fundido de color
   *    al alternar el tema queda mal.
   */
  raiz.classList.add('sin-transiciones');

  raiz.setAttribute('data-tema', tema);
  raiz.setAttribute('data-bs-theme', tema === 'oscuro' ? 'dark' : 'light');

  // Fuerza el recálculo con las transiciones ya apagadas, antes de volver a encenderlas
  void raiz.offsetHeight;

  requestAnimationFrame(() => raiz.classList.remove('sin-transiciones'));
}

/** Preferencia guardada, o null si el usuario nunca eligió. */
function temaGuardado(): Tema | null {
  const valor = localStorage.getItem(CLAVE_TEMA);
  return valor === 'claro' || valor === 'oscuro' ? valor : null;
}

/** Lo que pidió el usuario, y si no eligió nada, lo que dice el sistema operativo. */
export function obtenerTema(): Tema {
  const guardado = temaGuardado();
  if (guardado) {
    return guardado;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
}

export function guardarTema(tema: Tema): void {
  localStorage.setItem(CLAVE_TEMA, tema);
  aplicar(tema);
}

/** Cambia al modo contrario y devuelve el que quedó activo. */
export function alternarTema(): Tema {
  const nuevo: Tema = obtenerTema() === 'oscuro' ? 'claro' : 'oscuro';
  guardarTema(nuevo);
  return nuevo;
}

/**
 * Deja el documento sincronizado con la preferencia actual y queda escuchando
 * los cambios del sistema operativo. Solo se sigue al sistema mientras el
 * usuario no haya elegido explícitamente. Devuelve la función para dejar de
 * escuchar.
 *
 * El callback avisa del cambio para que quien dibuje el botón pueda actualizar
 * su ícono: si el sistema pasa a oscuro, el botón tiene que enterarse.
 */
export function iniciarTema(alCambiar?: (tema: Tema) => void): () => void {
  aplicar(obtenerTema());

  const consulta = window.matchMedia('(prefers-color-scheme: dark)');
  const alCambiarElSistema = () => {
    if (temaGuardado()) {
      return;
    }
    const tema = obtenerTema();
    aplicar(tema);
    alCambiar?.(tema);
  };

  consulta.addEventListener('change', alCambiarElSistema);
  return () => consulta.removeEventListener('change', alCambiarElSistema);
}
