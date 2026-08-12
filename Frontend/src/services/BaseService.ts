// Importación de la clase abstracta AbstractBackendClient

import PreferenceMP from "../entities/MercadoPago/PreferenceMP";
import CrearPreferenciaRequest from "../entities/MercadoPago/CrearPreferenciaRequest";
import { AbstractBaseService } from "./AbstractBaseService";
import { cerrarSesionYRedirigir, obtenerSesion } from "./sesion";

// Arma el header Authorization a partir de la sesión vigente, si hay una
export function authHeader(): Record<string, string> {
  const sesion = obtenerSesion();
  return sesion ? { Authorization: `Bearer ${sesion.token}` } : {};
}

/**
 * fetch con el header de autenticación puesto. El backend responde 401 cuando no
 * hay credenciales válidas (token ausente, vencido o inválido): ahí se cierra la
 * sesión y se manda al login. El 403 es falta de permisos por rol, con sesión
 * perfectamente válida, así que no desloguea a nadie.
 */
export async function fetchConAuth(path: string, options: RequestInit = {}): Promise<Response> {
  const response = await fetch(path, {
    ...options,
    headers: { ...(options.headers ?? {}), ...authHeader() },
  });

  if (response.status === 401) {
    cerrarSesionYRedirigir();
  }

  return response;
}

// Clase abstracta que proporciona métodos genéricos para interactuar con una API
export default abstract class BaseService<T> extends AbstractBaseService<T> {
  // Método protegido para realizar una solicitud genérica
  protected async request(path: string, options: RequestInit): Promise<T> {
    try {
      // Realiza una solicitud fetch con la ruta y las opciones proporcionadas
      const response = await fetchConAuth(path, options);
      // Verifica si la respuesta es exitosa
      if (!response.ok) {
        // Si no es exitosa, lanza un error con el mensaje de estado de la respuesta
        throw new Error(response.statusText);
      }
      // Retorna los datos de la respuesta en formato JSON
      return response.json();
    } catch (error) {
      // Si hay algún error, rechaza la promesa con el error
      return Promise.reject(error);
    }
  }

  // Método protegido para realizar una solicitud genérica para obtener todos los elementos
  protected async requestAll(path: string, options: RequestInit): Promise<T[]> {
    try {
      const response = await fetchConAuth(path, options);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // Implementación de los métodos de la interfaz AbstractCrudService

  // Método para obtener un elemento por su ID
  async get(url: string, id: number): Promise<T> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "GET",
    };
    return this.request(path, options);
  }

  // Método para obtener todos los elementos
  async getAll(url: string): Promise<T[]> {
    const path = url;
    const options: RequestInit = {
      method: "GET",
    };
    return this.requestAll(path, options);
  }

  // Método para crear un nuevo elemento
  async post(url: string, data: T): Promise<T> {
    const path = url;
    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    return this.request(path, options);
  }

  // Método para actualizar un elemento existente por su ID
  async put(url: string, id: number, data: T): Promise<T> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    return this.request(path, options);
  }

  // Método para eliminar un elemento por su ID
  async delete(url: string, id: number): Promise<void> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      await fetchConAuth(path, options);
    } catch (error) {
      console.error("Error al eliminar el elemento:", error);
      throw new Error("Error al eliminar el elemento");
    }
  }

  async saveWithFile(url: string, formData: FormData): Promise<string> {
    try {
        const response = await fetchConAuth(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error al guardar la imagen del instrumento: ${response.statusText}`);
        }

        return response.text(); // Devuelve la respuesta del servidor
    } catch (error) {
        throw new Error(`Error al guardar la imagen del instrumento`);
    }
  }

  async createPreferenceMP(request: CrearPreferenciaRequest): Promise<PreferenceMP> {
    const urlServer = `${import.meta.env.VITE_API_URL}mercado_pago/create_preference`;
    try {
      const response = await fetchConAuth(urlServer, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request)
      });
      if (!response.ok) {
        throw new Error(`Error al crear preferencia de Mercado Pago: ${response.statusText}`);
      }
      const responseData = await response.json();
      return responseData as PreferenceMP;
    } catch (error) {
      console.error('Error en createPreferenceMP:', error);
      throw error;
    }
  }

  

}
