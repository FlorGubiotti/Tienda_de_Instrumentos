package com.example.TiendaDeMusica.services;

import com.example.TiendaDeMusica.dto.LoginRequest;
import com.example.TiendaDeMusica.dto.LoginResponse;
import com.example.TiendaDeMusica.entities.Usuario;
import com.example.TiendaDeMusica.repositories.UsuarioRepository;
import com.example.TiendaDeMusica.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByNombreUsuario(request.nombreUsuario())
                .orElseThrow(() -> new BadCredentialsException("Credenciales inválidas"));

        if (!passwordEncoder.matches(request.clave(), usuario.getClave())) {
            throw new BadCredentialsException("Credenciales inválidas");
        }

        String token = jwtService.generarToken(usuario);
        return new LoginResponse(token, usuario.getNombreUsuario(), usuario.getRol().name());
    }
}
