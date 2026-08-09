package com.example.TiendaDeMusica.controllers;

import com.example.TiendaDeMusica.entities.Instrumento;
import com.example.TiendaDeMusica.services.InstrumentoServiceImpl;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/instrumentos")
public class InstrumentoController extends BaseControllerImpl<Instrumento, InstrumentoServiceImpl> {
    public InstrumentoController(InstrumentoServiceImpl service) {
        super(service);
    }
}
