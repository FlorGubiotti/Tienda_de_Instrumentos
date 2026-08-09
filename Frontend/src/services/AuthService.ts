export interface Sesion {
  token: string;
  nombreUsuario: string;
  rol: string;
}

export async function login(nombreUsuario: string, clave: string): Promise<Sesion> {
  const url = import.meta.env.VITE_API_URL + "auth/login";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombreUsuario, clave }),
  });

  if (!response.ok) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  return response.json();
}
