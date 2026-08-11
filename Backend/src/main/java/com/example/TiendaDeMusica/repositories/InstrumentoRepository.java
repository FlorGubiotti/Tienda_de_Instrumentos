package com.example.TiendaDeMusica.repositories;

import com.example.TiendaDeMusica.entities.Instrumento;

import java.util.List;

public interface InstrumentoRepository extends BaseRepository<Instrumento, Long>{

    List<Instrumento> findByActivoTrue();
}
