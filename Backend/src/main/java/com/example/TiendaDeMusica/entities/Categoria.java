package com.example.TiendaDeMusica.entities;

import com.example.TiendaDeMusica.entities.Enum.Categorias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Categoria extends BaseEntity{

    @NotNull(message = "La denominación es obligatoria.")
    @Enumerated(EnumType.STRING)
    private Categorias denominacion;

    @OneToMany(mappedBy = "categoria", fetch = FetchType.LAZY)
    @Builder.Default //Builder no sobreescribe la inicializacion de la lista
    @JsonIgnoreProperties("categoria")
    private List<Instrumento> instrumentos = new ArrayList<>();
}
