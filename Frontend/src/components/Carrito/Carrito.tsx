import { useState } from "react";
import DetallePedido from "../../entities/DetallePedido";
import { useCarrito } from "../../hooks/useCarrito";
import CheckoutMP from "../checkoutMP/CheckoutMP";
import './Carrito.css'

interface CartItemProps {
  detalle: DetallePedido;
}

function CartItem({ detalle }: CartItemProps) {
  return (
    <div key={detalle.id}>
      <span>
        <img width={50} height={50}
          src={`./images/${detalle.instrumento.imagen}`}
          alt={detalle.instrumento.instrumento}
        />
        <div>
          <strong>{detalle.instrumento.instrumento}</strong> - ${detalle.instrumento.precio}
        </div>
        <div>
          <b>{detalle.cantidad} {detalle.cantidad == 1 ? 'unidad' : 'unidades'} </b>
        </div>
      </span>
      <hr></hr>
    </div>
  )
}

export function Carrito() {

  const { cart, limpiarCarrito, crearPedidoDetalle } = useCarrito()
  const [idPedido, setIdPedido] = useState<number | null>(null);

  const handleGuardarCarrito = async () => {
    try {
      const nuevoIdPedido = await crearPedidoDetalle();
      setIdPedido(nuevoIdPedido);
      setTimeout(() => {
        setIdPedido(null);
      }, 5000);
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
    }
  };


  const totalProductos = cart.reduce((total, detalle) => total + detalle.instrumento.precio * detalle.cantidad, 0);
  if (idPedido !== null) {
    return (
      <div className="text-center text-green m-3">
        El pedido con id {idPedido} se guardó correctamente!
      </div>
    );
  }

  return (
    <>
      <aside className='cart'>
        {totalProductos === 0 ? (
          <p className="text-danger">Sin instrumentos en el carrito.</p>
        ) : (
          <>
            <ul>
              {cart.map((detalle, index) => (
                <CartItem
                  detalle={detalle}
                  key={index}
                />
              ))}
            </ul>
            <div>
              <h3>${totalProductos}</h3>
            </div>

            <button onClick={limpiarCarrito} title='Limpiar Todo'>
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' strokeWidth='1' stroke='currentColor' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                <path d='M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' />
                <path d='M17 17a2 2 0 1 0 2 2' />
                <path d='M17 17h-11v-11' />
                <path d='M9.239 5.231l10.761 .769l-1 7h-2m-4 0h-7' />
                <path d='M3 3l18 18' />
              </svg>
            </button>
            <br></br>
            <button className="btn-guardar" onClick={handleGuardarCarrito}>
              GUARDAR CARRITO
            </button>
            <CheckoutMP montoCarrito={totalProductos}></CheckoutMP>
          </>

        )}

      </aside>
    </>
  )
}
