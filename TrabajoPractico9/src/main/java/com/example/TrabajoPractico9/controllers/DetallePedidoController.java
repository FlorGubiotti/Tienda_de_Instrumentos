package com.example.TrabajoPractico9.controllers;

import com.example.TrabajoPractico9.entities.DetallePedido;
import com.example.TrabajoPractico9.services.DetallePedidoServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/detallePedido")
public class DetallePedidoController extends BaseControllerImpl<DetallePedido, DetallePedidoServiceImpl>{

    private DetallePedidoServiceImpl service;
    public DetallePedidoController(DetallePedidoServiceImpl service) {
        super(service);
    }
}
