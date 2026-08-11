package com.example.TiendaDeMusica.controllers;

import com.example.TiendaDeMusica.entities.Instrumento;
import com.example.TiendaDeMusica.services.InstrumentoServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/instrumentos")
public class InstrumentoController extends BaseControllerImpl<Instrumento, InstrumentoServiceImpl> {

    public InstrumentoController(InstrumentoServiceImpl service) {
        super(service);
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
}
