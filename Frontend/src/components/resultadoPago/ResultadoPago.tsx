import { Link, useSearchParams } from "react-router-dom";

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
};

function ResultadoPago({ estado }: { estado: EstadoPago }) {
    // Mercado Pago vuelve con estos parámetros en la URL
    const [searchParams] = useSearchParams();
    const paymentId = searchParams.get('payment_id');

    const { titulo, detalle, clase } = mensajes[estado];

    return (
        <div className="container text-center mt-5">
            <div className={`alert ${clase}`} role="alert">
                <h2>{titulo}</h2>
                <p className="mb-0">{detalle}</p>
            </div>
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
