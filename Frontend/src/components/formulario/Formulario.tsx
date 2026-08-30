import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Instrumento from '../../entities/Instrumento';
import InstrumentoService from '../../services/InstrumentoService';
import CategoriaService from '../../services/CategoriaService';
import Categoria from '../../entities/Categoria';
import LoaderPage from '../LoaderPage/LoaderPage';
import { urlImagen } from '../../services/imagenes';
import '../../styles/panelAdmin.css'
import './Formulario.css'

function Formulario() {
    const navigate = useNavigate();

    const { id: idInstrumento } = useParams();
    const esNuevo = idInstrumento === undefined || idInstrumento === '0';

    const [instrumento, setInstrumento] = useState<Instrumento>(new Instrumento());
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [txtValidacion, setTxtValidacion] = useState<string>("");
    const [cargando, setCargando] = useState(!esNuevo);
    const [error, setError] = useState(false);
    // Archivo recién elegido, todavía no subido: se sube recién al guardar,
    // así cancelar el formulario no deja imágenes sueltas en el servidor.
    const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
    const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
    const [subiendoImagen, setSubiendoImagen] = useState(false);
    const instrumentoService = new InstrumentoService();
    const categoriaService = new CategoriaService();
    const url = import.meta.env.VITE_API_URL;

    const actualizar = (cambios: Partial<Instrumento>) =>
        setInstrumento((previo) => ({ ...previo, ...cambios }));

    useEffect(() => {
        const getCategorias = async () => {
            try {
                const categorias = await categoriaService.getAll(url + "categoria");
                setCategorias(categorias);
            } catch (e) {
                console.error("Error al obtener las categorías:", e);
            }
        };

        const getInstrument = async () => {
            if (esNuevo) {
                setInstrumento(new Instrumento());
                return;
            }
            try {
                const instrumentoId = parseInt(idInstrumento!, 10);
                const instrumentoSelect = await instrumentoService.get(url + 'instrumentos', instrumentoId);
                setInstrumento(instrumentoSelect);
            } catch (e) {
                // Sin esto, un instrumento inexistente dejaba el formulario vacío sin avisar
                console.error('Error al obtener el instrumento:', e);
                setError(true);
            } finally {
                setCargando(false);
            }
        };

        getCategorias();
        getInstrument();
    }, []);

    // Vista previa instantánea del archivo elegido, sin esperar a que se suba
    useEffect(() => {
        if (!archivoImagen) {
            setVistaPrevia(null);
            return;
        }
        const objectUrl = URL.createObjectURL(archivoImagen);
        setVistaPrevia(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [archivoImagen]);

    const save = async () => {
        if (!instrumento.instrumento) {
            setTxtValidacion("Ingresá el nombre del instrumento");
            return;
        }
        if (!instrumento.marca) {
            setTxtValidacion("Ingresá la marca");
            return;
        }
        if (!instrumento.modelo) {
            setTxtValidacion("Ingresá el modelo");
            return;
        }
        if (!instrumento.precio) {
            setTxtValidacion("El precio debe ser distinto de cero");
            return;
        }
        if (!archivoImagen && !instrumento.imagen) {
            setTxtValidacion("Elegí una imagen");
            return;
        }
        if (!instrumento.descripcion) {
            setTxtValidacion("Ingresá una descripción");
            return;
        }
        if (!instrumento.categoria?.id) {
            setTxtValidacion("Elegí una categoría");
            return;
        }
        if (instrumento.costoEnvio !== 'G' && !isValidCostoEnvio(instrumento.costoEnvio)) {
            setTxtValidacion("El costo de envío tiene que ser un número");
            return;
        }

        // Mientras no se elija un archivo nuevo, edita conservando la imagen que ya tenía
        let nombreImagen = instrumento.imagen;

        if (archivoImagen) {
            setSubiendoImagen(true);
            const formData = new FormData();
            formData.append('archivo', archivoImagen);
            try {
                nombreImagen = await instrumentoService.saveWithFile(url + 'instrumentos/imagen', formData);
            } catch (e) {
                console.error('Error al subir la imagen:', e);
                setTxtValidacion(e instanceof Error ? e.message : 'No se pudo subir la imagen.');
                setSubiendoImagen(false);
                return;
            }
            setSubiendoImagen(false);
        }

        try {
            await instrumentoService.post(url + 'instrumentos', { ...instrumento, imagen: nombreImagen });
            navigate('/grilla');
        } catch (e) {
            console.error("Error al guardar el instrumento:", e);
            setTxtValidacion("No se pudo guardar. Probá de nuevo más tarde.");
        }
    }

    const isValidCostoEnvio = (costoEnvio: string) => costoEnvio !== '' && !isNaN(parseFloat(costoEnvio));

    if (cargando) {
        return <LoaderPage />;
    }

    if (error) {
        return (
            <div className="panel">
                <div className="alert alert-danger" role="alert">No encontramos este instrumento.</div>
                <Link to="/grilla" className="panel-boton panel-boton--secundario">Volver a la grilla</Link>
            </div>
        );
    }

    const envioGratis = instrumento.costoEnvio === 'G';
    // La vista previa del archivo recién elegido tiene prioridad sobre la imagen ya guardada
    const srcVistaPrevia = vistaPrevia ?? (instrumento.imagen ? urlImagen(instrumento.imagen) : null);

    return (
        <div className="panel">
            <header className="panel__encabezado">
                <div>
                    <h1 className="panel__titulo">{esNuevo ? 'Nuevo instrumento' : 'Editar instrumento'}</h1>
                </div>
                <Link to="/grilla" className="panel-boton panel-boton--secundario">
                    <i className="bi bi-arrow-left" aria-hidden="true"></i> Volver
                </Link>
            </header>

            <div className="formulario">
                <div className="formulario__campos">
                    <div className="formulario__campo">
                        <label htmlFor="txtInstrumento">Nombre del instrumento</label>
                        <input
                            type="text"
                            id="txtInstrumento"
                            placeholder="Ej: Guitarra Eléctrica"
                            value={instrumento.instrumento}
                            onChange={e => actualizar({ instrumento: e.target.value })}
                        />
                    </div>

                    <div className="formulario__campo">
                        <label htmlFor="txtMarca">Marca</label>
                        <input
                            type="text"
                            id="txtMarca"
                            placeholder="Ej: Fender"
                            value={instrumento.marca}
                            onChange={e => actualizar({ marca: e.target.value })}
                        />
                    </div>

                    <div className="formulario__campo">
                        <label htmlFor="txtRubro">Modelo</label>
                        <input
                            type="text"
                            id="txtRubro"
                            placeholder="Ej: Stratocaster"
                            value={instrumento.modelo}
                            onChange={e => actualizar({ modelo: e.target.value })}
                        />
                    </div>

                    <div className="formulario__campo">
                        <label htmlFor="selectCategoria">Categoría</label>
                        <select
                            id="selectCategoria"
                            value={instrumento.categoria?.id ?? ''}
                            onChange={(e) => {
                                const categoriaSeleccionada = categorias.find(c => c.id === Number(e.target.value));
                                if (categoriaSeleccionada) actualizar({ categoria: categoriaSeleccionada });
                            }}
                        >
                            <option value="">Seleccioná una categoría</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>{categoria.denominacion}</option>
                            ))}
                        </select>
                    </div>

                    <div className="formulario__campo">
                        <label htmlFor="txtPrecio">Precio</label>
                        <input
                            type="number"
                            id="txtPrecio"
                            placeholder="0"
                            value={instrumento.precio || ''}
                            onChange={e => actualizar({ precio: Number(e.target.value) })}
                        />
                    </div>

                    <div className="formulario__campo">
                        <label htmlFor="txtCantidadVendida">Cantidad vendida</label>
                        <input
                            type="number"
                            id="txtCantidadVendida"
                            placeholder="0"
                            value={instrumento.cantidadVendida || ''}
                            onChange={e => actualizar({ cantidadVendida: Number(e.target.value) })}
                        />
                    </div>

                    <div className="formulario__campo formulario__campo--envio">
                        <label>Envío</label>
                        <label className="formulario__checkbox">
                            <input
                                type="checkbox"
                                checked={envioGratis}
                                onChange={e => actualizar({ costoEnvio: e.target.checked ? 'G' : '' })}
                            />
                            Envío gratis a todo el país
                        </label>
                        {!envioGratis && (
                            <input
                                type="number"
                                placeholder="Costo de envío al interior"
                                value={instrumento.costoEnvio === 'G' ? '' : instrumento.costoEnvio}
                                onChange={e => actualizar({ costoEnvio: e.target.value })}
                            />
                        )}
                    </div>

                    <div className="formulario__campo formulario__campo--imagen">
                        <label htmlFor="txtImagen">Imagen</label>
                        <input
                            type="file"
                            id="txtImagen"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={e => setArchivoImagen(e.target.files?.[0] ?? null)}
                        />
                        {srcVistaPrevia && (
                            <img className="formulario__vista-previa" src={srcVistaPrevia} alt="" />
                        )}
                    </div>

                    <div className="formulario__campo formulario__campo--ancho">
                        <label htmlFor="txtDescripcion">Descripción</label>
                        <textarea
                            id="txtDescripcion"
                            placeholder="Descripción para la ficha del producto"
                            value={instrumento.descripcion}
                            onChange={e => actualizar({ descripcion: e.target.value })}
                        ></textarea>
                    </div>
                </div>

                {txtValidacion && (
                    <p className="formulario__error" role="alert">{txtValidacion}</p>
                )}

                <div className="formulario__acciones">
                    <button onClick={save} type="button" className="panel-boton panel-boton--principal" disabled={subiendoImagen}>
                        {subiendoImagen ? 'Subiendo imagen…' : 'Guardar'}
                    </button>
                    <Link to="/grilla" className="panel-boton panel-boton--secundario">Cancelar</Link>
                </div>
            </div>
        </div>
    )
}

export default Formulario
