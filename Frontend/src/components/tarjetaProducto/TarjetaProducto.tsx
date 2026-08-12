import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Instrumento from "../../entities/Instrumento";
import { formatearPrecio } from "../../services/formato";
import "./TarjetaProducto.css";

type Props = {
    instrumento: Instrumento;
    /**
     * Controles opcionales al pie de la tarjeta. El Home la usa sin nada, como
     * pura vidriera; el catálogo le pasa los botones de carrito.
     */
    acciones?: ReactNode;
};

const TarjetaProducto = ({ instrumento, acciones }: Props) => {
    const envioGratis = instrumento.costoEnvio === "G";

    return (
        <article className="tarjeta-producto">
            <div className="tarjeta-producto__imagen">
                <img src={`./images/${instrumento.imagen}`} alt={instrumento.instrumento} loading="lazy" />
            </div>

            <div className="tarjeta-producto__cuerpo">
                <p className="tarjeta-producto__marca">{instrumento.marca}</p>
                <h3 className="tarjeta-producto__nombre">{instrumento.instrumento}</h3>
                <p className="tarjeta-producto__precio">{formatearPrecio(instrumento.precio)}</p>

                <p className="tarjeta-producto__envio">
                    {envioGratis
                        ? <span className="tarjeta-producto__envio-gratis">
                            <i className="bi bi-truck" aria-hidden="true"></i> Envío gratis
                          </span>
                        : <span>Envío ${instrumento.costoEnvio}</span>}
                </p>

                <p className="tarjeta-producto__vendidos">{instrumento.cantidadVendida} vendidos</p>

                <div className="tarjeta-producto__pie">
                    <Link to={`/products/detalle/${instrumento.id}`} className="tarjeta-producto__boton">
                        Ver detalle
                    </Link>
                    {acciones}
                </div>
            </div>
        </article>
    );
};

export default TarjetaProducto;
