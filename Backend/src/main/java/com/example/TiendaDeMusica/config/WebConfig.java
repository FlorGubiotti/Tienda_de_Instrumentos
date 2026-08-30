package com.example.TiendaDeMusica.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

/**
 * Las imágenes de instrumentos pueden venir de dos lugares: las 10 originales,
 * empaquetadas en static/images dentro del jar, y las que se suben desde el
 * formulario, que se guardan en una carpeta externa (ver ImagenService). Las
 * dos se sirven bajo el mismo prefijo /images/** para que el frontend no
 * tenga que distinguir de dónde viene cada una.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.uploads-dir}")
    private String uploadsDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String rutaAbsoluta = Path.of(uploadsDir).toAbsolutePath().normalize().toUri().toString();

        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/", rutaAbsoluta);
    }
}
