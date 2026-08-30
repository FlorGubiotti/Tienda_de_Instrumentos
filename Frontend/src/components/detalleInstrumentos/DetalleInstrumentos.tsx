import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import Instrumento from "../../entities/Instrumento";
import InstrumentoService from "../../services/InstrumentoService";
import './DetalleInstrumentos.css';
import { formatearPrecio, nombreCategoria } from "../../services/formato";
import { urlImagen } from "../../services/imagenes";
import { useCarrito } from "../../hooks/useCarrito";
import LoaderPage from "../LoaderPage/LoaderPage";

const DetalleInstrumentos = () => {
  const { id } = useParams();

  const [instrumento, setInstrumento] = useState<Instrumento | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const { cart, addCarrito, removeItemCarrito } = useCarrito();
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const traerInstrumento = async () => {
      if (!id) {
        setError(true);
        setCargando(false);
        return;
      }
      try {
        const servicio = new InstrumentoService();
        setInstrumento(await servicio.get(url + 'instrumentos', parseInt(id)));
      } catch (e) {
        // Sin esto, un instrumento inexistente dejaba la pantalla en "Cargando" para siempre
        console.error('Error al obtener el instrumento:', e);
        setError(true);
      } finally {
        setCargando(false);
      }
    };
    traerInstrumento();
  }, [id]);

  if (cargando) {
    return <LoaderPage />;
  }

  if (error || !instrumento) {
    return (
      <div className="detalle">
        <div className="alert alert-danger" role="alert">
          No encontramos este instrumento.
        </div>
        <Link to="/products" className="detalle__volver">← Volver al catálogo</Link>
      </div>
    );
  }

  const enCarrito = cart.find((detalle) => detalle.instrumento.id === instrumento.id);
  const cantidad = enCarrito?.cantidad ?? 0;
  const envioGratis = instrumento.costoEnvio === 'G';

  return (
    <div className="detalle">
      <Link to="/products" className="detalle__volver">← Volver al catálogo</Link>

      <div className="detalle__cuerpo">
        <div className="detalle__imagen">
          <img src={urlImagen(instrumento.imagen)} alt={instrumento.instrumento} />
        </div>

        <div className="detalle__datos">
          {instrumento.categoria?.denominacion && (
            <p className="detalle__categoria">{nombreCategoria(instrumento.categoria.denominacion)}</p>
          )}

          <h1 className="detalle__titulo">{instrumento.instrumento}</h1>
          <p className="detalle__marca">{instrumento.marca} · {instrumento.modelo}</p>

          <p className="detalle__precio">{formatearPrecio(instrumento.precio)}</p>

          <p className={envioGratis ? 'detalle__envio detalle__envio--gratis' : 'detalle__envio'}>
            {envioGratis
              ? <><i className="bi bi-truck" aria-hidden="true"></i> Envío gratis a todo el país</>
              : `Costo de envío al interior: $${instrumento.costoEnvio}`}
          </p>

          <p className="detalle__vendidos">{instrumento.cantidadVendida} vendidos</p>

          <div className="detalle__acciones">
            {cantidad === 0 ? (
              <button type="button" className="detalle__agregar" onClick={() => addCarrito(instrumento)}>
                <i className="bi bi-cart-plus" aria-hidden="true"></i> Añadir al carrito
              </button>
            ) : (
              <div className="detalle__cantidad">
                <button
                  type="button"
                  onClick={() => removeItemCarrito(instrumento)}
                  aria-label={`Quitar una unidad de ${instrumento.instrumento}`}
                >
                  −
                </button>
                <span>{cantidad} en el carrito</span>
                <button
                  type="button"
                  onClick={() => addCarrito(instrumento)}
                  aria-label={`Agregar una unidad de ${instrumento.instrumento}`}
                >
                  +
                </button>
              </div>
            )}
          </div>

          {instrumento.descripcion && (
            <div className="detalle__descripcion">
              <h2>Descripción</h2>
              <p>{instrumento.descripcion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

}

export default DetalleInstrumentos;
