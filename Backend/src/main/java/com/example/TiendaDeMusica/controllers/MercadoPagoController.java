package com.example.TiendaDeMusica.controllers;

import com.example.TiendaDeMusica.dto.ConfirmacionPagoResponse;
import com.example.TiendaDeMusica.dto.CrearPreferenciaRequest;
import com.example.TiendaDeMusica.entities.PreferenceMP;
import com.example.TiendaDeMusica.services.MercadoPagoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mercado_pago")
public class MercadoPagoController {

    private final MercadoPagoService mercadoPagoService;

    public MercadoPagoController(MercadoPagoService mercadoPagoService) {
        this.mercadoPagoService = mercadoPagoService;
    }

    @PostMapping("/create_preference")
    public ResponseEntity<?> createPreference(@RequestBody CrearPreferenciaRequest request) {
        PreferenceMP preference = mercadoPagoService.createPreference(request);
        if (preference == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"No se pudo crear la preferencia de pago.\"}");
        }
        return ResponseEntity.ok(preference);
    }

    @PostMapping("/confirmar/{paymentId}")
    public ResponseEntity<?> confirmarPago(@PathVariable Long paymentId) {
        ConfirmacionPagoResponse confirmacion = mercadoPagoService.confirmarPago(paymentId);
        return ResponseEntity.ok(confirmacion);
    }
}
