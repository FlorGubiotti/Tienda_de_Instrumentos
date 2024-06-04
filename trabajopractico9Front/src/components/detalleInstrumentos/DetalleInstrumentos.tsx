import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import Instrumento from "../../entities/Instrumento";
import InstrumentoService from "../../services/InstrumentoService";
import './DetalleInstrumentos.css';
import Usuario from "../../entities/Usuario";
import { Roles } from "../../entities/Roles";

const DetalleInstrumentos = () => {
  const { id } = useParams();

  const [detalleInstrumento, setDetalleInstrumento] = useState<Instrumento | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const instrumentoService = new InstrumentoService();
  const [jsonUsuario] = useState<string | null>(localStorage.getItem('usuario'));
  const usuarioLogueado: Usuario | null = jsonUsuario ? JSON.parse(jsonUsuario) : null;
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const idNumber = parseInt(id);
        const detalleInstrumentoData = await instrumentoService.get(url + 'instrumentos', idNumber);
        setDetalleInstrumento(detalleInstrumentoData);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const generarPDF = () => {
    window.open("http://localhost:8080/api/pedido/downloadPdf/" + id, "_blank");
  }

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <div className="card custom-card" style={{ maxWidth: '100%' }}>
        <div className="row g-5">
          <div className="col-md-6">
            <img src={'/images/' + detalleInstrumento?.imagen} className="custom-image" alt={detalleInstrumento?.instrumento || 'Detalle del instrumento'} />
            <div className="col-md-12">
              <p className="card-text m-3 custom-description word-wrap-break mt-5"><b>Descripcion: <br />{detalleInstrumento?.descripcion}</b></p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card-body">
              <p className="card-text card-vendidos">{detalleInstrumento?.cantidadVendida} vendidos</p>
              <h2 className="card-title">{detalleInstrumento?.instrumento}</h2>
              <h5 className="card-subtitle mb-2 text-muted mt-4">Marca: {detalleInstrumento?.marca}</h5>
              <h5 className="card-subtitle mb-2 text-muted">Modelo: {detalleInstrumento?.modelo}</h5>
              <p className={`mt-4 card-text ${detalleInstrumento?.costoEnvio === 'G' ? 'text-success' : 'text-warning'}`}>
                {detalleInstrumento?.costoEnvio === 'G' && <img src={'/images/camion.png'} alt="Envío Gratis" />} {detalleInstrumento?.costoEnvio === 'G' ? 'Envío gratis a todo el país' : `Costo de Envío Interior de Argentina: $${detalleInstrumento?.costoEnvio}`}
              </p>
              <div className="row">
                <div className="col-md-12">
                  <Link to={`/products`} className="btn btn-primary mt-3">Añadir al carrito</Link>
                  {usuarioLogueado?.rol === Roles.ADMIN && (
                  <a className="btn btn-success mt-3 ms-3" onClick={(_e) => generarPDF()}>Generar PDF</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default DetalleInstrumentos;