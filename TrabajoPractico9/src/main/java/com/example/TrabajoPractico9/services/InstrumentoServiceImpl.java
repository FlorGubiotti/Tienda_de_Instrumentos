package com.example.TrabajoPractico9.services;

import com.example.TrabajoPractico9.entities.Instrumento;
import com.example.TrabajoPractico9.repositories.BaseRepository;
import com.example.TrabajoPractico9.repositories.InstrumentoRepository;
import org.springframework.stereotype.Service;

@Service
public class InstrumentoServiceImpl extends BaseServiceImpl<Instrumento, Long> implements InstrumentoService {

    private InstrumentoRepository instrumentoRepository;

    public InstrumentoServiceImpl(InstrumentoRepository instrumentoRepository) {
        super((BaseRepository<Instrumento, Long>) instrumentoRepository);
        this.instrumentoRepository = instrumentoRepository;
    }
}
