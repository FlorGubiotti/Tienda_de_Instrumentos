import Pedido from "../entities/Pedido";
import BaseService from "./BaseService";

export default class PedidoService extends BaseService<Pedido>{

    async getDatosChartBar() {
        const urlServer = 'http://localhost:8080/api/pedido/barchart';
        const response = await fetch(urlServer, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            mode: 'cors'
        });
        console.log(response);
        return await response.json();
    }

    async getDatosChartPie() {
        const urlServer = 'http://localhost:8080/api/pedido/piechart';
        const response = await fetch(urlServer, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            mode: 'cors'
        });
        console.log(response);
        return await response.json();
    }
    
    async generarReporteExcel(fechaDesde: Date, fechaHasta: Date){
        let urlServer = `http://localhost:8080/api/pedido/downloadExcel?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
        await fetch(urlServer, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin':'*'
            },
            mode: 'cors'
        });
    }
}