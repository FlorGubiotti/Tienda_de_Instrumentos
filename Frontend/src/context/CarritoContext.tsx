import { ReactNode, createContext, useState } from "react";
import DetallePedido from "../entities/DetallePedido";
import Instrumento from "../entities/Instrumento";
import Pedido from "../entities/Pedido";

interface CartContextType {
    cart: DetallePedido[],
    addCarrito: (product: Instrumento) => void,
    removeCarrito: (product: Instrumento) => void,
    removeItemCarrito: (product: Instrumento) => void,
    limpiarCarrito: () => void
}

//crear contexto
export const CartContext = createContext<CartContextType>({
    cart: [],
    addCarrito: () => { },
    removeCarrito: () => { },
    removeItemCarrito: () => { },
    limpiarCarrito: () => { }
});

export function CarritoContextProvider({ children }: { children: ReactNode }) {

    const [cart, setCart] = useState<DetallePedido[]>([]);

    const addCarrito = (product: Instrumento) => {
        // lógica para agregar un producto al carrito
        const existe = cart.some((detalle) => detalle.instrumento.id === product.id);
        if (existe) {
            const cartClonado = cart.map((detalle) =>
                detalle.instrumento.id === product.id
                    ? { ...detalle, cantidad: detalle.cantidad + 1 }
                    : detalle
            );
            setCart(cartClonado);
        } else {
            const nuevoDetalle: DetallePedido = {
                id: cart.length + 1,
                cantidad: 1,
                instrumento: product,
                pedido: new Pedido(),
            };
            setCart((prevCart) => [...prevCart, nuevoDetalle]);
        }
    };

    const removeCarrito = async (product: Instrumento) => {
        await setCart(prevCart => prevCart.filter(item => item.instrumento.id !== product.id))
    };

    const removeItemCarrito = (product: Instrumento) => {
        // lógica para eliminar un producto del carrito
        const existe = cart.some((detalle) => detalle.instrumento.id === product.id);
        if (existe) {
            const cartClonado = cart.map((detalle) =>
                detalle.instrumento.id === product.id
                    ? { ...detalle, cantidad: detalle.cantidad - 1 }
                    : detalle
            ).filter((detalle) => detalle.cantidad > 0);
            setCart(cartClonado);
        }
    };

    const limpiarCarrito = () => {
        setCart([])
    }

    return (
        <CartContext.Provider value={{ cart, addCarrito, limpiarCarrito, removeCarrito, removeItemCarrito }}>
            {children}
        </CartContext.Provider>
    );
}
