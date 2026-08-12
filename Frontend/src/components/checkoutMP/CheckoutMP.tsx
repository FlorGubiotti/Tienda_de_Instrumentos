import { useState } from "react";
import PreferenceMPService from "../../services/PreferenceMPService";
import DetallePedido from "../../entities/DetallePedido";
import CrearPreferenciaRequest from "../../entities/MercadoPago/CrearPreferenciaRequest";
import { Wallet, initMercadoPago } from "@mercadopago/sdk-react";
import './CheckoutMP.css'

interface CheckoutMPProps {
  cart: DetallePedido[];
}

function CheckoutMP({ cart }: CheckoutMPProps) {
  const [idPreference, setIdPreference] = useState<string>('');
  const preferenceMPService = new PreferenceMPService();
  const [mostrarPagoMP, setMostrarPagoMP] = useState(false);

  const getPreferenceMP = async () => {
    if (cart.length > 0) {
      const request = new CrearPreferenciaRequest();
      request.titulo = 'Pedido Musical Hendrix';
      request.items = cart.map((detalle) => ({
        instrumentoId: detalle.instrumento.id,
        cantidad: detalle.cantidad,
      }));

      try {
        const response = await preferenceMPService.createPreferenceMP(request);
        if (response && response.id) {
          setIdPreference(response.id);
          setMostrarPagoMP(true);
        } else {
          console.error('Error: La respuesta de la API no contiene un ID de preferencia.');
        }
      } catch (error) {
        console.error('Error al crear preferencia de Mercado Pago:', error);
      }
    } else {
      alert("Agregue al menos un plato al carrito");
    }
  };

  initMercadoPago('TEST-73f06669-bf48-44f1-8d81-80799191f2ab', { locale: 'es-AR' });

  return (
    <div>
      <button onClick={getPreferenceMP} className="btn-mercado-pago" >COMPRAR con Mercado Pago</button>
      {mostrarPagoMP && (
              <div className={idPreference ? 'divVisible' : 'divInvisible'}>
              <Wallet initialization={{ preferenceId: idPreference, redirectMode: "blank" }} customization={{ texts: { valueProp: 'smart_option' } }} />
            </div>
      )}

    </div>
  );
}

export default CheckoutMP;
