package com.example.TiendaDeMusica.services;

import com.example.TiendaDeMusica.entities.Instrumento;
import com.example.TiendaDeMusica.repositories.BaseRepository;
import com.example.TiendaDeMusica.repositories.InstrumentoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InstrumentoServiceImpl extends BaseServiceImpl<Instrumento, Long> implements InstrumentoService {

    private final InstrumentoRepository instrumentoRepository;

    public InstrumentoServiceImpl(InstrumentoRepository instrumentoRepository) {
        super((BaseRepository<Instrumento, Long>) instrumentoRepository);
        this.instrumentoRepository = instrumentoRepository;
    }

    /** El catálogo solo muestra los instrumentos vigentes. */
    @Override
    @Transactional
    public List<Instrumento> findAll() {
        return instrumentoRepository.findByActivoTrue();
    }

    /** Vista de administración: incluye también los dados de baja. */
    @Override
    @Transactional
    public List<Instrumento> findAllIncluyendoInactivos() {
        return instrumentoRepository.findAll();
    }

    /**
     * Baja lógica: se marca como inactivo en vez de borrarlo, así los pedidos que
     * lo incluyen conservan su detalle y los reportes siguen siendo correctos.
     */
    @Override
    @Transactional
    public boolean delete(Long id) {
        Instrumento instrumento = findById(id);
        instrumento.setActivo(false);
        instrumentoRepository.save(instrumento);
        return true;
    }

    @Override
    @Transactional
    public Instrumento reactivar(Long id) {
        Instrumento instrumento = findById(id);
        instrumento.setActivo(true);
        return instrumentoRepository.save(instrumento);
    }
}
