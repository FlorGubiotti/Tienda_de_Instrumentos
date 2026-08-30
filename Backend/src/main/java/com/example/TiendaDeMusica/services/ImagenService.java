package com.example.TiendaDeMusica.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class ImagenService {

    private static final Logger logger = LoggerFactory.getLogger(ImagenService.class);

    /** No se valida por contentType solo: el navegador lo manda, pero es fácil de falsear. */
    private static final Set<String> EXTENSIONES_PERMITIDAS = Set.of("jpg", "jpeg", "png", "webp", "gif");
    private static final long TAMANO_MAXIMO_BYTES = 5L * 1024 * 1024;

    @Value("${app.uploads-dir}")
    private String uploadsDir;

    private Path carpetaDestino;

    @PostConstruct
    void inicializar() throws IOException {
        carpetaDestino = Path.of(uploadsDir).toAbsolutePath().normalize();
        Files.createDirectories(carpetaDestino);
    }

    /**
     * Guarda la imagen con un nombre nuevo generado acá (nunca el que mandó el
     * cliente): evita tanto colisiones entre instrumentos distintos como que
     * un nombre de archivo manipulado escriba fuera de la carpeta de subida.
     */
    public String guardar(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("No se recibió ningún archivo.");
        }
        if (archivo.getSize() > TAMANO_MAXIMO_BYTES) {
            throw new IllegalArgumentException("La imagen no puede superar los 5 MB.");
        }

        String extension = extraerExtension(archivo.getOriginalFilename());
        if (!EXTENSIONES_PERMITIDAS.contains(extension)) {
            throw new IllegalArgumentException(
                    "Formato de imagen no soportado. Usá jpg, png, webp o gif.");
        }

        String nombreArchivo = UUID.randomUUID() + "." + extension;

        try {
            Files.copy(archivo.getInputStream(), carpetaDestino.resolve(nombreArchivo));
        } catch (IOException e) {
            logger.error("Error guardando la imagen subida", e);
            throw new RuntimeException("No se pudo guardar la imagen.", e);
        }

        return nombreArchivo;
    }

    /** La imagen de un instrumento puede estar en la carpeta de subidas o venir de las semillas del proyecto. */
    public Path resolverRutaSiExiste(String nombreArchivo) {
        Path ruta = carpetaDestino.resolve(nombreArchivo).normalize();
        return (ruta.startsWith(carpetaDestino) && Files.exists(ruta)) ? ruta : null;
    }

    private String extraerExtension(String nombreOriginal) {
        if (nombreOriginal == null) {
            return "";
        }
        int puntoFinal = nombreOriginal.lastIndexOf('.');
        if (puntoFinal < 0 || puntoFinal == nombreOriginal.length() - 1) {
            return "";
        }
        return nombreOriginal.substring(puntoFinal + 1).toLowerCase(Locale.ROOT);
    }
}
