package com.example.TiendaDeMusica.controllers;

import com.example.TiendaDeMusica.dto.ImagenSubidaResponse;
import com.example.TiendaDeMusica.entities.Instrumento;
import com.example.TiendaDeMusica.services.ImagenService;
import com.example.TiendaDeMusica.services.InstrumentoServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(path = "api/instrumentos")
public class InstrumentoController extends BaseControllerImpl<Instrumento, InstrumentoServiceImpl> {

    private final ImagenService imagenService;

    public InstrumentoController(InstrumentoServiceImpl service, ImagenService imagenService) {
        super(service);
        this.imagenService = imagenService;
    }

    /** Listado de administración: incluye los dados de baja. */
    @GetMapping("/todos")
    public ResponseEntity<?> getAllIncluyendoInactivos() {
        return ResponseEntity.status(HttpStatus.OK).body(servicio.findAllIncluyendoInactivos());
    }

    @PutMapping("/{id}/reactivar")
    public ResponseEntity<?> reactivar(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(servicio.reactivar(id));
    }

    /**
     * Sube la imagen de un instrumento y devuelve el nombre de archivo generado.
     * El formulario la guarda en Instrumento.imagen recién al confirmar el resto
     * de los datos: subir el archivo no crea ni modifica ningún instrumento.
     */
    @PostMapping("/imagen")
    public ResponseEntity<?> subirImagen(@RequestParam("archivo") MultipartFile archivo) {
        String nombreArchivo = imagenService.guardar(archivo);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ImagenSubidaResponse(nombreArchivo));
    }
}
