package com.example.TiendaDeMusica.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Table(name = "instrumento")
public class Instrumento extends BaseEntity{

    @NotBlank(message = "El nombre del instrumento es obligatorio.")
    private String instrumento;

    @NotBlank(message = "La marca es obligatoria.")
    private String marca;

    @NotBlank(message = "El modelo es obligatorio.")
    private String modelo;

    private String imagen;

    @NotNull(message = "El precio es obligatorio.")
    @Positive(message = "El precio debe ser mayor a 0.")
    @Column(precision = 12, scale = 2)
    private BigDecimal precio;

    private String costoEnvio;
    private int cantidadVendida;
    private String descripcion;

    /**
     * Baja lógica: un instrumento dado de baja sale del catálogo pero se conserva,
     * porque los pedidos ya realizados siguen apuntando a él.
     */
    @ColumnDefault("true")
    @Column(nullable = false)
    @Builder.Default
    private boolean activo = true;

    @ManyToOne
    @JoinColumn(name = "idCategoria")
    @JsonIgnoreProperties("instrumentos")
    private Categoria categoria;

    // Sin cascade: borrar un instrumento nunca debe arrastrarse el historial de ventas
    @OneToMany(mappedBy = "instrumento", fetch = FetchType.LAZY)
    @Builder.Default //Builder no sobreescribe la inicializacion de la lista
    @JsonIgnoreProperties("instrumento")
    private List<DetallePedido> detallePedidos = new ArrayList<>();
}
