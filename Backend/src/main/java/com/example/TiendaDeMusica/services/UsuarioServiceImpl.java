package com.example.TiendaDeMusica.services;

import com.example.TiendaDeMusica.entities.Usuario;
import com.example.TiendaDeMusica.repositories.BaseRepository;
import com.example.TiendaDeMusica.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class UsuarioServiceImpl extends BaseServiceImpl<Usuario, Long> implements UsuarioService {

    private UsuarioRepository usuarioRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        super((BaseRepository<Usuario, Long>) usuarioRepository);
        this.usuarioRepository = usuarioRepository;
    }


}
