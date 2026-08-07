import { useState } from "react";
import PreferenceMPService from "../../services/PreferenceMPService";
import Pedido from "../../entities/Pedido";
import { Wallet, initMercadoPago } from "@mercadopago/sdk-react";
import './CheckoutMP.css'

function CheckoutMP({ montoCarrito = 0 }) {
  const [idPreference, setIdPreference] = useState<string>('');
  const preferenceMPService = new PreferenceMPService();
  const [mostrarPagoMP, setMostrarPagoMP] = useState(false); 

  const getPreferenceMP = async () => {
    if (montoCarrito > 0) {
      const nuevoPedido = new Pedido();
      nuevoPedido.titulo = 'Pedido Musical Hendrix';
      nuevoPedido.totalPedido = montoCarrito;

      try {
        const response = await preferenceMPService.createPreferenceMP(nuevoPedido);
        if (response && response.id) {
          console.log("Preference id: " + response.id);
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
