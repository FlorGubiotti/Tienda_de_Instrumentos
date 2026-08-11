package com.example.TiendaDeMusica.services;

import com.example.TiendaDeMusica.entities.Instrumento;

import java.util.List;

public interface InstrumentoService extends BaseService<Instrumento, Long>{

    List<Instrumento> findAllIncluyendoInactivos();

    Instrumento reactivar(Long id);
}
