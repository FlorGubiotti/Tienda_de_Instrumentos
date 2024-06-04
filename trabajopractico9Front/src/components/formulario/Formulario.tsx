import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Instrumento from '../../entities/Instrumento';
import InsrtumentoService from '../../services/InstrumentoService';
import CategoriaService from '../../services/CategoriaService';
import Categoria from '../../entities/Categoria';


function Formulario() {
    const navigate = useNavigate();

    const { idInstrumento } = useParams();
    const [instrumento, setInstrumento] = useState<Instrumento>(new Instrumento());
    const [categorias, setCategorias] = useState<Categoria[]>([]); // Aquí se especifica el tipo explícito
    const [txtValidacion, setTxtValidacion] = useState<string>("");
    const instrumentoService = new InsrtumentoService();
    const categoriaService = new CategoriaService();
    const url = import.meta.env.VITE_API_URL;

    const getInstrument = async () => {
        if (idInstrumento !== undefined && idInstrumento !== '0') {
            const instrumentoId = parseInt(idInstrumento, 10); // Parsea el idInstrumento a número
            if (!isNaN(instrumentoId)) {
                const instrumentoSelect = await instrumentoService.get(url + 'instrumentos', instrumentoId);
                if (instrumentoSelect) {
                    setInstrumento(instrumentoSelect); // Actualiza el estado con el instrumento seleccionado
                } else {
                    setTxtValidacion("No se encontró el instrumento con el ID proporcionado.");
                }
            } else {
                setTxtValidacion("El ID del instrumento no es válido.");
            }
        } else {
            const instrumentoSelect = new Instrumento();
            setInstrumento(instrumentoSelect); // Actualiza el estado con un nuevo objeto Instrumento
        }

    };
    const getCategorias = async () => {
        try {
            const categorias = await categoriaService.getAll(url + "categoria");
            setCategorias(categorias);
        } catch (error) {
            console.error("Error al obtener las categorías:", error);
        }
    };

    useEffect(() => {
        getCategorias();
        getInstrument();
    }, []);

    const save = async () => {
        if (!instrumento.marca || instrumento.marca === "") {
            setTxtValidacion("Ingrese la marca del instrumento");
            return;
        }
        if (!instrumento.modelo || instrumento.modelo === "") {
            setTxtValidacion("Ingrese el modelo del instrumento");
            return;
        }
        if (!instrumento.precio || instrumento.precio === 0) {
            setTxtValidacion("El precio debe ser distinto de cero");
            return;
        }
        if (idInstrumento === '0') {
            const imageInput = document.getElementById('txtImagen') as HTMLInputElement;
            if (!imageInput?.files?.[0]) {
                setTxtValidacion("Por favor, seleccione una imagen");
                return;
            }
        }
        if (!instrumento.descripcion || instrumento.descripcion === "") {
            setTxtValidacion("Ingrese una descripción del instrumento");
            return;
        }
        if (!instrumento.categoria || instrumento.categoria.denominacion === "") {
            setTxtValidacion("Ingrese la categoría del instrumento");
            return;
        }

        // Procesamiento del costo de envío
        if (instrumento.costoEnvio === "Gratis") {
            instrumento.costoEnvio = "G"; // Asigna "G" si el costo de envío es "Gratis"
        } else if (!isValidCostoEnvio(instrumento.costoEnvio)) {
            setTxtValidacion("El costo de envío ingresado no es válido. Ingrese 'Gratis' o un número");
            return;
        }

        try {
            // Guardar el instrumento
            await instrumentoService.post(url + 'instrumentos', instrumento);
            navigate('/grilla');
        } catch (error) {
            console.error("Error al guardar el instrumento:", error);
        }

    }

    const isValidCostoEnvio = (costoEnvio: string) => {
        if (costoEnvio === "Gratis") {
            return true;
        } else {
            const parsedCostoEnvio = parseFloat(costoEnvio);
            return !isNaN(parsedCostoEnvio);
        }
    };
    

    return (
        <>
            <div className="center" style={{ margin: '20px' }}>
                <div className="mb-3">
                    <label htmlFor="txtNombre" className="form-label">Marca</label>
                    <input type="text" id='txtNombre' className="form-control" placeholder="Ingrese la marca" defaultValue={instrumento?.marca} onChange={e => instrumento.marca = String(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="txtPrecio" className="form-label">Precio</label>
                    <input
                        type="number"
                        id='txtPrecio'
                        className="form-control"
                        placeholder="Ingrese el precio"
                        value={instrumento?.precio || ''}
                        onChange={e => setInstrumento(prevInstrumento => ({
                            ...prevInstrumento,
                            precio: Number(e.target.value)
                        }))}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="txtRubro" className="form-label">Modelo</label>
                    <input type="text" id='txtRubro' className="form-control" placeholder="Ingrese el modelo" defaultValue={instrumento?.modelo} onChange={e => instrumento.modelo = String(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="txtDescripcion" className="form-label">Descripción</label>
                    <textarea id='txtDescripcion' className="form-control" placeholder="Ingrese la descripción" defaultValue={instrumento?.descripcion} onChange={e => instrumento.descripcion = String(e.target.value)}></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="selectCategoria" className="form-label">Categoría</label>
                    <select
                        id='selectCategoria'
                        className="form-select"
                        value={instrumento.categoria ? instrumento.categoria.id : ''} // Selecciona el ID de la categoría asociada al instrumento si existe
                        onChange={(e) => {
                            const categoriaId = parseInt(e.target.value);
                            const categoriaSeleccionada = categorias.find(categoria => categoria.id === categoriaId);
                            if (categoriaSeleccionada) {
                                setInstrumento({ ...instrumento, categoria: categoriaSeleccionada });
                            } else {
                                console.error("No se encontró la categoría seleccionada");
                            }
                        }}
                    >
                        <option value="">Seleccione una categoría</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>{categoria.denominacion}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="txtCostoEnvio" className="form-label">Costo de Envío</label>
                    <input
                        type="text"
                        id='txtCostoEnvio'
                        className="form-control"
                        placeholder="Ingrese el costo de envío (Gratis o un número del precio de envío)"
                        value={instrumento?.costoEnvio === 'G' ? 'Gratis' : instrumento?.costoEnvio}
                        onChange={e => setInstrumento(prevInstrumento => ({ ...prevInstrumento, costoEnvio: e.target.value }))}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="txtRubro" className="form-label">Cantidad Vendida</label>
                    <input
                        type="number"
                        id='txtCantidadVendida'
                        className="form-control"
                        placeholder="Ingrese la cantidad vendida"
                        value={instrumento?.cantidadVendida !== undefined && instrumento?.cantidadVendida !== null && instrumento?.cantidadVendida !== 0 ? instrumento?.cantidadVendida : ''}
                        onChange={e => setInstrumento(prevInstrumento => ({
                            ...prevInstrumento,
                            cantidadVendida: Number(e.target.value)
                        }))}
                    />

                </div>
                <div>
                    <p style={{ color: 'red', lineHeight: 5, padding: 5 }}>{txtValidacion}</p>
                </div>
                <div className="col">
                    <button onClick={save} className="btn btn-success" type="button">
                        Guardar
                    </button>
                    <a href={`/grilla`} style={{ marginLeft: 25 }}>
                        <button type="button" className="btn btn-warning">Volver</button>
                    </a>
                </div>
            </div>
        </>
    )
}

export default Formulario