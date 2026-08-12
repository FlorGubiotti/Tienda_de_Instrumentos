import Instrumento from "../../entities/Instrumento";
import { useCarrito } from "../../hooks/useCarrito";
import TarjetaProducto from "../tarjetaProducto/TarjetaProducto";
import "./ItemInstrumento.css"

/**
 * La tarjeta del catálogo: la misma vidriera del Home, más los controles de
 * carrito. El diseño vive en TarjetaProducto para que las dos pantallas no se
 * despeguen.
 */
function ItemInstrumento({ instrumento }: { instrumento: Instrumento }) {

    const { addCarrito, removeItemCarrito, cart } = useCarrito();

    const enCarrito = cart.find((detalle) => detalle.instrumento.id === instrumento.id);
    const cantidad = enCarrito?.cantidad ?? 0;

    const acciones = cantidad === 0 ? (
        <button
            type="button"
            className="item-instrumento__agregar"
            onClick={() => addCarrito(instrumento)}
        >
            <i className="bi bi-cart-plus" aria-hidden="true"></i> Agregar al carrito
        </button>
    ) : (
        <div className="item-instrumento__cantidad">
            <button
                type="button"
                onClick={() => removeItemCarrito(instrumento)}
                aria-label={`Quitar una unidad de ${instrumento.instrumento}`}
            >
                −
            </button>
            <span>{cantidad} en el carrito</span>
            <button
                type="button"
                onClick={() => addCarrito(instrumento)}
                aria-label={`Agregar una unidad de ${instrumento.instrumento}`}
            >
                +
            </button>
        </div>
    );

    return <TarjetaProducto instrumento={instrumento} acciones={acciones} />;
}

export default ItemInstrumento
