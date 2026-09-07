import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Instrumento from "../../entities/Instrumento";
import InstrumentoService from "../../services/InstrumentoService";
import { nombreCategoria } from "../../services/formato";
import TarjetaProducto from "../tarjetaProducto/TarjetaProducto";
import heroInstrumentos from "../../assets/hero-instrumentos.png";
import iconoCuerda from "../../assets/icons/icono-cuerda.svg?raw";
import iconoViento from "../../assets/icons/icono-viento.svg?raw";
import iconoPercusion from "../../assets/icons/icono-percusion.svg?raw";
import iconoTeclado from "../../assets/icons/icono-teclado.svg?raw";
import iconoElectronico from "../../assets/icons/icono-electronico.svg?raw";
import "./Home.css";

/*
 * Los SVG se importan como texto (?raw) y se inyectan inline en vez de con
 * <img>: así el "currentColor" de adentro del archivo hereda el color de
 * .categoria__icono y sigue al acento del tema, igual que hacían los íconos
 * de Bootstrap antes.
 */
const ICONOS_CATEGORIA: Record<string, string> = {
    Cuerda: iconoCuerda,
    Viento: iconoViento,
    Percusion: iconoPercusion,
    Teclado: iconoTeclado,
    Electronico: iconoElectronico,
};

type ResumenCategoria = {
    denominacion: string;
    cantidad: number;
};

const Home = () => {
    const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const traerInstrumentos = async () => {
            try {
                const servicio = new InstrumentoService();
                const datos = await servicio.getAll(import.meta.env.VITE_API_URL + "instrumentos");
                setInstrumentos(datos);
            } catch (e) {
                console.error("Error al obtener los instrumentos:", e);
                setError(true);
            } finally {
                setCargando(false);
            }
        };
        traerInstrumentos();
    }, []);

    // Las categorías salen del catálogo, así que el Home nunca ofrece una que esté vacía
    const categorias: ResumenCategoria[] = [];
    for (const instrumento of instrumentos) {
        const denominacion = instrumento.categoria?.denominacion;
        if (!denominacion) continue;
        const existente = categorias.find((c) => c.denominacion === denominacion);
        if (existente) {
            existente.cantidad++;
        } else {
            categorias.push({ denominacion, cantidad: 1 });
        }
    }

    const masVendidos = [...instrumentos]
        .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
        .slice(0, 4);

    return (
        <>
            <section className="hero">
                <div className="hero__texto">
                    <h1 className="hero__titulo">Hacé sonar tus ideas.</h1>
                    <p className="hero__bajada">
                        Instrumentos y accesorios para cada forma de hacer música.
                    </p>
                    <div className="hero__acciones">
                        <Link to="/products" className="boton boton--principal">
                            Explorar productos
                        </Link>
                        <a href="#mas-vendidos" className="boton boton--secundario">
                            Ver los más vendidos
                        </a>
                    </div>
                </div>

                <div className="hero__composicion" aria-hidden="true">
                    <img src={heroInstrumentos} alt="" className="hero__imagen" />
                </div>
            </section>

            <section className="seccion">
                <h2 className="seccion__titulo">Elegí por categoría</h2>

                {cargando && <p className="seccion__aviso">Cargando categorías…</p>}
                {error && (
                    <p className="seccion__aviso" role="alert">
                        No pudimos cargar las categorías. Probá de nuevo más tarde.
                    </p>
                )}

                <div className="categorias">
                    {categorias.map((categoria) => (
                        <Link
                            key={categoria.denominacion}
                            to={`/products?categoria=${encodeURIComponent(categoria.denominacion)}`}
                            className="categoria"
                        >
                            <span
                                className="categoria__icono"
                                aria-hidden="true"
                                dangerouslySetInnerHTML={{ __html: ICONOS_CATEGORIA[categoria.denominacion] ?? "" }}
                            ></span>
                            <span className="categoria__nombre">{nombreCategoria(categoria.denominacion)}</span>
                            <span className="categoria__cantidad">
                                {categoria.cantidad} {categoria.cantidad === 1 ? "producto" : "productos"}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="seccion" id="mas-vendidos">
                <div className="seccion__encabezado">
                    <h2 className="seccion__titulo">Los más vendidos</h2>
                    <Link to="/products" className="seccion__enlace">Ver todo el catálogo →</Link>
                </div>

                {cargando && <p className="seccion__aviso">Cargando productos…</p>}
                {error && (
                    <p className="seccion__aviso" role="alert">
                        No pudimos cargar los productos. Probá de nuevo más tarde.
                    </p>
                )}

                <div className="grilla-productos">
                    {masVendidos.map((instrumento) => (
                        <TarjetaProducto key={instrumento.id} instrumento={instrumento} />
                    ))}
                </div>
            </section>

            <section className="banner">
                <h2 className="banner__titulo">Todo lo que necesitás para crear.</h2>
                <p className="banner__texto">
                    Equipá tu espacio, subí el volumen y empezá a tocar.
                </p>
                <Link to="/products" className="boton boton--principal">Ver el catálogo</Link>
            </section>
        </>
    );
};

export default Home;
