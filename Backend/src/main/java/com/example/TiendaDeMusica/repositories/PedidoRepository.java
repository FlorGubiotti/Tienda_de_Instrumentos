package com.example.TiendaDeMusica.repositories;

import com.example.TiendaDeMusica.entities.Pedido;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends BaseRepository<Pedido, Long>{

    @Query("SELECT DISTINCT p FROM Pedido p " +
            "LEFT JOIN FETCH p.detallePedidos d " +
            "LEFT JOIN FETCH d.instrumento " +
            "WHERE p.fecha BETWEEN :desde AND :hasta")
    List<Pedido> findByFechaBetweenWithDetalle(@Param("desde") Date desde, @Param("hasta") Date hasta);

    @Query("SELECT DISTINCT p FROM Pedido p " +
            "LEFT JOIN FETCH p.detallePedidos d " +
            "LEFT JOIN FETCH d.instrumento")
    List<Pedido> findAllWithDetalle();

    @Query("SELECT DISTINCT p FROM Pedido p " +
            "LEFT JOIN FETCH p.detallePedidos d " +
            "LEFT JOIN FETCH d.instrumento " +
            "WHERE p.id = :id")
    Optional<Pedido> findByIdWithDetalle(@Param("id") Long id);
}
