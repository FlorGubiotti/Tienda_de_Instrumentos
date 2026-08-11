package com.example.TiendaDeMusica.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PreferenceMP{

    private String id;
    private int statusCode;
    private Long pedidoId;
}
