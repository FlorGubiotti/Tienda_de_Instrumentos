package com.example.TiendaDeMusica.services;

import com.example.TiendaDeMusica.entities.Usuario;
import com.example.TiendaDeMusica.repositories.BaseRepository;
import com.example.TiendaDeMusica.repositories.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioServiceImpl extends BaseServiceImpl<Usuario, Long> implements UsuarioService {

    private final PasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        super((BaseRepository<Usuario, Long>) usuarioRepository);
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Usuario save(Usuario entity) {
        if (entity.getClave() == null || entity.getClave().isBlank()) {
            throw new IllegalArgumentException("La clave es obligatoria.");
        }
        entity.setClave(passwordEncoder.encode(entity.getClave()));
        return super.save(entity);
    }

    @Override
    public Usuario update(Usuario entity) {
        if (entity.getClave() == null || entity.getClave().isBlank()) {
            Usuario existente = findById(entity.getId());
            entity.setClave(existente.getClave());
        } else {
            entity.setClave(passwordEncoder.encode(entity.getClave()));
        }
        return super.update(entity);
    }
}
