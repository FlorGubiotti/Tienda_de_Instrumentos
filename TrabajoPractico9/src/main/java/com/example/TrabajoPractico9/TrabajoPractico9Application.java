package com.example.TrabajoPractico9;

import com.example.TrabajoPractico9.repositories.CategoriaRepository;
import com.example.TrabajoPractico9.repositories.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TrabajoPractico9Application {

	private static final Logger logger = LoggerFactory.getLogger(TrabajoPractico9Application.class);

	public static void main(String[] args) {
		SpringApplication.run(TrabajoPractico9Application.class, args);
	}


	@Autowired
	private CategoriaRepository categoriaRepository;

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Bean
	CommandLineRunner init(){
		return args -> {
			logger.info("Iniciando ...");

			//EJECUTAR LA PRIMERA VEZ

//			Categoria cuerda = Categoria.builder()
//					.denominacion(Categorias.Cuerda)
//					.build();
//
//			Categoria viento = Categoria.builder()
//					.denominacion(Categorias.Viento)
//					.build();
//
//			Categoria percusion = Categoria.builder()
//					.denominacion(Categorias.Percusion)
//					.build();
//
//			Categoria teclado = Categoria.builder()
//					.denominacion(Categorias.Teclado)
//					.build();
//
//			Categoria electronico = Categoria.builder()
//					.denominacion(Categorias.Electronico)
//					.build();
//
//			categoriaRepository.save(cuerda);
//			categoriaRepository.save(viento);
//			categoriaRepository.save(percusion);
//			categoriaRepository.save(teclado);
//			categoriaRepository.save(electronico);

//			Usuario admin = Usuario.builder()
//					.nombreUsuario("admin")
//					.clave("admin123")
//					.rol(Rol.ADMIN)
//					.build();
//			admin.setClave(admin.getClave());
//			usuarioRepository.save(admin);
//
//			Usuario operador = Usuario.builder()
//					.nombreUsuario("operador")
//					.clave("operador123")
//					.rol(Rol.OPERADOR)
//					.build();
//			operador.setClave(operador.getClave());
//			usuarioRepository.save(operador);
//
//			Usuario visor = Usuario.builder()
//					.nombreUsuario("visor")
//					.clave("visor123")
//					.rol(Rol.VISOR)
//					.build();
//			visor.setClave(visor.getClave());
//			usuarioRepository.save(visor);
//
//			logger.info("Usuarios creados:");
//			logger.info("Admin: {}", admin);
//			logger.info("Operador: {}", operador);
//			logger.info("Visor: {}", visor);

		};
	}
}
