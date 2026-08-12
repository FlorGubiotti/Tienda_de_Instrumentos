package com.example.TiendaDeMusica.services;

import com.example.TiendaDeMusica.entities.DetallePedido;
import com.example.TiendaDeMusica.entities.Enum.EstadoPedido;
import com.example.TiendaDeMusica.entities.Instrumento;
import com.example.TiendaDeMusica.entities.Pedido;
import com.example.TiendaDeMusica.repositories.InstrumentoRepository;
import com.example.TiendaDeMusica.repositories.PedidoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

/** Cubre cuándo se suman unidades vendidas al confirmarse un pago. */
class MercadoPagoServiceTest {

    private InstrumentoRepository instrumentoRepository;
    private MercadoPagoService servicio;

    @BeforeEach
    void setUp() {
        instrumentoRepository = Mockito.mock(InstrumentoRepository.class);
        PedidoRepository pedidoRepository = Mockito.mock(PedidoRepository.class);
        servicio = new MercadoPagoService(instrumentoRepository, pedidoRepository);
    }

    private Pedido pedidoCon(EstadoPedido estado, Instrumento instrumento, int cantidad) {
        Pedido pedido = Pedido.builder()
                .titulo("Pedido de prueba")
                .totalPedido(BigDecimal.TEN)
                .estado(estado)
                .build();
        pedido.getDetallePedidos().add(DetallePedido.builder()
                .cantidad(cantidad)
                .instrumento(instrumento)
                .pedido(pedido)
                .build());
        return pedido;
    }

    private Instrumento instrumentoCon(int cantidadVendida) {
        return Instrumento.builder()
                .instrumento("Guitarra")
                .marca("Fender")
                .modelo("Strato")
                .precio(BigDecimal.valueOf(1000))
                .cantidadVendida(cantidadVendida)
                .build();
    }

    @Test
    @DisplayName("Al pagarse un pedido pendiente se suman las unidades vendidas")
    void sumaLasUnidadesAlPagarse() {
        Instrumento instrumento = instrumentoCon(15);
        Pedido pedido = pedidoCon(EstadoPedido.PENDIENTE, instrumento, 3);

        servicio.registrarVentaSiCorresponde(pedido, EstadoPedido.PAGADO);

        assertEquals(18, instrumento.getCantidadVendida());
        Mockito.verify(instrumentoRepository).save(instrumento);
    }

    @Test
    @DisplayName("Confirmar de nuevo un pedido ya pagado no vuelve a sumar")
    void noSumaDosVecesElMismoPedido() {
        Instrumento instrumento = instrumentoCon(15);
        Pedido pedido = pedidoCon(EstadoPedido.PAGADO, instrumento, 3);

        servicio.registrarVentaSiCorresponde(pedido, EstadoPedido.PAGADO);

        assertEquals(15, instrumento.getCantidadVendida());
        Mockito.verifyNoInteractions(instrumentoRepository);
    }

    @Test
    @DisplayName("Un pago rechazado no suma unidades vendidas")
    void noSumaSiElPagoFueRechazado() {
        Instrumento instrumento = instrumentoCon(15);
        Pedido pedido = pedidoCon(EstadoPedido.PENDIENTE, instrumento, 3);

        servicio.registrarVentaSiCorresponde(pedido, EstadoPedido.RECHAZADO);

        assertEquals(15, instrumento.getCantidadVendida());
        Mockito.verifyNoInteractions(instrumentoRepository);
    }

    @Test
    @DisplayName("Un pago pendiente tampoco suma unidades vendidas")
    void noSumaSiSiguePendiente() {
        Instrumento instrumento = instrumentoCon(15);
        Pedido pedido = pedidoCon(EstadoPedido.PENDIENTE, instrumento, 3);

        servicio.registrarVentaSiCorresponde(pedido, EstadoPedido.PENDIENTE);

        assertEquals(15, instrumento.getCantidadVendida());
        Mockito.verifyNoInteractions(instrumentoRepository);
    }
}
