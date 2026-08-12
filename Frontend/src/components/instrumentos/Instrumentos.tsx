
import { useEffect, useState } from "react";
import Instrumento from "../../entities/Instrumento";
import InstrumentoService from "../../services/InstrumentoService";
import './Instrumentos.css';
import { CarritoContextProvider } from "../../context/CarritoContext";
import { Carrito } from "../Carrito/Carrito";
import ItemInstrumento from "../itemInstrumento/ItemInstrumento";
import LoaderPage from "../LoaderPage/LoaderPage";

const Instrumentos = () => {

    const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);
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


    return (
        <CarritoContextProvider>
            <div className="row">
                <div className="col-9">
                    <div className="row">
                        {instrumentos.map((instrumento: Instrumento, index) => {
                            return (
                                <ItemInstrumento
                                    instrumentoObject={instrumento}
                                    key={index}
                                    id={instrumento.id}
                                    instrumento={instrumento.instrumento}
                                    precio={instrumento.precio}
                                    imagen={instrumento.imagen}
                                    descripcion={instrumento.descripcion}
                                    marca={instrumento.marca}
                                    modelo={instrumento.modelo}
                                    costoEnvio={instrumento.costoEnvio}
                                    cantidadVendida={instrumento.cantidadVendida}
                                    initialHayStock={true}
                                >
                                </ItemInstrumento>

                            )
                        })}
                    </div>
                </div>
                <div className="col-3">
                    <b>Carrito Compras</b>
                    <hr></hr>
                    <Carrito></Carrito>
                </div>
            </div>
        </CarritoContextProvider>
    )

}

export default Instrumentos;