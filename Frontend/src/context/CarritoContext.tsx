import { ReactNode, createContext, useMemo, useState } from "react";
import DetallePedido from "../entities/DetallePedido";
import Instrumento from "../entities/Instrumento";
import Pedido from "../entities/Pedido";

interface CartContextType {
    cart: DetallePedido[],
    /** Suma de unidades, para el contador del carrito en la barra */
    cantidadTotal: number,
    total: number,
    addCarrito: (product: Instrumento) => void,
    removeCarrito: (product: Instrumento) => void,
    removeItemCarrito: (product: Instrumento) => void,
    limpiarCarrito: () => void
}

//crear contexto
export const CartContext = createContext<CartContextType>({
    cart: [],
    cantidadTotal: 0,
    total: 0,
    addCarrito: () => { },
    removeCarrito: () => { },
    removeItemCarrito: () => { },
    limpiarCarrito: () => { }
});

export function CarritoContextProvider({ children }: { children: ReactNode }) {

    const [cart, setCart] = useState<DetallePedido[]>([]);

    /*
     * Todas las actualizaciones usan la forma funcional de setCart. Antes
     * algunas leían `cart` del render actual, así que dos clicks seguidos
     * podían partir del mismo estado y perderse uno.
     */

    const addCarrito = (product: Instrumento) => {
        setCart((carritoPrevio) => {
            const existe = carritoPrevio.some((detalle) => detalle.instrumento.id === product.id);
            if (existe) {
                return carritoPrevio.map((detalle) =>
                    detalle.instrumento.id === product.id
                        ? { ...detalle, cantidad: detalle.cantidad + 1 }
                        : detalle
                );
            }
            const nuevoDetalle: DetallePedido = {
                // El id del detalle lo asigna el backend al crear el pedido; acá solo
                // hace falta que sea único por línea, y el del instrumento ya lo es.
                id: product.id,
                cantidad: 1,
                instrumento: product,
                pedido: new Pedido(),
            };
            return [...carritoPrevio, nuevoDetalle];
        });
    };

    const removeCarrito = (product: Instrumento) => {
        setCart((carritoPrevio) =>
            carritoPrevio.filter((detalle) => detalle.instrumento.id !== product.id));
    };

    const removeItemCarrito = (product: Instrumento) => {
        setCart((carritoPrevio) =>
            carritoPrevio
                .map((detalle) =>
                    detalle.instrumento.id === product.id
                        ? { ...detalle, cantidad: detalle.cantidad - 1 }
                        : detalle
                )
                // Al llegar a cero la línea desaparece del carrito
                .filter((detalle) => detalle.cantidad > 0));
    };

    const limpiarCarrito = () => {
        setCart([]);
    };

    const cantidadTotal = useMemo(
        () => cart.reduce((suma, detalle) => suma + detalle.cantidad, 0),
        [cart]);

    const total = useMemo(
        () => cart.reduce((suma, detalle) => suma + detalle.instrumento.precio * detalle.cantidad, 0),
        [cart]);

    return (
        <CartContext.Provider value={{ cart, cantidadTotal, total, addCarrito, limpiarCarrito, removeCarrito, removeItemCarrito }}>
            {children}
        </CartContext.Provider>
    );
}
