package com.example.TrabajoPractico9.controllers;

import com.example.TrabajoPractico9.entities.Usuario;
import com.example.TrabajoPractico9.services.UsuarioServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/usuario")
public class UsuarioController extends BaseControllerImpl<Usuario, UsuarioServiceImpl>{
    private UsuarioServiceImpl service;
    public UsuarioController(UsuarioServiceImpl service) {
        super(service);
    }
}
