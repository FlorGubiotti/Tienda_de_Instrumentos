import Pedido from "../entities/Pedido";
import BaseService, { fetchConAuth } from "./BaseService";

const API_URL = import.meta.env.VITE_API_URL;

export default class PedidoService extends BaseService<Pedido>{

    async getDatosChartBar() {
        const response = await fetchConAuth(`${API_URL}pedido/barchart`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });
        return await response.json();
    }

    async getDatosChartPie() {
        const response = await fetchConAuth(`${API_URL}pedido/piechart`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });
        return await response.json();
    }

    async generarReporteExcel(fechaDesde: Date, fechaHasta: Date){
        const urlServer = `${API_URL}pedido/downloadExcel?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
        await fetchConAuth(urlServer, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });
    }
}
