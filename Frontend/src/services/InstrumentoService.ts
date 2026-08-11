import Instrumento from "../entities/Instrumento";
import BaseService, { fetchConAuth } from "./BaseService";

export default class InstrumentoService extends BaseService<Instrumento>{

    /** Listado de administración: incluye los instrumentos dados de baja. */
    async getTodos(url: string): Promise<Instrumento[]> {
        const response = await fetchConAuth(`${url}/todos`, { method: "GET" });
        if (!response.ok) {
            throw new Error("No se pudieron obtener los instrumentos dados de baja");
        }
        return response.json();
    }

    async reactivar(url: string, id: number): Promise<Instrumento> {
        const response = await fetchConAuth(`${url}/${id}/reactivar`, { method: "PUT" });
        if (!response.ok) {
            throw new Error("No se pudo reactivar el instrumento");
        }
        return response.json();
    }
}
