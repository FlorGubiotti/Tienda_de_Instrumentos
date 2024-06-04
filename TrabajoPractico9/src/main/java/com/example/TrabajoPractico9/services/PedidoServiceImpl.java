package com.example.TrabajoPractico9.services;

import com.example.TrabajoPractico9.entities.Pedido;
import com.example.TrabajoPractico9.repositories.BaseRepository;
import com.example.TrabajoPractico9.repositories.PedidoRepository;
import org.springframework.stereotype.Service;

@Service
public class PedidoServiceImpl extends BaseServiceImpl<Pedido, Long> implements PedidoService {

    private PedidoRepository pedidoRepository;

    public PedidoServiceImpl(PedidoRepository pedidoRepository) {
        super((BaseRepository<Pedido, Long>) pedidoRepository);
        this.pedidoRepository = pedidoRepository;
    }
}
