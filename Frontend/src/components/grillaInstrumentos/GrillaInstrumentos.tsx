import { useEffect, useState } from "react";
import Instrumento from "../../entities/Instrumento";
import InstrumentoService from "../../services/InstrumentoService";
import Categoria from "../../entities/Categoria";
import CategoriaService from "../../services/CategoriaService";
import { Link } from "react-router-dom";
import { Roles } from "../../entities/Roles";
import { descargarArchivo } from "../../services/descargarArchivo";
import { obtenerSesion } from "../../services/sesion";
import Modal from 'react-modal';
Modal.setAppElement('#root');
import './GrillaInstrumentos.css'

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

    return (
        <>
            <div className="container-xxl text-center">
                <br />
                <select className="form-select mb-3" onChange={(e) => setCategoriaSeleccionada(Number(e.target.value))}>
                    <option value="">Mostrar Todos</option>
                    {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>{categoria.denominacion}</option>
                    ))}
                </select>
                {esAdmin && (
                    <>
                        <a className="btn btn-success mb-3" onClick={abrirModal}>Generar Excel</a>
                        <br />
                        <Link className="btn btn-primary" to={`/formulario/0`}>Nuevo Instrumento</Link>
                        <div className="form-check d-inline-block ms-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="chkVerDadosDeBaja"
                                checked={verDadosDeBaja}
                                onChange={(e) => setVerDadosDeBaja(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="chkVerDadosDeBaja">
                                Ver dados de baja
                            </label>
                        </div>
                    </>
                )}
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th className="col-2">Instrumento</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Imagen</th>
                            <th className="col-3">Descripcion</th>
                            <th>Categoria</th>
                            <th>Costo de Envío</th>
                            <th>Cantidad Vendida</th>
                            {esAdmin && verDadosDeBaja && <th>Estado</th>}
                            {esAdmin && <th></th>}
                            {esAdmin && <th></th>}
                            {esAdmin && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {instrumentos.filter(filtrarPorCategoria).map((instrumento: Instrumento, index) => (
                            <tr key={index}>
                                <td>{instrumento.id}</td>
                                <td>{instrumento.instrumento}</td>
                                <td>{instrumento.marca}</td>
                                <td>{instrumento.modelo}</td>
                                <td><img src={`./images/${instrumento.imagen}`} style={{ width: '100px', height: '100px' }} /></td>
                                <td>{instrumento.descripcion}</td>
                                <td>{instrumento.categoria ? instrumento.categoria.denominacion : "Sin Categoria"}</td>
                                <td>{instrumento.costoEnvio === "G" ? "Envío gratis" : "$" + instrumento.costoEnvio}</td>
                                <td>{instrumento.cantidadVendida}</td>
                                {esAdmin && verDadosDeBaja && (
                                    <td>
                                        {instrumento.activo
                                            ? <span className="badge bg-success">Activo</span>
                                            : <span className="badge bg-secondary">Dado de baja</span>}
                                    </td>
                                )}
                                {esAdmin && (
                                    <>
                                        <td>
                                            <Link to={`/formulario/${instrumento.id}`}>
                                                <i className="bi bi-pencil"></i>
                                            </Link>
                                        </td>
                                        <td>
                                            <i
                                                className="bi bi-file-earmark-pdf"
                                                title="Generar ficha en PDF"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => generarFichaPdf(instrumento)}
                                            ></i>
                                        </td>
                                        <td>
                                            {instrumento.activo ? (
                                                <i
                                                    className="bi bi-trash"
                                                    title="Dar de baja"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => deleteInstrumentos(instrumento.id)}
                                                ></i>
                                            ) : (
                                                <i
                                                    className="bi bi-arrow-counterclockwise"
                                                    title="Reactivar"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => reactivarInstrumento(instrumento.id)}
                                                ></i>
                                            )}
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={showModal} onRequestClose={cerrarModal} className="Modal" overlayClassName="Overlay">
                <h2>Seleccionar Fechas</h2>
                <div className="input-group">
                    <label htmlFor="fechaDesde">Fecha Desde</label>
                    <input
                        type="date"
                        id="fechaDesde"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="fechaHasta">Fecha Hasta</label>
                    <input
                        type="date"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                    />
                </div>
                <div className="button-group">
                    <button onClick={generarExcel} className="button-generate">Generar Excel</button>
                    <button onClick={cerrarModal} className="button-close">Cerrar</button>
                </div>
            </Modal>
        </>
    );
};

export default GrillaInstrumentos;
