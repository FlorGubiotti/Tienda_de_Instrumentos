package com.example.TiendaDeMusica.services;

import com.example.TiendaDeMusica.entities.Pedido;
import com.example.TiendaDeMusica.repositories.BaseRepository;
import com.example.TiendaDeMusica.repositories.PedidoRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoServiceImpl extends BaseServiceImpl<Pedido, Long> implements PedidoService {

    private final PedidoRepository pedidoRepository;

    public PedidoServiceImpl(PedidoRepository pedidoRepository) {
        super((BaseRepository<Pedido, Long>) pedidoRepository);
        this.pedidoRepository = pedidoRepository;
    }

    /*
     * El detalle se trae en la misma consulta: la respuesta lo incluye y la sesión
     * ya no sigue abierta durante la serialización.
     */

    @Override
    @Transactional
    public List<Pedido> findAll() {
        return pedidoRepository.findAllWithDetalle();
    }

    @Override
    @Transactional
    public Pedido findById(Long id) {
        return pedidoRepository.findByIdWithDetalle(id)
                .orElseThrow(() -> new EntityNotFoundException("No existe la entidad con id " + id));
    }
}
