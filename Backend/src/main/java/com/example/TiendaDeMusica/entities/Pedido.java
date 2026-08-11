package com.example.TiendaDeMusica.entities;


import com.example.TiendaDeMusica.entities.Enum.EstadoPedido;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Pedido extends BaseEntity{

    private Date fecha;

    @NotBlank(message = "El título es obligatorio.")
    private String titulo;

    @NotNull(message = "El total del pedido es obligatorio.")
    @Column(precision = 12, scale = 2)
    private BigDecimal totalPedido;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EstadoPedido estado = EstadoPedido.PENDIENTE;

    // Id de la preferencia de Mercado Pago asociada, para poder rastrear el pago
    private String preferenceId;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default //Builder no sobreescribe la inicializacion de la lista
    @JsonIgnoreProperties("pedido")
    private List<DetallePedido> detallePedidos = new ArrayList<>();

}
