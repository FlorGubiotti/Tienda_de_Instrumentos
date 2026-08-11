import { fetchConAuth } from "./BaseService";

export interface ConfirmacionPago {
  pedidoId: number;
  estadoPedido: 'PENDIENTE' | 'PAGADO' | 'RECHAZADO';
  estadoPagoMercadoPago: string;
}

/**
 * Le pide al backend que verifique el pago contra la API de Mercado Pago.
 * El navegador solo aporta el id del pago; el estado real lo resuelve el servidor.
 */
export async function confirmarPago(paymentId: string): Promise<ConfirmacionPago> {
  const url = `${import.meta.env.VITE_API_URL}mercado_pago/confirmar/${paymentId}`;
  const response = await fetchConAuth(url, { method: "POST" });

  if (!response.ok) {
    throw new Error("No se pudo verificar el pago");
  }

  return response.json();
}
