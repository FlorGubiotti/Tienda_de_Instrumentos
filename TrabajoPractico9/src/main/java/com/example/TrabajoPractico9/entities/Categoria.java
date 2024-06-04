package com.example.TrabajoPractico9.entities;

import com.example.TrabajoPractico9.entities.Enum.Categorias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
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

    @Enumerated(EnumType.STRING)
    private Categorias denominacion;

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default //Builder no sobreescribe la inicializacion de la lista
    @JsonIgnoreProperties("categoria")
    private List<Instrumento> instrumentos = new ArrayList<>();
}
