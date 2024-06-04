package com.example.TrabajoPractico9.controllers;

import com.example.TrabajoPractico9.entities.Pedido;
import com.example.TrabajoPractico9.entities.PreferenceMP;
import com.example.TrabajoPractico9.services.MercadoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mercado_pago")
public class MercadoPagoController {

    @Autowired
    private MercadoPagoService mercadoPagoService;

    @PostMapping("/create_preference")
    public PreferenceMP createPreference(@RequestBody Pedido pedido) {
        return mercadoPagoService.createPreference(pedido);
    }
}
