import PreferenceMP from "../entities/MercadoPago/PreferenceMP";
import Pedido from "../entities/Pedido";

// Clase abstracta que define métodos para operaciones CRUD en un servicio genérico
export abstract class AbstractBaseService<T> {
  // Método abstracto para obtener un elemento por su ID
  abstract get(url: string, id: number): Promise<T>;

  // Método abstracto para obtener todos los elementos
  abstract getAll(url: string): Promise<T[]>;

  // Método abstracto para crear un nuevo elemento
  abstract post(url: string, data: T): Promise<T>;

  // Método abstracto para actualizar un elemento existente por su ID
  abstract put(url: string, id: number, data: T): Promise<T>;

  // Método abstracto para eliminar un elemento por su ID
  abstract delete(url: string, id: number): Promise<void>;

  abstract saveWithFile(url: string, formData: FormData): Promise<string>;

  // Método abstracto para crear una preferencia de Mercado Pago
  abstract createPreferenceMP(pedido?: Pedido): Promise<PreferenceMP>;

}
