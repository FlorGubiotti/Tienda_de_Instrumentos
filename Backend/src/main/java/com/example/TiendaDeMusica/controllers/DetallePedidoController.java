package com.example.TiendaDeMusica.controllers;

import com.example.TiendaDeMusica.entities.DetallePedido;
import com.example.TiendaDeMusica.services.DetallePedidoServiceImpl;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/detallePedido")
public class DetallePedidoController extends BaseControllerImpl<DetallePedido, DetallePedidoServiceImpl>{

    public DetallePedidoController(DetallePedidoServiceImpl service) {
        super(service);
    }
}
