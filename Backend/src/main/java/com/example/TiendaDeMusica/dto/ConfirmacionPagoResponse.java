package com.example.TiendaDeMusica.dto;

public record ConfirmacionPagoResponse(Long pedidoId, String estadoPedido, String estadoPagoMercadoPago) {
}
