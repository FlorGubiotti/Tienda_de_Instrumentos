package com.example.TrabajoPractico9.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ChartManager {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> getDatosChartBar() {
        String sql = "SELECT DATE_FORMAT(p.fecha, '%Y-%m') AS mes_anio, COUNT(p.id) AS cantidad_pedidos " +
                "FROM pedido p " +
                "GROUP BY mes_anio " +
                "ORDER BY mes_anio";

        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> getDatosChartPie() {
        String sql = "SELECT i.instrumento AS instrumento, COUNT(dp.id) AS cantidad " +
                "FROM detalle_pedido dp " +
                "JOIN instrumento i ON dp.id_instrumento = i.id " +
                "GROUP BY i.instrumento " +
                "ORDER BY cantidad DESC";

        return jdbcTemplate.queryForList(sql);
    }
}
