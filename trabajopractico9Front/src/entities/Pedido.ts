import DetallePedido from "./DetallePedido";

export default class Pedido{
    id: number = 0;
    fecha: Date = new Date();
    titulo: string = "";
    totalPedido: number = 0;
    detallePedido: DetallePedido[] = []
}