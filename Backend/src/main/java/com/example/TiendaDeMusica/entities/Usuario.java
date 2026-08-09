package com.example.TiendaDeMusica.entities;

import com.example.TiendaDeMusica.entities.Enum.Rol;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class Usuario extends BaseEntity {

    @NotBlank(message = "El nombre de usuario es obligatorio.")
    private String nombreUsuario;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String clave;

    @NotNull(message = "El rol es obligatorio.")
    @Enumerated(EnumType.STRING)
    private Rol rol;
}
