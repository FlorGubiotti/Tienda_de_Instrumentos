import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Instrumento from "../../entities/Instrumento";
import InstrumentoService from "../../services/InstrumentoService";
import { nombreCategoria } from "../../services/formato";
import TarjetaProducto from "../tarjetaProducto/TarjetaProducto";
import "./Home.css";

/*
 * Bootstrap Icons no tiene guitarra, piano ni batería, así que cada categoría
 * usa el ícono más cercano de los que sí existen.
 */
const ICONOS_CATEGORIA: Record<string, string> = {
    Cuerda: "bi-music-note-beamed",
    Viento: "bi-soundwave",
    Percusion: "bi-disc",
    Teclado: "bi-keyboard",
    Electronico: "bi-sliders",
};

const ICONO_POR_DEFECTO = "bi-music-note";

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
                    <h1 className="hero__titulo">Encontrá tu sonido.</h1>
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

                {/*
                  * Composición decorativa. Va con íconos y no con fotos porque las del
                  * catálogo son de 160x160 y a este tamaño se verían pixeladas.
                  */}
                <div className="hero__composicion" aria-hidden="true">
                    <span className="hero__ficha hero__ficha--1"><i className="bi bi-music-note-beamed"></i></span>
                    <span className="hero__ficha hero__ficha--2"><i className="bi bi-headphones"></i></span>
                    <span className="hero__ficha hero__ficha--3"><i className="bi bi-keyboard"></i></span>
                    <span className="hero__ficha hero__ficha--4"><i className="bi bi-soundwave"></i></span>
                    <span className="hero__ficha hero__ficha--5"><i className="bi bi-speaker"></i></span>
                    <span className="hero__ficha hero__ficha--6"><i className="bi bi-vinyl"></i></span>
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
                            <i
                                className={`bi ${ICONOS_CATEGORIA[categoria.denominacion] ?? ICONO_POR_DEFECTO} categoria__icono`}
                                aria-hidden="true"
                            ></i>
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
