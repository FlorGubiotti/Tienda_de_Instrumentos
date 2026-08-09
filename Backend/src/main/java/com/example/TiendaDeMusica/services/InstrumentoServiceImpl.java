package com.example.TiendaDeMusica.services;

import com.example.TiendaDeMusica.entities.Instrumento;
import com.example.TiendaDeMusica.repositories.BaseRepository;
import com.example.TiendaDeMusica.repositories.InstrumentoRepository;
import org.springframework.stereotype.Service;

@Service
public class InstrumentoServiceImpl extends BaseServiceImpl<Instrumento, Long> implements InstrumentoService {

    public InstrumentoServiceImpl(InstrumentoRepository instrumentoRepository) {
        super((BaseRepository<Instrumento, Long>) instrumentoRepository);
    }
}
