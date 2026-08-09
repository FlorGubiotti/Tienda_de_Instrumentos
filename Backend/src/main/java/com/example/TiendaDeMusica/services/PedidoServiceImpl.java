package com.example.TiendaDeMusica.services;

import com.example.TiendaDeMusica.entities.Pedido;
import com.example.TiendaDeMusica.repositories.BaseRepository;
import com.example.TiendaDeMusica.repositories.PedidoRepository;
import org.springframework.stereotype.Service;

@Service
public class PedidoServiceImpl extends BaseServiceImpl<Pedido, Long> implements PedidoService {

    public PedidoServiceImpl(PedidoRepository pedidoRepository) {
        super((BaseRepository<Pedido, Long>) pedidoRepository);
    }
}
