package com.example.TiendaDeMusica.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
public class ChartManager {

    private static final DateTimeFormatter FORMATO_MES_ANIO = DateTimeFormatter.ofPattern("yyyy-MM");

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /*
     * Las dos consultas se limitan a pedidos PAGADO: un pedido PENDIENTE es un
     * checkout que se abrió camino a Mercado Pago y nunca se completó (por
     * ejemplo, el usuario cierra la pestaña), y uno RECHAZADO es un pago que
     * Mercado Pago no aprobó. Ninguno de los dos es una venta real, así que no
     * tienen que sumar en gráficos que informan estadísticas de ventas.
     */

    /*
     * El agrupado por mes se hace en Java, no en SQL: DATE_FORMAT es de MySQL
     * y H2 (usado en el deploy) no la reconoce ni siquiera en modo de
     * compatibilidad. Traer la fecha cruda y agruparla acá funciona igual en
     * las dos bases.
     */
    public List<Map<String, Object>> getDatosChartBar() {
        String sql = "SELECT p.fecha AS fecha FROM pedido p WHERE p.estado = 'PAGADO'";
        List<Map<String, Object>> filas = jdbcTemplate.queryForList(sql);

        Map<String, Long> conteoPorMes = new TreeMap<>();
        for (Map<String, Object> fila : filas) {
            String mesAnio = aLocalDateTime(fila.get("fecha")).format(FORMATO_MES_ANIO);
            conteoPorMes.merge(mesAnio, 1L, Long::sum);
        }

        List<Map<String, Object>> resultado = new ArrayList<>();
        for (Map.Entry<String, Long> entry : conteoPorMes.entrySet()) {
            Map<String, Object> fila = new LinkedHashMap<>();
            fila.put("mes_anio", entry.getKey());
            fila.put("cantidad_pedidos", entry.getValue());
            resultado.add(fila);
        }
        return resultado;
    }

    /*
     * El driver de MySQL devuelve la columna como LocalDateTime; el de H2, como
     * Timestamp. Se acepta cualquiera de los dos en vez de asumir uno solo.
     */
    private static LocalDateTime aLocalDateTime(Object valor) {
        if (valor instanceof Timestamp) {
            return ((Timestamp) valor).toLocalDateTime();
        }
        if (valor instanceof LocalDateTime) {
            return (LocalDateTime) valor;
        }
        throw new IllegalStateException("Tipo de fecha inesperado: " + valor.getClass());
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
