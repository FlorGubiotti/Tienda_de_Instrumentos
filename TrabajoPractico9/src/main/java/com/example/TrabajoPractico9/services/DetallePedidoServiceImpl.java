package com.example.TrabajoPractico9.services;

import com.example.TrabajoPractico9.entities.DetallePedido;
import com.example.TrabajoPractico9.repositories.BaseRepository;
import com.example.TrabajoPractico9.repositories.DetallePedidoRepository;
import org.springframework.stereotype.Service;

@Service
public class DetallePedidoServiceImpl extends BaseServiceImpl<DetallePedido, Long> implements DetallePedidoService {

    private DetallePedidoRepository detallePedidoRepository;

    public DetallePedidoServiceImpl(DetallePedidoRepository detallePedidoRepository) {
        super((BaseRepository<DetallePedido, Long>) detallePedidoRepository);
        this.detallePedidoRepository = detallePedidoRepository;
    }
}
