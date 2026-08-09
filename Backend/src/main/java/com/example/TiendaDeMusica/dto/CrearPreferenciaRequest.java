package com.example.TiendaDeMusica.dto;

import java.util.List;

public record CrearPreferenciaRequest(String titulo, List<ItemPedidoRequest> items) {
}
