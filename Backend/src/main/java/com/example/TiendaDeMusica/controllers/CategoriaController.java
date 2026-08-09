package com.example.TiendaDeMusica.controllers;

import com.example.TiendaDeMusica.entities.Categoria;
import com.example.TiendaDeMusica.services.CategoriaServiceImpl;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/categoria")
public class CategoriaController extends BaseControllerImpl<Categoria, CategoriaServiceImpl>{
    public CategoriaController(CategoriaServiceImpl service) {
        super(service);
    }
}

