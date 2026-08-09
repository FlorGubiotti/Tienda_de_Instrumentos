package com.example.TiendaDeMusica.repositories;

import com.example.TiendaDeMusica.entities.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends BaseRepository<Usuario, Long> {
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);
}
