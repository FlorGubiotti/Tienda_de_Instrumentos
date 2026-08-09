package com.example.TiendaDeMusica.services;

import com.example.TiendaDeMusica.dto.CrearPreferenciaRequest;
import com.example.TiendaDeMusica.dto.ItemPedidoRequest;
import com.example.TiendaDeMusica.entities.Instrumento;
import com.example.TiendaDeMusica.entities.PreferenceMP;
import com.example.TiendaDeMusica.repositories.InstrumentoRepository;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MercadoPagoService {

    @Value("${mercadopago.access-token}")
    private String accessToken;

    private final InstrumentoRepository instrumentoRepository;

    public MercadoPagoService(InstrumentoRepository instrumentoRepository) {
        this.instrumentoRepository = instrumentoRepository;
    }

    public PreferenceMP createPreference(CrearPreferenciaRequest request) {
        try {
            if (request.items() == null || request.items().isEmpty()) {
                throw new IllegalArgumentException("El pedido no tiene items.");
            }

            MercadoPagoConfig.setAccessToken(accessToken);

            List<PreferenceItemRequest> items = new ArrayList<>();
            for (ItemPedidoRequest itemPedido : request.items()) {
                Instrumento instrumento = instrumentoRepository.findById(itemPedido.instrumentoId())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "No existe el instrumento " + itemPedido.instrumentoId()));

                items.add(PreferenceItemRequest.builder()
                        .id(instrumento.getId().toString())
                        .title(instrumento.getInstrumento())
                        .quantity(itemPedido.cantidad())
                        .currencyId("ARS")
                        .unitPrice(instrumento.getPrecio())
                        .build());
            }

            PreferenceBackUrlsRequest backURL = PreferenceBackUrlsRequest.builder()
                    .success("http://localhost:5173/mpsuccess")
                    .pending("http://localhost:5173/mppending")
                    .failure("http://localhost:5173/mpfailure")
                    .build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .backUrls(backURL)
                    .build();
            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            PreferenceMP mpPreference = new PreferenceMP();
            mpPreference.setStatusCode(preference.getResponse().getStatusCode());
            mpPreference.setId(preference.getId());
            return mpPreference;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
