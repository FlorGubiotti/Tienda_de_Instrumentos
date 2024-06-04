package com.example.TrabajoPractico9.services;

import com.example.TrabajoPractico9.entities.Instrumento;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.*;

@Service
public class InstrumentoPrintManager {

    String urlConexion = "jdbc:mysql://localhost:3306/instrumentosdb";
    String usuario = "root";
    String clave = "***REMOVED_DB_PASSWORD***";

    protected static Font titulo = new Font(Font.HELVETICA, 18, Font.BOLD);
    protected static Font subtitulo = new Font(Font.HELVETICA, 14, Font.BOLD);
    protected static Font texto = new Font(Font.HELVETICA, 12, Font.NORMAL);
    protected static Font textoBold = new Font(Font.HELVETICA, 12, Font.BOLD);

    public static void addMetaData(Document document) {
        document.addTitle("Detalle del Instrumento");
        document.addSubject("Instrumento");
        document.addKeywords("Instrumento, PDF, Detalle");
        document.addAuthor("Flor Gubiotti");
        document.addCreator("Flor Gubiotti");
    }

    public static void addEmptyLine(Document document, int number) {
        try {
            Paragraph espacio = new Paragraph();
            for (int i = 0; i < number; i++) {
                espacio.add(new Paragraph(" "));
            }
            document.add(espacio);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void addEmptyLineToTable(PdfPTable table) {
        PdfPCell emptyCell = new PdfPCell(new Phrase(" "));
        emptyCell.setBorder(Rectangle.NO_BORDER);
        table.addCell(emptyCell);
    }

    private void addCellToTable(PdfPTable table, String header, String value) {
        PdfPCell celdaIzq = new PdfPCell(new Phrase(header, textoBold));
        celdaIzq.setBorder(Rectangle.NO_BORDER);

        PdfPCell celdaDer = new PdfPCell(new Phrase(value, texto));
        celdaDer.setBorder(Rectangle.NO_BORDER);

        // Agrega líneas en blanco solo en la columna derecha
        PdfPCell emptyCell = new PdfPCell(new Phrase(" "));
        emptyCell.setBorder(Rectangle.NO_BORDER);
        if (table.getNumberOfColumns() == 2) {  // Verifica que la tabla tenga 2 columnas (columna derecha)
            emptyCell.setColspan(2);  // Asegúrate de que la celda ocupe las dos columnas
        }

        table.addCell(celdaIzq);
        table.addCell(celdaDer);
        table.addCell(emptyCell);
    }

    public void imprimirInstrumentoPdf(Long idInstrumento, ByteArrayOutputStream outputStream) throws SQLException {
        try {
            Document document = new Document(PageSize.A4, 30, 30, 30, 30);
            addMetaData(document);

            Instrumento instrumento = getInstrumentoById(idInstrumento);

            PdfWriter.getInstance(document, outputStream);
            document.open();

            // Encabezado
            logger.info("Agregando encabezado...");
            PdfPTable tableCabecera = new PdfPTable(1);
            tableCabecera.setWidthPercentage(100f);

            Paragraph Header = new Paragraph("", titulo);
            Header.setAlignment(Paragraph.ALIGN_RIGHT);
            PdfPCell celda = new PdfPCell(Header);
            celda.setBorder(Rectangle.NO_BORDER);
            celda.setHorizontalAlignment(PdfPCell.ALIGN_RIGHT);
            tableCabecera.addCell(celda);

            document.add(tableCabecera);
            logger.info("Encabezado agregado");

            Image imgCabeceraRight = Image.getInstance("https://upload.wikimedia.org/wikipedia/commons/6/67/UTN_logo.jpg");
            imgCabeceraRight.scalePercent(10f);
            imgCabeceraRight.setBorder(Rectangle.NO_BORDER);

            PdfPCell logoUTN = new PdfPCell(imgCabeceraRight);
            logoUTN.setBorder(Rectangle.NO_BORDER);
            logoUTN.setHorizontalAlignment(PdfPCell.ALIGN_RIGHT);

            tableCabecera.addCell(logoUTN);

            document.add(tableCabecera);

            logger.info("Encabezado agregado");

            addEmptyLine(document, 1);

            // Agrega espacio después del encabezado
            addEmptyLine(document, 1);

            // Crear tabla principal con 2 columnas
            PdfPTable mainTable = new PdfPTable(2);
            mainTable.setWidthPercentage(100);
            mainTable.setWidths(new float[]{3f, 2f});

            // Columna izquierda: imagen y descripción
            PdfPTable leftColumn = new PdfPTable(1);
            leftColumn.setWidthPercentage(100);

            // Agregar imagen
            Image imgInstrumento = Image.getInstance("src/main/resources/static/images/" + instrumento.getImagen());
            imgInstrumento.scaleAbsolute(150f, 150f);
            imgInstrumento.setAlignment(Image.ALIGN_CENTER);

            PdfPCell cellImg = new PdfPCell(imgInstrumento);
            cellImg.setBorder(Rectangle.NO_BORDER);
            cellImg.setHorizontalAlignment(PdfPCell.ALIGN_CENTER);
            leftColumn.addCell(cellImg);

            // Agregar descripción
            PdfPCell descriptionCell = new PdfPCell();
            descriptionCell.setBorder(Rectangle.NO_BORDER);
            descriptionCell.addElement(new Paragraph("Descripción:", subtitulo));
            descriptionCell.addElement(new Paragraph(instrumento.getDescripcion(), texto));
            leftColumn.addCell(descriptionCell);

            PdfPCell leftColumnCell = new PdfPCell(leftColumn);
            leftColumnCell.setBorder(Rectangle.NO_BORDER);
            mainTable.addCell(leftColumnCell);

            // Columna derecha: datos
            PdfPTable rightColumn = new PdfPTable(1);
            rightColumn.setWidthPercentage(100);

            addCellToTable(rightColumn, "", String.valueOf(instrumento.getCantidadVendida())+" vendidos");

            // Agregar el título en la columna derecha
            Paragraph tituloInstrumento = new Paragraph(instrumento.getInstrumento().toUpperCase(), titulo);
            tituloInstrumento.setAlignment(Paragraph.ALIGN_LEFT);
            PdfPCell celdaTitulo = new PdfPCell(tituloInstrumento);
            celdaTitulo.setBorder(Rectangle.NO_BORDER);
            celdaTitulo.setHorizontalAlignment(PdfPCell.ALIGN_LEFT);
            rightColumn.addCell(celdaTitulo);

            // Crear una celda que contenga la marca y el modelo
            Phrase marcaModelo = new Phrase();
            marcaModelo.add(new Chunk("\nMarca: ", textoBold));
            marcaModelo.add(new Chunk(instrumento.getMarca(), texto));

            marcaModelo.add(new Chunk("\n\nModelo: ", textoBold));
            marcaModelo.add(new Chunk(instrumento.getModelo(), texto));

            PdfPCell marcaModeloCell = new PdfPCell(marcaModelo);
            marcaModeloCell.setBorder(Rectangle.NO_BORDER);
            rightColumn.addCell(marcaModeloCell);
            addEmptyLineToTable(rightColumn); // Agregar espacio vertical

            Phrase costoCelda;
            if (instrumento.getCostoEnvio().equals("G")) {
                costoCelda = new Phrase("Envío gratis a todo el país", new Font(Font.HELVETICA, 12, Font.NORMAL, Color.GREEN));
            } else {
                costoCelda = new Phrase("Costo de Envio: $" + instrumento.getCostoEnvio(), new Font(Font.HELVETICA, 12, Font.NORMAL, Color.ORANGE));
            }
            PdfPCell costoCeldaPC = new PdfPCell(costoCelda);
            costoCeldaPC.setBorder(Rectangle.NO_BORDER);
            rightColumn.addCell(costoCeldaPC);

            PdfPCell rightColumnCell = new PdfPCell(rightColumn);
            rightColumnCell.setBorder(Rectangle.NO_BORDER);
            mainTable.addCell(rightColumnCell);

            document.add(mainTable);

            document.close();

        } catch (DocumentException | IOException e) {
            e.printStackTrace();
        }
    }

    public Instrumento getInstrumentoById(long idInstrumento) throws SQLException{
        ResultSet rs = null;
        Instrumento instrumento = new Instrumento();
        Connection conexion = null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            conexion = DriverManager.getConnection(urlConexion, usuario, clave);

            Statement s = conexion.createStatement();

            // Se realiza la consulta. Los resultados se guardan en el
            // ResultSet rs
            rs = s.executeQuery("SELECT * from instrumento WHERE id = " + idInstrumento);
            while (rs.next()) {
                instrumento.setId(Long.parseLong(rs.getString("id")));
                instrumento.setInstrumento(rs.getString("instrumento"));
                instrumento.setMarca(rs.getString("marca"));
                instrumento.setModelo(rs.getString("modelo"));
                instrumento.setImagen(rs.getString("imagen"));
                instrumento.setPrecio(rs.getDouble("precio"));
                instrumento.setCostoEnvio(rs.getString("costo_envio"));
                instrumento.setCantidadVendida(rs.getInt("cantidad_vendida"));
                instrumento.setDescripcion(rs.getString("descripcion"));

            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }finally{
            if(conexion != null)
                conexion.close();
        }
        return instrumento;
    }

    private static final Logger logger = LoggerFactory.getLogger(InstrumentoPrintManager.class);

}
