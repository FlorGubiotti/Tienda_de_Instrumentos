package com.example.TiendaDeMusica.config;

import com.example.TiendaDeMusica.security.JwtAuthFilter;
import jakarta.servlet.DispatcherType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:8080"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // El reenvío interno a /error vuelve a pasar por la cadena sin
                        // credenciales; si no se permite, pisa el 403 original con un 401.
                        .dispatcherTypeMatchers(DispatcherType.ERROR, DispatcherType.FORWARD).permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        // Va antes del permitAll del catálogo: este listado incluye los dados
                        // de baja y es solo para administración.
                        .requestMatchers(HttpMethod.GET, "/api/instrumentos/todos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/instrumentos/**", "/api/categoria/**").permitAll()
                        .requestMatchers("/api/usuario/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/instrumentos/**", "/api/categoria/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/instrumentos/**", "/api/categoria/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/instrumentos/**", "/api/categoria/**").hasRole("ADMIN")
                        .requestMatchers(
                                "/api/pedido/barchart",
                                "/api/pedido/piechart",
                                "/api/pedido/downloadExcel",
                                "/api/pedido/downloadPdf/**").hasRole("ADMIN")
                        // Ver/editar/borrar pedidos ajenos es cosa de administración; el checkout
                        // de un usuario cualquiera solo necesita poder crear (POST) el suyo.
                        .requestMatchers(HttpMethod.GET, "/api/pedido/**", "/api/detallePedido/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/pedido/**", "/api/detallePedido/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/pedido/**", "/api/detallePedido/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                // Sin esto Spring responde 403 tanto al que no está autenticado como al que
                // no tiene permisos, y el cliente no puede distinguir "token vencido" de
                // "no tenés el rol necesario".
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"error\":\"No autenticado o sesión vencida.\"}");
                        })
                        .accessDeniedHandler((request, response, deniedException) -> {
                            response.setStatus(HttpStatus.FORBIDDEN.value());
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"error\":\"No tenés permisos para esta operación.\"}");
                        }))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
