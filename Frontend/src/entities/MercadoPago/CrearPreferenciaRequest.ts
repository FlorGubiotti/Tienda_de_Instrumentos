export interface ItemPedidoRequest {
  instrumentoId: number;
  cantidad: number;
}

export default class CrearPreferenciaRequest {
  titulo: string = "";
  items: ItemPedidoRequest[] = [];
}
