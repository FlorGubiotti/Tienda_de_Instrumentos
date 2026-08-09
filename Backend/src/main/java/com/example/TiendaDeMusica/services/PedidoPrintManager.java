package com.example.TiendaDeMusica.services;

import com.example.TiendaDeMusica.entities.DetallePedido;
import com.example.TiendaDeMusica.entities.Pedido;
import com.example.TiendaDeMusica.repositories.PedidoRepository;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.xssf.streaming.SXSSFCell;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.springframework.stereotype.Service;

@Service
public class PedidoPrintManager {

    private final PedidoRepository pedidoRepository;

    public PedidoPrintManager(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    public SXSSFWorkbook imprimirExcelPedidos(Date fechaDesde, Date fechaHasta) {
        // Se crea el libro
        SXSSFWorkbook libro = new SXSSFWorkbook(50);
        // Se crea una hoja dentro del libro
        SXSSFSheet hoja = libro.createSheet();
        //estilo
        XSSFFont font = (XSSFFont) libro.createFont();
        font.setBold(true);
        XSSFCellStyle style = (XSSFCellStyle) libro.createCellStyle();
        style.setFont(font);

        // Estilo para las fechas
        CellStyle dateCellStyle = libro.createCellStyle();
        CreationHelper createHelper = libro.getCreationHelper();
        dateCellStyle.setDataFormat(createHelper.createDataFormat().getFormat("dd/MM/yyyy"));


        int nroColumna = 0;
        // Se crea una fila dentro de la hoja
        SXSSFRow row = hoja.createRow(0);
        // Se crea una celda dentro de la fila
        SXSSFCell cell = row.createCell(nroColumna);
        cell.setCellValue("Id");
        cell.setCellStyle(style);
        cell = row.createCell(++nroColumna);
        cell.setCellValue("Fecha Pedido");
        cell.setCellStyle(style);
        cell = row.createCell(++nroColumna);
        cell.setCellValue("Instrumento");
        cell.setCellStyle(style);
        cell = row.createCell(++nroColumna);
        cell.setCellValue("Marca");
        cell.setCellStyle(style);
        cell = row.createCell(++nroColumna);
        cell.setCellValue("Modelo");
        cell.setCellStyle(style);
        cell = row.createCell(++nroColumna);
        cell.setCellValue("Cantidad");
        cell.setCellStyle(style);
        cell = row.createCell(++nroColumna);
        cell.setCellValue("Precio");
        cell.setCellStyle(style);
        cell = row.createCell(++nroColumna);
        cell.setCellValue("Subtotal");
        cell.setCellStyle(style);

        int nroFila = 1;

        List<Pedido> pedidos = getPedidosFromRangeOfDates(fechaDesde, fechaHasta);
        for (Pedido pedido : pedidos) {
            for (DetallePedido detalle : pedido.getDetallePedidos()) {
                nroColumna = 0;
                row = hoja.createRow(nroFila);
                cell = row.createCell(nroColumna);
                cell.setCellValue(pedido.getId());
                cell = row.createCell(++nroColumna);
                cell.setCellValue(pedido.getFecha());
                cell.setCellStyle(dateCellStyle);
                cell = row.createCell(++nroColumna);
                cell.setCellValue(detalle.getInstrumento().getInstrumento());
                cell = row.createCell(++nroColumna);
                cell.setCellValue(detalle.getInstrumento().getMarca());
                cell = row.createCell(++nroColumna);
                cell.setCellValue(detalle.getInstrumento().getModelo());
                cell = row.createCell(++nroColumna);
                cell.setCellValue(detalle.getCantidad());
                cell = row.createCell(++nroColumna);
                BigDecimal precio = detalle.getInstrumento().getPrecio();
                cell.setCellValue(precio.doubleValue());
                cell = row.createCell(++nroColumna);
                BigDecimal subtotal = precio.multiply(BigDecimal.valueOf(detalle.getCantidad()));
                cell.setCellValue(subtotal.doubleValue());
                ++nroFila;
            }
        }
        return libro;
    }

    private List<Pedido> getPedidosFromRangeOfDates(Date fechaDesde, Date fechaHasta) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(fechaHasta);
        cal.add(Calendar.DATE, 1);
        Date fechaHastaIncrementada = cal.getTime();

        return pedidoRepository.findByFechaBetweenWithDetalle(fechaDesde, fechaHastaIncrementada);
    }

}
