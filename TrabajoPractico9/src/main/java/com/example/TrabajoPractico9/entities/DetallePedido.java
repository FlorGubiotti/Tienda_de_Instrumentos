package com.example.TrabajoPractico9.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class DetallePedido extends BaseEntity {

    private int cantidad;

    @ManyToOne
    @JoinColumn(name = "idPedido")
    @JsonIgnoreProperties("detallePedidos")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "idInstrumento")
    @JsonIgnoreProperties("detallePedidos")
    private Instrumento instrumento;
}
