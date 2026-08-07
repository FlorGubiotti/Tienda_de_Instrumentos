import { ReactNode, createContext, useState } from "react";
import DetallePedido from "../entities/DetallePedido";
import DetallePedidoService from "../services/DetallePedidoService";
import Instrumento from "../entities/Instrumento";
import Pedido from "../entities/Pedido";
import PedidoService from "../services/PedidoService";

interface CartContextType {
    cart: DetallePedido[],
    addCarrito: (product: Instrumento) => void,
    removeCarrito: (product: Instrumento) => void,
    removeItemCarrito: (product: Instrumento) => void,
    limpiarCarrito: () => void,
    crearPedidoDetalle: () => Promise<number>
}

//crear contexto
export const CartContext = createContext<CartContextType>({
    cart: [],
    addCarrito: () => { },
    removeCarrito: () => { },
    removeItemCarrito: () => { },
    limpiarCarrito: () => { },
    crearPedidoDetalle: async () => 0
});

export function CarritoContextProvider({ children }: { children: ReactNode }) {

    const [cart, setCart] = useState<DetallePedido[]>([]);
    const detallePedidoService = new DetallePedidoService();
    const pedidoService = new PedidoService();
    const url = import.meta.env.VITE_API_URL;


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

    const crearPedidoDetalle = async (): Promise<number> => {
        try {
            // Crear un nuevo pedido con la fecha y el total
            const nuevoPedido = new Pedido();
            nuevoPedido.fecha = new Date();
            nuevoPedido.totalPedido = cart.reduce((total, detalle) => total + detalle.instrumento.precio * detalle.cantidad, 0);

            // Guardar el pedido en el backend
            const respuestaPedido = await pedidoService.post(url + "pedido", nuevoPedido);

            // Obtener el ID del pedido recién creado
            const pedidoId = respuestaPedido.id;

            // Crear los detalles del pedido y asignarles el ID del pedido
            const detallesConPedido: DetallePedido[] = cart.map(detalle => {
                const pedidoDetalle = new DetallePedido();
                pedidoDetalle.instrumento = detalle.instrumento;
                pedidoDetalle.cantidad = detalle.cantidad;
                pedidoDetalle.pedido = respuestaPedido; // Asignar el pedido completo o al menos el ID
                return pedidoDetalle;
            });

            // Guardar los detalles del pedido en el backend
            const detallesRespuesta = await Promise.all(detallesConPedido.map(detalle => detallePedidoService.post(url + "detallePedido", detalle)));

            console.log(detallesRespuesta);

            // Limpiar el carrito después de guardar
            limpiarCarrito();

            // Devolver el ID del pedido como parte de la resolución de la promesa
            return pedidoId;
        } catch (error) {
            console.error('Error al crear el pedido:', error);
            throw error;
        }
    };


    return (
        <CartContext.Provider value={{ cart, addCarrito, limpiarCarrito, removeCarrito, removeItemCarrito, crearPedidoDetalle }}>
            {children}
        </CartContext.Provider>
    );
}