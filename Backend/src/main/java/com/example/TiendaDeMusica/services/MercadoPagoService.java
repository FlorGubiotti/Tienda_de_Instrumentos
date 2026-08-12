package com.example.TiendaDeMusica.services;

import com.example.TiendaDeMusica.dto.ConfirmacionPagoResponse;
import com.example.TiendaDeMusica.dto.CrearPreferenciaRequest;
import com.example.TiendaDeMusica.dto.ItemPedidoRequest;
import com.example.TiendaDeMusica.entities.DetallePedido;
import com.example.TiendaDeMusica.entities.Enum.EstadoPedido;
import com.example.TiendaDeMusica.entities.Instrumento;
import com.example.TiendaDeMusica.entities.Pedido;
import com.example.TiendaDeMusica.entities.PreferenceMP;
import com.example.TiendaDeMusica.repositories.InstrumentoRepository;
import com.example.TiendaDeMusica.repositories.PedidoRepository;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class MercadoPagoService {

    private static final Logger logger = LoggerFactory.getLogger(MercadoPagoService.class);

    @Value("${mercadopago.access-token}")
    private String accessToken;

    /** URL base del frontend, a donde vuelve el usuario después de pagar. */
    @Value("${app.frontend-url}")
    private String frontendUrl;

    private final InstrumentoRepository instrumentoRepository;
    private final PedidoRepository pedidoRepository;

    public MercadoPagoService(InstrumentoRepository instrumentoRepository, PedidoRepository pedidoRepository) {
        this.instrumentoRepository = instrumentoRepository;
        this.pedidoRepository = pedidoRepository;
    }

    @Transactional
    public PreferenceMP createPreference(CrearPreferenciaRequest request) {
        if (request.items() == null || request.items().isEmpty()) {
            throw new IllegalArgumentException("El pedido no tiene items.");
        }

        // El pedido se arma con los precios reales de la base, no con lo que mande el cliente
        Pedido pedido = Pedido.builder()
                .fecha(new Date())
                .titulo(request.titulo() == null || request.titulo().isBlank()
                        ? "Pedido Musical Hendrix"
                        : request.titulo())
                .estado(EstadoPedido.PENDIENTE)
                .totalPedido(BigDecimal.ZERO)
                .build();

        List<PreferenceItemRequest> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (ItemPedidoRequest itemPedido : request.items()) {
            Instrumento instrumento = instrumentoRepository.findById(itemPedido.instrumentoId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "No existe el instrumento " + itemPedido.instrumentoId()));

            if (!instrumento.isActivo()) {
                throw new IllegalArgumentException(
                        "El instrumento " + instrumento.getInstrumento() + " ya no está disponible.");
            }

            if (itemPedido.cantidad() <= 0) {
                throw new IllegalArgumentException("La cantidad debe ser mayor a 0.");
            }

            BigDecimal subtotal = instrumento.getPrecio().multiply(BigDecimal.valueOf(itemPedido.cantidad()));
            total = total.add(subtotal);

            DetallePedido detalle = DetallePedido.builder()
                    .cantidad(itemPedido.cantidad())
                    .instrumento(instrumento)
                    .pedido(pedido)
                    .build();
            pedido.getDetallePedidos().add(detalle);

            items.add(PreferenceItemRequest.builder()
                    .id(instrumento.getId().toString())
                    .title(instrumento.getInstrumento())
                    .quantity(itemPedido.cantidad())
                    .currencyId("ARS")
                    .unitPrice(instrumento.getPrecio())
                    .build());
        }

        pedido.setTotalPedido(total);
        pedido = pedidoRepository.save(pedido);

        try {
            MercadoPagoConfig.setAccessToken(accessToken);

            PreferenceBackUrlsRequest backURL = PreferenceBackUrlsRequest.builder()
                    .success(frontendUrl + "/mpsuccess")
                    .pending(frontendUrl + "/mppending")
                    .failure(frontendUrl + "/mpfailure")
                    .build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .backUrls(backURL)
                    // Permite reconocer a qué pedido corresponde el pago cuando lo consultemos
                    .externalReference(pedido.getId().toString())
                    .build();

            Preference preference = new PreferenceClient().create(preferenceRequest);

            pedido.setPreferenceId(preference.getId());
            pedidoRepository.save(pedido);

            PreferenceMP mpPreference = new PreferenceMP();
            mpPreference.setStatusCode(preference.getResponse().getStatusCode());
            mpPreference.setId(preference.getId());
            mpPreference.setPedidoId(pedido.getId());
            return mpPreference;

        } catch (Exception e) {
            logger.error("Error creando la preferencia de Mercado Pago para el pedido {}", pedido.getId(), e);
            return null;
        }
    }

    /**
     * Consulta el pago directamente a la API de Mercado Pago y actualiza el pedido
     * con el estado real. No se confía en lo que informe el navegador: lo único que
     * aporta el cliente es el id del pago.
     */
    @Transactional
    public ConfirmacionPagoResponse confirmarPago(Long paymentId) {
        Payment payment;
        try {
            MercadoPagoConfig.setAccessToken(accessToken);
            payment = new PaymentClient().get(paymentId);
        } catch (Exception e) {
            logger.error("No se pudo consultar el pago {} en Mercado Pago", paymentId, e);
            throw new IllegalArgumentException("No se pudo verificar el pago con Mercado Pago.");
        }

        if (payment == null || payment.getExternalReference() == null) {
            throw new IllegalArgumentException("El pago no tiene un pedido asociado.");
        }

        Long pedidoId = Long.parseLong(payment.getExternalReference());
        Pedido pedido = pedidoRepository.findByIdWithDetalle(pedidoId)
                .orElseThrow(() -> new EntityNotFoundException("No existe el pedido " + pedidoId));

        registrarVentaSiCorresponde(pedido, mapearEstado(payment.getStatus()));

        pedido.setEstado(mapearEstado(payment.getStatus()));
        pedidoRepository.save(pedido);

        return new ConfirmacionPagoResponse(pedido.getId(), pedido.getEstado().name(), payment.getStatus());
    }

    /**
     * Suma las unidades vendidas al instrumento, pero solo cuando el pedido pasa a
     * PAGADO por primera vez: si se vuelve a consultar el mismo pago (por ejemplo,
     * recargando la pantalla de resultado) no se cuenta la venta de nuevo.
     */
    void registrarVentaSiCorresponde(Pedido pedido, EstadoPedido nuevoEstado) {
        if (nuevoEstado != EstadoPedido.PAGADO || pedido.getEstado() == EstadoPedido.PAGADO) {
            return;
        }

        for (DetallePedido detalle : pedido.getDetallePedidos()) {
            Instrumento instrumento = detalle.getInstrumento();
            instrumento.setCantidadVendida(instrumento.getCantidadVendida() + detalle.getCantidad());
            instrumentoRepository.save(instrumento);
        }
    }

    private EstadoPedido mapearEstado(String estadoPagoMP) {
        if (estadoPagoMP == null) {
            return EstadoPedido.PENDIENTE;
        }
        return switch (estadoPagoMP) {
            case "approved" -> EstadoPedido.PAGADO;
            case "rejected", "cancelled" -> EstadoPedido.RECHAZADO;
            default -> EstadoPedido.PENDIENTE;
        };
    }
}
