package com.example.TiendaDeMusica.controllers;

import com.example.TiendaDeMusica.entities.Categoria;
import com.example.TiendaDeMusica.services.CategoriaServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/categoria")
public class CategoriaController extends BaseControllerImpl<Categoria, CategoriaServiceImpl>{
    private CategoriaServiceImpl service;
    public CategoriaController(CategoriaServiceImpl service) {
        super(service);
    }
}

