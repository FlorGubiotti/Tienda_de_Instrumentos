package com.example.TiendaDeMusica;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

/*
 * Se excluye UserDetailsServiceAutoConfiguration porque la autenticación es
 * propia (JWT): sin excluirla, Spring crea un usuario en memoria y escribe una
 * "contraseña generada" en cada arranque que no se usa para nada.
 */
@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
public class TiendaDeMusicaApplication {

	public static void main(String[] args) {
		SpringApplication.run(TiendaDeMusicaApplication.class, args);
	}
}
