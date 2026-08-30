import DetallePedido from "../../entities/DetallePedido";
import { useCarrito } from "../../hooks/useCarrito";
import { formatearPrecio } from "../../services/formato";
import { urlImagen } from "../../services/imagenes";
import CheckoutMP from "../checkoutMP/CheckoutMP";
import './Carrito.css'

function LineaCarrito({ detalle }: { detalle: DetallePedido }) {
  const { addCarrito, removeItemCarrito, removeCarrito } = useCarrito();
  const instrumento = detalle.instrumento;

  return (
    <li className="carrito__linea">
      <img
        className="carrito__miniatura"
        src={urlImagen(instrumento.imagen)}
        alt={instrumento.instrumento}
      />

      <div className="carrito__datos">
        <p className="carrito__nombre">{instrumento.instrumento}</p>
        <p className="carrito__precio-unitario">{formatearPrecio(instrumento.precio)} c/u</p>

        <div className="carrito__cantidad">
          <button
            type="button"
            onClick={() => removeItemCarrito(instrumento)}
            aria-label={`Quitar una unidad de ${instrumento.instrumento}`}
          >
            −
          </button>
          <span aria-label={`${detalle.cantidad} unidades`}>{detalle.cantidad}</span>
          <button
            type="button"
            onClick={() => addCarrito(instrumento)}
            aria-label={`Agregar una unidad de ${instrumento.instrumento}`}
          >
            +
          </button>
        </div>
      </div>

      <div className="carrito__derecha">
        <p className="carrito__subtotal">{formatearPrecio(instrumento.precio * detalle.cantidad)}</p>
        <button
          type="button"
          className="carrito__quitar"
          onClick={() => removeCarrito(instrumento)}
          aria-label={`Quitar ${instrumento.instrumento} del carrito`}
        >
          <i className="bi bi-trash" aria-hidden="true"></i>
        </button>
      </div>
    </li>
  );
}

export function Carrito() {
  const { cart, total, limpiarCarrito } = useCarrito();

  if (cart.length === 0) {
    return (
      <div className="carrito__vacio">
        <i className="bi bi-cart" aria-hidden="true"></i>
        <p>Todavía no agregaste nada.</p>
      </div>
    );
  }

  return (
    <div className="carrito">
      <ul className="carrito__lista">
        {cart.map((detalle) => (
          <LineaCarrito detalle={detalle} key={detalle.instrumento.id} />
        ))}
      </ul>

      <div className="carrito__pie">
        <div className="carrito__total">
          <span>Total</span>
          <strong>{formatearPrecio(total)}</strong>
        </div>

        <CheckoutMP cart={cart} />

        <button type="button" className="carrito__vaciar" onClick={limpiarCarrito}>
          Vaciar carrito
        </button>
      </div>
    </div>
  );
}
