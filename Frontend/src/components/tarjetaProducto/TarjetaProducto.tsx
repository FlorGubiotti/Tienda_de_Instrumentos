import { Link } from "react-router-dom";
import Instrumento from "../../entities/Instrumento";
import { formatearPrecio } from "../../services/formato";
import "./TarjetaProducto.css";

/**
 * Tarjeta de producto de solo lectura: muestra el instrumento y lleva al
 * detalle. No maneja carrito, porque se usa en el Home, que está fuera del
 * CarritoContext. La del catálogo, con los controles de carrito, es
 * ItemInstrumento.
 */
const TarjetaProducto = ({ instrumento }: { instrumento: Instrumento }) => {
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

                <Link to={`/products/detalle/${instrumento.id}`} className="tarjeta-producto__boton">
                    Ver detalle
                </Link>
            </div>
        </article>
    );
};

export default TarjetaProducto;
