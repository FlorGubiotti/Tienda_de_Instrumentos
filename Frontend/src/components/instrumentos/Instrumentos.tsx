
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Instrumento from "../../entities/Instrumento";
import InstrumentoService from "../../services/InstrumentoService";
import { nombreCategoria } from "../../services/formato";
import './Instrumentos.css';
import ItemInstrumento from "../itemInstrumento/ItemInstrumento";
import LoaderPage from "../LoaderPage/LoaderPage";

const Instrumentos = () => {

    const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);
    const [parametros] = useSearchParams();
    const instrumentoService = new InstrumentoService();
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const instrumentosData = await instrumentoService.getAll(url + 'instrumentos');
                setInstrumentos(instrumentosData);
            } catch (e) {
                console.error('Error al obtener los instrumentos:', e);
                setError(true);
            } finally {
                setCargando(false);
            }
        };
        fetchData();
    }, []);

    if (cargando) {
        return <LoaderPage />;
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                No pudimos cargar los productos. Por favor intentá de nuevo más tarde.
            </div>
        );
    }

    // Catálogo vacío: es información, no un error
    if (instrumentos.length === 0) {
        return (
            <div className="alert alert-info" role="alert">
                No hay productos disponibles
            </div>
        );
    }

    /*
     * El filtro es del lado del cliente: la lista completa ya vino en la misma
     * llamada, así que cambiar de categoría no vuelve a pegarle al backend.
     */
    const categoriaElegida = parametros.get('categoria');

    const categorias = [...new Set(
        instrumentos.map((i) => i.categoria?.denominacion).filter(Boolean)
    )] as string[];

    const instrumentosVisibles = categoriaElegida
        ? instrumentos.filter((i) => i.categoria?.denominacion === categoriaElegida)
        : instrumentos;

    return (
        <div className="catalogo">
            <header className="catalogo__encabezado">
                <h1 className="catalogo__titulo">
                    {categoriaElegida ? nombreCategoria(categoriaElegida) : 'Todos los instrumentos'}
                </h1>
                <p className="catalogo__cuenta">
                    {instrumentosVisibles.length}{' '}
                    {instrumentosVisibles.length === 1 ? 'producto' : 'productos'}
                </p>
            </header>

            <div className="catalogo__filtros" role="group" aria-label="Filtrar por categoría">
                <Link
                    to="/products"
                    className={`filtro ${categoriaElegida ? '' : 'filtro--activo'}`}
                >
                    Todas
                </Link>
                {categorias.map((categoria) => (
                    <Link
                        key={categoria}
                        to={`/products?categoria=${encodeURIComponent(categoria)}`}
                        className={`filtro ${categoriaElegida === categoria ? 'filtro--activo' : ''}`}
                    >
                        {nombreCategoria(categoria)}
                    </Link>
                ))}
            </div>

            {instrumentosVisibles.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    No hay productos en esta categoría.
                </div>
            ) : (
                <div className="catalogo__grilla">
                    {instrumentosVisibles.map((instrumento: Instrumento) => (
                        <ItemInstrumento key={instrumento.id} instrumento={instrumento} />
                    ))}
                </div>
            )}
        </div>
    )

}

export default Instrumentos;
