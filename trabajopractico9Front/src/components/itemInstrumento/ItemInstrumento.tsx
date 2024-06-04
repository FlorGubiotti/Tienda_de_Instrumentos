import { Link } from "react-router-dom";
import imagenCamion from "./../../../public/images/camion.png";
import Instrumento from "../../entities/Instrumento";
import { useCarrito } from "../../hooks/useCarrito";
import "./ItemInstrumento.css"
import { CarritoContextProvider } from "../../context/CarritoContext";

type InstrumentoParams = {
    id: number;
    instrumento: string;
    marca: string;
    modelo: string;
    imagen: string;
    precio: number;
    costoEnvio: string;
    cantidadVendida: number;
    descripcion: string;
    isProductInCart?: boolean;
    initialHayStock:boolean;
    instrumentoObject: Instrumento;
}

function ItemInstrumento(args: InstrumentoParams) {

    const { addCarrito, removeCarrito, cart, removeItemCarrito } = useCarrito()

    const verificaInstrumentoEnCarrito = (product: Instrumento) => {
        return cart.some(item => item.id === product.id)
    }

    const isInstrumentoInCarrito = verificaInstrumentoEnCarrito(args.instrumentoObject)

    const costoEnvioText = args.costoEnvio === "G" ? (
        <span className="text-success">
            <img src={imagenCamion} alt="Envío gratis" /> Envío gratis a todo el país
        </span>
    ) : (
        <span className="text-warning">
            Costo de Envío Interior de Argentina ${args.costoEnvio}
        </span>
    );

    return (
        <>
            <CarritoContextProvider>
            <div key={args.id} className="col-sm-4 mb-4 mb-sm-0 espacio">
                <div className="card tarjeta">
                    <div>
                        <img src={`./images/${args.imagen}`} className="card-img-top img-altura" alt={args.imagen} />
                    </div>
                    <div className="card-body altura-cuerpo">
                        <p className="card-title">{args.instrumento}</p>
                        <p className="card-text h1">$ {args.precio}</p>
                        <p className={`card-text`}>{costoEnvioText}</p>
                        <p className='card-text'>{args.cantidadVendida} vendidos</p>
                        <br />
                        <Link to={`/products/detalle/${args.id}`} className="btn btn-primary">Ver Detalle</Link>
                        <hr></hr>
                        <div className="icon-container">
                        <a className='iconoMasMenos' onClick={() => removeItemCarrito(args.instrumentoObject)}>
                            -
                        </a>
                        <button className='colorFondoBlanco'
                            onClick={() => {
                                isInstrumentoInCarrito
                                    ? removeCarrito(args.instrumentoObject)
                                    : addCarrito(args.instrumentoObject)
                            }}
                        >
                            {
                                isInstrumentoInCarrito
                                    ? <i className="bi bi-cart-dash" title="Quitar"></i>
                                    : <i className="bi bi-cart-check" title="Comprar"></i>
                            }
                        </button>
                        <a className='iconoMasMenos' onClick={() => addCarrito(args.instrumentoObject)}>
                            +
                        </a>
                    </div>
                    </div>
                </div>
            </div>
            </CarritoContextProvider>
            
        </>
    )
}

export default ItemInstrumento