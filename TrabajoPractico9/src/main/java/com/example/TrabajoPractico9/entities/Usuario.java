package com.example.TrabajoPractico9.entities;

import com.example.TrabajoPractico9.entities.Enum.Rol;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Usuario extends BaseEntity {

    private String nombreUsuario;
    private String clave;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    public void setClave(String clave) {
        this.clave = encriptarClave(clave);
    }

    private String encriptarClave(String clave) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] messageDigest = md.digest(clave.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : messageDigest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
