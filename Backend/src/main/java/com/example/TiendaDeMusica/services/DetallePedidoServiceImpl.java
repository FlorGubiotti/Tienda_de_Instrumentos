package com.example.TiendaDeMusica.services;

import com.example.TiendaDeMusica.entities.DetallePedido;
import com.example.TiendaDeMusica.repositories.BaseRepository;
import com.example.TiendaDeMusica.repositories.DetallePedidoRepository;
import org.springframework.stereotype.Service;

@Service
public class DetallePedidoServiceImpl extends BaseServiceImpl<DetallePedido, Long> implements DetallePedidoService {

    public DetallePedidoServiceImpl(DetallePedidoRepository detallePedidoRepository) {
        super((BaseRepository<DetallePedido, Long>) detallePedidoRepository);
    }
}
