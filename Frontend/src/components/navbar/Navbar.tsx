import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cerrarSesion as borrarSesion, obtenerSesion, Sesion } from "../../services/sesion";
import { Roles } from "../../entities/Roles";
import { useCarrito } from "../../hooks/useCarrito";
import { Carrito } from "../Carrito/Carrito";
import BotonTema from "../botonTema/BotonTema";
import './Navbar.css'

const Navbar = () => {
    const navigate = useNavigate();
    const [usuarioLogueado, setUsuarioLogueado] = useState<Sesion | null>(null);
    const { cantidadTotal } = useCarrito();

    const cerrarSesion = () => {
        borrarSesion();
        setUsuarioLogueado(null);
        // Al Home, no al login: es una tienda, no hace falta loguearse para seguir mirando
        navigate('/', { replace: true });
    };

    useEffect(() => {
        setUsuarioLogueado(obtenerSesion());
    }, []);

    // Grilla y los gráficos son herramientas de administración: no van en el menú de un visitante
    const esAdmin = usuarioLogueado?.rol === Roles.ADMIN;

    return (
        <>
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Musical Hendrix
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Abrir menú de navegación"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/products">Productos</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/DondeEstamos">Dónde estamos</Link>
                        </li>
                        {esAdmin && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/grilla">Grilla</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/googlecharts">Estadísticas</Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <button
                                type="button"
                                className="boton-carrito"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#panelCarrito"
                                aria-controls="panelCarrito"
                                aria-label={
                                    cantidadTotal === 0
                                        ? "Abrir el carrito, está vacío"
                                        : `Abrir el carrito, ${cantidadTotal} ${cantidadTotal === 1 ? 'unidad' : 'unidades'}`
                                }
                            >
                                <i className="bi bi-cart" aria-hidden="true"></i>
                                {cantidadTotal > 0 && (
                                    <span className="boton-carrito__contador" aria-hidden="true">
                                        {cantidadTotal}
                                    </span>
                                )}
                            </button>
                        </li>
                        <li className="nav-item">
                            <BotonTema />
                        </li>
                        {usuarioLogueado ? (
                            <>
                                <li className="nav-item">
                                    <span className="navbar-usuario">
                                        {usuarioLogueado.nombreUsuario} · {usuarioLogueado.rol}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <button onClick={cerrarSesion} className="btn btn-success" type="button">
                                        Cerrar sesión
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="btn btn-success" to="/login">Ingresar</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>

        {/* El carrito vive en la barra para que esté disponible en cualquier pantalla */}
        <div className="offcanvas offcanvas-end" tabIndex={-1} id="panelCarrito" aria-labelledby="tituloPanelCarrito">
            <div className="offcanvas-header">
                <h2 className="offcanvas-title h5" id="tituloPanelCarrito">Tu carrito</h2>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
            </div>
            <div className="offcanvas-body">
                <Carrito />
            </div>
        </div>
        </>
    );
};

export default Navbar;
