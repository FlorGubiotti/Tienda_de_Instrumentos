package com.example.TiendaDeMusica.services;

import com.example.TiendaDeMusica.entities.Pedido;
import com.example.TiendaDeMusica.entities.PreferenceMP;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class MercadoPagoService {

    @Value("${mercadopago.access-token}")
    private String accessToken;

    public PreferenceMP createPreference(Pedido pedido) {
        try {
            MercadoPagoConfig.setAccessToken(accessToken);

            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .id("1234")
                    .title(pedido.getTitulo())
                    .description("Pedido realizado desde el carrito de compras")
                    .pictureUrl("https://img-global.cpcdn.com/recipes/0709fbb52d87d2d7/1200x630cq70/photo.jpg")
                    .quantity(1)
                    .currencyId("ARS") // Cambia "ARG" por "ARS"
                    .unitPrice(new BigDecimal(pedido.getTotalPedido()))
                    .build();
            List<PreferenceItemRequest> items = new ArrayList<>();
            items.add(itemRequest);

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
