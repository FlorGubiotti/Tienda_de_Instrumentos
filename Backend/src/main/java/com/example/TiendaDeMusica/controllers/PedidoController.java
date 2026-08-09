package com.example.TiendaDeMusica.controllers;

import com.example.TiendaDeMusica.entities.Pedido;
import com.example.TiendaDeMusica.services.*;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping(path = "api/pedido")
public class PedidoController extends  BaseControllerImpl<Pedido, PedidoServiceImpl>{

    private final ChartManager chartManager;
    private final PedidoPrintManager pedidoPrintManager;
    private final InstrumentoPrintManager instrumentoPrintManager;

    public PedidoController(
            PedidoServiceImpl service,
            ChartManager chartManager,
            PedidoPrintManager pedidoPrintManager,
            InstrumentoPrintManager instrumentoPrintManager) {
        super(service);
        this.chartManager = chartManager;
        this.pedidoPrintManager = pedidoPrintManager;
        this.instrumentoPrintManager = instrumentoPrintManager;
    }

    @GetMapping("/barchart")
    public List<List<Object>> getBarChartData() {
        List<List<Object>> data = new ArrayList<>();
        data.add(Arrays.asList("Mes/Año", "Cantidad de Pedidos"));

        List<Map<String, Object>> datos = chartManager.getDatosChartBar();
        for (Map<String, Object> row : datos) {
            data.add(Arrays.asList(row.get("mes_anio"), row.get("cantidad_pedidos")));
        }
        return data;
    }

    @GetMapping("/piechart")
    public List<List<Object>> getPieChartData() {
        List<List<Object>> data = new ArrayList<>();
        data.add(Arrays.asList("Instrumento", "Cantidad de Pedidos"));

        List<Map<String, Object>> datos = chartManager.getDatosChartPie();
        for (Map<String, Object> row : datos) {
            data.add(Arrays.asList(row.get("instrumento"), row.get("cantidad")));
        }
        return data;
    }

    @GetMapping("/downloadExcel")
    public ResponseEntity<byte[]> downloadExcelPedidos(
            @RequestParam("fechaDesde") @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaDesde,
            @RequestParam("fechaHasta") @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaHasta) {
        try {
            SXSSFWorkbook libroExcel = pedidoPrintManager.imprimirExcelPedidos(fechaDesde, fechaHasta);
            // Escribir el libro de trabajo en un flujo de bytes
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            libroExcel.write(outputStream);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "datos.xlsx");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);

        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/downloadPdf/{idInstrumento}")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable String idInstrumento) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            // Crear un nuevo documento
            instrumentoPrintManager.imprimirInstrumentoPdf(Long.parseLong(idInstrumento), outputStream);

            // Establecer las cabeceras de la respuesta
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/pdf"));
            headers.setContentDispositionFormData("attachment", "documento.pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            // Devolver el archivo PDF como parte de la respuesta HTTP
            return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
