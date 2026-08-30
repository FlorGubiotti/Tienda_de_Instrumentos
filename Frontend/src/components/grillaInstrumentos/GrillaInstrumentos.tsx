import { useEffect, useState } from "react";
import Instrumento from "../../entities/Instrumento";
import InstrumentoService from "../../services/InstrumentoService";
import Categoria from "../../entities/Categoria";
import CategoriaService from "../../services/CategoriaService";
import { Link } from "react-router-dom";
import { Roles } from "../../entities/Roles";
import { descargarArchivo } from "../../services/descargarArchivo";
import { obtenerSesion } from "../../services/sesion";
import { formatearPrecio, nombreCategoria } from "../../services/formato";
import { urlImagen } from "../../services/imagenes";
import Modal from 'react-modal';
Modal.setAppElement('#root');
import '../../styles/panelAdmin.css'
import './GrillaInstrumentos.css'

/** "5000" -> "$ 5.000". Si no es un número (no debería pasar, la validación del formulario lo evita) se muestra tal cual. */
const formatearCostoEnvio = (costoEnvio: string): string => {
    if (costoEnvio === "G") return "Envío gratis";
    const numero = Number(costoEnvio);
    return Number.isFinite(numero) ? formatearPrecio(numero) : `$${costoEnvio}`;
};

const GrillaInstrumentos = () => {
    const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
    const instrumentoService = new InstrumentoService();
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
    const categoriaService = new CategoriaService();
    const [usuarioLogueado] = useState(() => obtenerSesion());
    const [showModal, setShowModal] = useState(false);
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [verDadosDeBaja, setVerDadosDeBaja] = useState(false);

    const esAdmin = usuarioLogueado?.rol === Roles.ADMIN;
    // El alta, la edición y la baja/reactivación de instrumentos son trabajo diario
    // de OPERADOR, no exclusivo de ADMIN. Los reportes (Excel) sí quedan para ADMIN.
    const puedeGestionarCatalogo = esAdmin || usuarioLogueado?.rol === Roles.OPERADOR;

    const abrirModal = () => setShowModal(true);
    const cerrarModal = () => setShowModal(false);

    const url = import.meta.env.VITE_API_URL;

    const cargarInstrumentos = async () => {
        const instrumentosData = verDadosDeBaja
            ? await instrumentoService.getTodos(url + 'instrumentos')
            : await instrumentoService.getAll(url + 'instrumentos');
        setInstrumentos(instrumentosData);
    };

    useEffect(() => {
        cargarInstrumentos();
    }, [verDadosDeBaja]);

    useEffect(() => {
        const fetchCategorias = async () => {
            const categoriasData = await categoriaService.getAll(url + 'categoria');
            setCategorias(categoriasData);
        };
        fetchCategorias();
    }, []);

    const filtrarPorCategoria = (instrumento: Instrumento) => {
        if (!categoriaSeleccionada) {
            return true; // Mostrar todos los instrumentos si no hay categoría seleccionada
        }
        return instrumento.categoria?.id === categoriaSeleccionada;
    };

    const deleteInstrumentos = async (idInstrumento: number) => {
        await instrumentoService.delete(url + 'instrumentos', idInstrumento);
        await cargarInstrumentos();
    };

    const reactivarInstrumento = async (idInstrumento: number) => {
        await instrumentoService.reactivar(url + 'instrumentos', idInstrumento);
        await cargarInstrumentos();
    };

    const generarExcel = async () => {
        if (fechaDesde && fechaHasta) {
            const urlExcel = `${url}pedido/downloadExcel?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
            await descargarArchivo(urlExcel, 'datos.xlsx');
            cerrarModal();
        } else {
            alert('Por favor ingresa ambas fechas.');
        }
    }

    const generarFichaPdf = async (instrumento: Instrumento) => {
        try {
            await descargarArchivo(`${url}pedido/downloadPdf/${instrumento.id}`, `${instrumento.instrumento}.pdf`);
        } catch (e) {
            console.error('Error al generar la ficha PDF:', e);
            alert('No se pudo generar el PDF. Probá de nuevo más tarde.');
        }
    }

    const instrumentosVisibles = instrumentos.filter(filtrarPorCategoria);

    return (
        <div className="panel">
            <header className="panel__encabezado">
                <div>
                    <h1 className="panel__titulo">Catálogo</h1>
                    <p className="panel__cuenta">
                        {instrumentosVisibles.length} {instrumentosVisibles.length === 1 ? 'instrumento' : 'instrumentos'}
                    </p>
                </div>
                <div className="panel__acciones">
                    {/* Reportes de ventas: reservados a ADMIN */}
                    {esAdmin && (
                        <button type="button" className="panel-boton panel-boton--secundario" onClick={abrirModal}>
                            <i className="bi bi-file-earmark-spreadsheet" aria-hidden="true"></i> Generar Excel
                        </button>
                    )}
                    {/* Alta de instrumentos: ADMIN y OPERADOR */}
                    {puedeGestionarCatalogo && (
                        <Link className="panel-boton panel-boton--principal" to="/formulario/0">
                            <i className="bi bi-plus-lg" aria-hidden="true"></i> Nuevo instrumento
                        </Link>
                    )}
                </div>
            </header>

            <div className="panel__barra">
                <select
                    className="panel__filtro-categoria"
                    onChange={(e) => setCategoriaSeleccionada(e.target.value ? Number(e.target.value) : null)}
                >
                    <option value="">Todas las categorías</option>
                    {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>{nombreCategoria(categoria.denominacion)}</option>
                    ))}
                </select>

                {/* Ver dados de baja: cualquier rol logueado puede mirar el catálogo completo */}
                <label className="panel__checkbox">
                    <input
                        type="checkbox"
                        checked={verDadosDeBaja}
                        onChange={(e) => setVerDadosDeBaja(e.target.checked)}
                    />
                    Ver dados de baja
                </label>
            </div>

            <div className="panel__tabla-contenedor">
                <table className="panel__tabla">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Instrumento</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Categoría</th>
                            <th>Envío</th>
                            <th>Vendidos</th>
                            {verDadosDeBaja && <th>Estado</th>}
                            {puedeGestionarCatalogo && <th className="panel__col-acciones">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {instrumentosVisibles.map((instrumento) => (
                            <tr key={instrumento.id}>
                                <td>
                                    <img
                                        className="panel__miniatura"
                                        src={urlImagen(instrumento.imagen)}
                                        alt={instrumento.instrumento}
                                    />
                                </td>
                                <td>{instrumento.instrumento}</td>
                                <td>{instrumento.marca}</td>
                                <td>{instrumento.modelo}</td>
                                <td>{instrumento.categoria ? nombreCategoria(instrumento.categoria.denominacion) : "Sin categoría"}</td>
                                <td>{formatearCostoEnvio(instrumento.costoEnvio)}</td>
                                <td>{instrumento.cantidadVendida}</td>
                                {verDadosDeBaja && (
                                    <td>
                                        {instrumento.activo
                                            ? <span className="panel__badge panel__badge--activo">Activo</span>
                                            : <span className="panel__badge panel__badge--baja">Dado de baja</span>}
                                    </td>
                                )}
                                {puedeGestionarCatalogo && (
                                    <td>
                                        <div className="panel__iconos">
                                            <Link to={`/formulario/${instrumento.id}`} title="Editar">
                                                <i className="bi bi-pencil" aria-hidden="true"></i>
                                            </Link>
                                            <button
                                                type="button"
                                                title="Generar ficha en PDF"
                                                onClick={() => generarFichaPdf(instrumento)}
                                            >
                                                <i className="bi bi-file-earmark-pdf" aria-hidden="true"></i>
                                            </button>
                                            {instrumento.activo ? (
                                                <button
                                                    type="button"
                                                    title="Dar de baja"
                                                    onClick={() => deleteInstrumentos(instrumento.id)}
                                                >
                                                    <i className="bi bi-trash" aria-hidden="true"></i>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    title="Reactivar"
                                                    onClick={() => reactivarInstrumento(instrumento.id)}
                                                >
                                                    <i className="bi bi-arrow-counterclockwise" aria-hidden="true"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {instrumentosVisibles.length === 0 && (
                    <p className="panel__vacio">No hay instrumentos que coincidan con el filtro.</p>
                )}
            </div>

            <Modal isOpen={showModal} onRequestClose={cerrarModal} className="panel-modal" overlayClassName="panel-modal__fondo">
                <h2 className="panel-modal__titulo">Exportar pedidos a Excel</h2>
                <div className="panel-modal__campo">
                    <label htmlFor="fechaDesde">Desde</label>
                    <input
                        type="date"
                        id="fechaDesde"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                    />
                </div>
                <div className="panel-modal__campo">
                    <label htmlFor="fechaHasta">Hasta</label>
                    <input
                        type="date"
                        id="fechaHasta"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                    />
                </div>
                <div className="panel-modal__acciones">
                    <button type="button" className="panel-boton panel-boton--secundario" onClick={cerrarModal}>Cancelar</button>
                    <button type="button" className="panel-boton panel-boton--principal" onClick={generarExcel}>Generar</button>
                </div>
            </Modal>
        </div>
    );
};

export default GrillaInstrumentos;
