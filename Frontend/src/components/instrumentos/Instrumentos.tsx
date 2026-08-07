
import { useEffect, useState } from "react";
import Instrumento from "../../entities/Instrumento";
import InstrumentoService from "../../services/InstrumentoService";
import './Instrumentos.css';
import { CarritoContextProvider } from "../../context/CarritoContext";
import { Carrito } from "../Carrito/Carrito";
import ItemInstrumento from "../itemInstrumento/ItemInstrumento";

const Instrumentos = () => {

    const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
    const instrumentoService = new InstrumentoService();
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            const instrumentosData = await instrumentoService.getAll(url + 'instrumentos')
            setInstrumentos(instrumentosData);
            console.log(instrumentosData);
        };
        fetchData();
    }, []);

    if (instrumentos.length === 0) {
        return (
            <div className="alert alert-danger" role="alert">
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