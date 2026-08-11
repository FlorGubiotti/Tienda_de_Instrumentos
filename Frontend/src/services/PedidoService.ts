import Pedido from "../entities/Pedido";
import BaseService, { fetchConAuth } from "./BaseService";

export default class PedidoService extends BaseService<Pedido>{

    async getDatosChartBar() {
        const urlServer = 'http://localhost:8080/api/pedido/barchart';
        const response = await fetchConAuth(urlServer, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });
        return await response.json();
    }

    async getDatosChartPie() {
        const urlServer = 'http://localhost:8080/api/pedido/piechart';
        const response = await fetchConAuth(urlServer, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });
        return await response.json();
    }

    async generarReporteExcel(fechaDesde: Date, fechaHasta: Date){
        const urlServer = `http://localhost:8080/api/pedido/downloadExcel?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
        await fetchConAuth(urlServer, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });
    }
}
