import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { confirmarPago } from "../../services/PagoService";

export type EstadoPago = 'success' | 'pending' | 'failure';

const mensajes = {
    success: {
        titulo: '¡Pago aprobado!',
        detalle: 'Tu pago se acreditó correctamente. ¡Gracias por tu compra!',
        clase: 'alert-success',
    },
    pending: {
        titulo: 'Pago pendiente',
        detalle: 'Tu pago está siendo procesado. Te avisaremos cuando se acredite.',
        clase: 'alert-warning',
    },
    failure: {
        titulo: 'No pudimos procesar tu pago',
        detalle: 'El pago fue rechazado o cancelado. Podés intentarlo nuevamente.',
        clase: 'alert-danger',
    },
    sinVerificar: {
        titulo: 'No pudimos confirmar tu pago',
        detalle: 'No logramos verificar el estado del pago con Mercado Pago. Si el débito se realizó, se acreditará en breve.',
        clase: 'alert-secondary',
    },
};

const estadoPedidoAEstadoPago: Record<string, EstadoPago> = {
    PAGADO: 'success',
    PENDIENTE: 'pending',
    RECHAZADO: 'failure',
};

function ResultadoPago({ estado }: { estado: EstadoPago }) {
    // Mercado Pago vuelve con estos parámetros en la URL
    const [searchParams] = useSearchParams();
    const paymentId = searchParams.get('payment_id');

    const [estadoVerificado, setEstadoVerificado] = useState<EstadoPago | null>(null);
    const [falloVerificacion, setFalloVerificacion] = useState(false);
    const [pedidoId, setPedidoId] = useState<number | null>(null);
    const [verificando, setVerificando] = useState<boolean>(paymentId !== null);

    useEffect(() => {
        if (!paymentId) {
            return;
        }
        const verificar = async () => {
            try {
                const confirmacion = await confirmarPago(paymentId);
                setEstadoVerificado(estadoPedidoAEstadoPago[confirmacion.estadoPedido] ?? 'pending');
                setPedidoId(confirmacion.pedidoId);
            } catch (error) {
                console.error('No se pudo verificar el pago:', error);
                setFalloVerificacion(true);
            } finally {
                setVerificando(false);
            }
        };
        verificar();
    }, [paymentId]);

    if (verificando) {
        return (
            <div className="container text-center mt-5">
                <p>Verificando el estado de tu pago...</p>
            </div>
        );
    }

    // Solo se afirma el resultado del pago si lo confirmó el servidor. Si la verificación
    // falló no se repite lo que dice la URL, porque el navegador no es una fuente confiable.
    const { titulo, detalle, clase } = falloVerificacion
        ? mensajes.sinVerificar
        : mensajes[estadoVerificado ?? estado];

    return (
        <div className="container text-center mt-5">
            <div className={`alert ${clase}`} role="alert">
                <h2>{titulo}</h2>
                <p className="mb-0">{detalle}</p>
            </div>
            {pedidoId && (
                <p className="text-muted">Número de pedido: {pedidoId}</p>
            )}
            {paymentId && (
                <p className="text-muted">Número de operación: {paymentId}</p>
            )}
            <Link to="/products" className="btn btn-primary mt-3">
                Volver a los productos
            </Link>
        </div>
    );
}

export default ResultadoPago;
