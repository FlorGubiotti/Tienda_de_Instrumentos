package com.example.TiendaDeMusica.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ChartManager {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /*
     * Las dos consultas se limitan a pedidos PAGADO: un pedido PENDIENTE es un
     * checkout que se abrió camino a Mercado Pago y nunca se completó (por
     * ejemplo, el usuario cierra la pestaña), y uno RECHAZADO es un pago que
     * Mercado Pago no aprobó. Ninguno de los dos es una venta real, así que no
     * tienen que sumar en gráficos que informan estadísticas de ventas.
     */

    public List<Map<String, Object>> getDatosChartBar() {
        String sql = "SELECT DATE_FORMAT(p.fecha, '%Y-%m') AS mes_anio, COUNT(p.id) AS cantidad_pedidos " +
                "FROM pedido p " +
                "WHERE p.estado = 'PAGADO' " +
                "GROUP BY mes_anio " +
                "ORDER BY mes_anio";

        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> getDatosChartPie() {
        String sql = "SELECT i.instrumento AS instrumento, COUNT(dp.id) AS cantidad " +
                "FROM detalle_pedido dp " +
                "JOIN instrumento i ON dp.id_instrumento = i.id " +
                "JOIN pedido p ON dp.id_pedido = p.id " +
                "WHERE p.estado = 'PAGADO' " +
                "GROUP BY i.instrumento " +
                "ORDER BY cantidad DESC";

        return jdbcTemplate.queryForList(sql);
    }
}
