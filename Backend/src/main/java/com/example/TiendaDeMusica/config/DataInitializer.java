package com.example.TiendaDeMusica.config;

import com.example.TiendaDeMusica.entities.Categoria;
import com.example.TiendaDeMusica.entities.DetallePedido;
import com.example.TiendaDeMusica.entities.Instrumento;
import com.example.TiendaDeMusica.entities.Pedido;
import com.example.TiendaDeMusica.entities.Usuario;
import com.example.TiendaDeMusica.entities.Enum.Categorias;
import com.example.TiendaDeMusica.entities.Enum.EstadoPedido;
import com.example.TiendaDeMusica.entities.Enum.Rol;
import com.example.TiendaDeMusica.repositories.CategoriaRepository;
import com.example.TiendaDeMusica.repositories.InstrumentoRepository;
import com.example.TiendaDeMusica.repositories.PedidoRepository;
import com.example.TiendaDeMusica.repositories.UsuarioRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Calendar;
import java.util.Date;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger =
            LoggerFactory.getLogger(DataInitializer.class);

    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final InstrumentoRepository instrumentoRepository;
    private final PedidoRepository pedidoRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            CategoriaRepository categoriaRepository,
            UsuarioRepository usuarioRepository,
            InstrumentoRepository instrumentoRepository,
            PedidoRepository pedidoRepository,
            PasswordEncoder passwordEncoder) {

        this.categoriaRepository = categoriaRepository;
        this.usuarioRepository = usuarioRepository;
        this.instrumentoRepository = instrumentoRepository;
        this.pedidoRepository = pedidoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        logger.info("Iniciando carga inicial...");

        cargarCategorias();
        cargarUsuarios();
        cargarInstrumentos();
        cargarPedidos();

        logger.info("Carga inicial finalizada.");
    }

    private void cargarCategorias() {

        if (categoriaRepository.count() > 0) {
            logger.info("Las categorías ya existen.");
            return;
        }

        Categoria cuerda = Categoria.builder()
                .denominacion(Categorias.Cuerda)
                .build();

        Categoria viento = Categoria.builder()
                .denominacion(Categorias.Viento)
                .build();

        Categoria percusion = Categoria.builder()
                .denominacion(Categorias.Percusion)
                .build();

        Categoria teclado = Categoria.builder()
                .denominacion(Categorias.Teclado)
                .build();

        Categoria electronico = Categoria.builder()
                .denominacion(Categorias.Electronico)
                .build();

        categoriaRepository.save(cuerda);
        categoriaRepository.save(viento);
        categoriaRepository.save(percusion);
        categoriaRepository.save(teclado);
        categoriaRepository.save(electronico);

        logger.info("Categorías creadas.");
    }

    private void cargarUsuarios() {

        if (usuarioRepository.count() > 0) {
            logger.info("Los usuarios ya existen.");
            return;
        }

        Usuario admin = Usuario.builder()
                .nombreUsuario("admin")
                .clave(passwordEncoder.encode("admin123"))
                .rol(Rol.ADMIN)
                .build();

        usuarioRepository.save(admin);

        Usuario operador = Usuario.builder()
                .nombreUsuario("operador")
                .clave(passwordEncoder.encode("operador123"))
                .rol(Rol.OPERADOR)
                .build();

        usuarioRepository.save(operador);

        Usuario visor = Usuario.builder()
                .nombreUsuario("visor")
                .clave(passwordEncoder.encode("visor123"))
                .rol(Rol.VISOR)
                .build();

        usuarioRepository.save(visor);

        logger.info("Usuarios creados.");
    }

    private void cargarInstrumentos() {

        if (instrumentoRepository.count() > 0) {
            logger.info("Los instrumentos ya existen.");
            return;
        }

        Categoria cuerda = obtenerCategoria(Categorias.Cuerda);
        Categoria viento = obtenerCategoria(Categorias.Viento);
        Categoria percusion = obtenerCategoria(Categorias.Percusion);
        Categoria teclado = obtenerCategoria(Categorias.Teclado);
        Categoria electronico = obtenerCategoria(Categorias.Electronico);

        Instrumento instrumento1 = Instrumento.builder()
                .instrumento("Guitarra Eléctrica")
                .marca("Fender")
                .modelo("Stratocaster")
                .imagen("nro1.jpg")
                .precio(BigDecimal.valueOf(850000))
                .costoEnvio("G")
                .cantidadVendida(15)
                .descripcion("Guitarra eléctrica ideal para distintos estilos musicales.")
                .categoria(cuerda)
                .build();

        Instrumento instrumento2 = Instrumento.builder()
                .instrumento("Guitarra Acústica")
                .marca("Yamaha")
                .modelo("F310")
                .imagen("nro2.jpg")
                .precio(BigDecimal.valueOf(320000))
                .costoEnvio("15000")
                .cantidadVendida(22)
                .descripcion("Guitarra acústica de sonido cálido y equilibrado.")
                .categoria(cuerda)
                .build();

        Instrumento instrumento3 = Instrumento.builder()
                .instrumento("Saxofón Alto")
                .marca("Yamaha")
                .modelo("YAS-280")
                .imagen("nro3.jpg")
                .precio(BigDecimal.valueOf(1200000))
                .costoEnvio("G")
                .cantidadVendida(8)
                .descripcion("Saxofón alto de excelente respuesta y afinación.")
                .categoria(viento)
                .build();

        Instrumento instrumento4 = Instrumento.builder()
                .instrumento("Flauta Traversa")
                .marca("Yamaha")
                .modelo("YFL-222")
                .imagen("nro4.jpg")
                .precio(BigDecimal.valueOf(650000))
                .costoEnvio("12000")
                .cantidadVendida(9)
                .descripcion("Flauta traversa ideal para estudiantes y músicos.")
                .categoria(viento)
                .build();

        Instrumento instrumento5 = Instrumento.builder()
                .instrumento("Batería Acústica")
                .marca("Pearl")
                .modelo("Roadshow")
                .imagen("nro5.jpg")
                .precio(BigDecimal.valueOf(1100000))
                .costoEnvio("35000")
                .cantidadVendida(6)
                .descripcion("Set completo de batería acústica.")
                .categoria(percusion)
                .build();

        Instrumento instrumento6 = Instrumento.builder()
                .instrumento("Cajón Peruano")
                .marca("Meinl")
                .modelo("MCAJ100")
                .imagen("nro6.jpg")
                .precio(BigDecimal.valueOf(180000))
                .costoEnvio("G")
                .cantidadVendida(25)
                .descripcion("Cajón de percusión con excelente respuesta sonora.")
                .categoria(percusion)
                .build();

        Instrumento instrumento7 = Instrumento.builder()
                .instrumento("Teclado Digital")
                .marca("Casio")
                .modelo("CT-S300")
                .imagen("nro7.jpg")
                .precio(BigDecimal.valueOf(480000))
                .costoEnvio("G")
                .cantidadVendida(18)
                .descripcion("Teclado digital portátil con múltiples sonidos.")
                .categoria(teclado)
                .build();

        Instrumento instrumento8 = Instrumento.builder()
                .instrumento("Piano Digital")
                .marca("Yamaha")
                .modelo("P-45")
                .imagen("nro8.jpg")
                .precio(BigDecimal.valueOf(950000))
                .costoEnvio("25000")
                .cantidadVendida(10)
                .descripcion("Piano digital de 88 teclas contrapesadas.")
                .categoria(teclado)
                .build();

        Instrumento instrumento9 = Instrumento.builder()
                .instrumento("Sintetizador")
                .marca("Korg")
                .modelo("Minilogue")
                .imagen("nro9.jpg")
                .precio(BigDecimal.valueOf(780000))
                .costoEnvio("G")
                .cantidadVendida(5)
                .descripcion("Sintetizador polifónico para producción musical.")
                .categoria(electronico)
                .build();

        Instrumento instrumento10 = Instrumento.builder()
                .instrumento("Batería Electrónica")
                .marca("Roland")
                .modelo("TD-07")
                .imagen("nro10.jpg")
                .precio(BigDecimal.valueOf(1350000))
                .costoEnvio("30000")
                .cantidadVendida(7)
                .descripcion("Batería electrónica compacta para práctica y grabación.")
                .categoria(electronico)
                .build();

        instrumentoRepository.save(instrumento1);
        instrumentoRepository.save(instrumento2);
        instrumentoRepository.save(instrumento3);
        instrumentoRepository.save(instrumento4);
        instrumentoRepository.save(instrumento5);
        instrumentoRepository.save(instrumento6);
        instrumentoRepository.save(instrumento7);
        instrumentoRepository.save(instrumento8);
        instrumentoRepository.save(instrumento9);
        instrumentoRepository.save(instrumento10);

        logger.info("Instrumentos creados.");
    }

    /*
     * cantidadVendida en cargarInstrumentos() es solo un número de vidriera:
     * sin esto, no hay un solo Pedido/DetallePedido real detrás de esas
     * cifras, así que el reporte de Excel (que sí consulta pedidos reales)
     * nunca las muestra. Un pedido PAGADO por instrumento, con la misma
     * cantidad, para que el catálogo y el reporte cuenten la misma historia.
     */
    private void cargarPedidos() {

        if (pedidoRepository.count() > 0) {
            logger.info("Los pedidos ya existen.");
            return;
        }

        crearPedidoVendido("Fender", "Stratocaster", 15, 170);
        crearPedidoVendido("Yamaha", "F310", 22, 150);
        crearPedidoVendido("Yamaha", "YAS-280", 8, 130);
        crearPedidoVendido("Yamaha", "YFL-222", 9, 110);
        crearPedidoVendido("Pearl", "Roadshow", 6, 95);
        crearPedidoVendido("Meinl", "MCAJ100", 25, 80);
        crearPedidoVendido("Casio", "CT-S300", 18, 60);
        crearPedidoVendido("Yamaha", "P-45", 10, 40);
        crearPedidoVendido("Korg", "Minilogue", 5, 20);
        crearPedidoVendido("Roland", "TD-07", 7, 5);

        logger.info("Pedidos creados.");
    }

    private void crearPedidoVendido(String marca, String modelo, int cantidad, int diasAtras) {
        Instrumento instrumento = obtenerInstrumento(marca, modelo);

        Pedido pedido = Pedido.builder()
                .fecha(hace(diasAtras))
                .titulo("Pedido Trémolo")
                .totalPedido(instrumento.getPrecio().multiply(BigDecimal.valueOf(cantidad)))
                .estado(EstadoPedido.PAGADO)
                .build();

        DetallePedido detalle = DetallePedido.builder()
                .cantidad(cantidad)
                .instrumento(instrumento)
                .pedido(pedido) // lado dueño de la relación: sin esto el FK queda null
                .build();

        pedido.getDetallePedidos().add(detalle);
        pedidoRepository.save(pedido); // cascade ALL persiste el detalle también
    }

    private Instrumento obtenerInstrumento(String marca, String modelo) {
        return instrumentoRepository.findAll()
                .stream()
                .filter(instrumento ->
                        instrumento.getMarca().equals(marca) && instrumento.getModelo().equals(modelo))
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException(
                                "No se encontró el instrumento " + marca + " " + modelo
                        )
                );
    }

    private Date hace(int dias) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, -dias);
        return calendar.getTime();
    }

    private Categoria obtenerCategoria(Categorias denominacion) {

        return categoriaRepository.findAll()
                .stream()
                .filter(categoria ->
                        categoria.getDenominacion() == denominacion)
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException(
                                "No se encontró la categoría: " + denominacion
                        )
                );
    }
}