import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cerrarSesion as borrarSesion, obtenerSesion, Sesion } from "../../services/sesion";
import BotonTema from "../botonTema/BotonTema";
import './Navbar.css'

const Navbar = () => {
    const navigate = useNavigate();
    const [usuarioLogueado, setUsuarioLogueado] = useState<Sesion | null>(null);

    const cerrarSesion = () => {
        borrarSesion();
        setUsuarioLogueado(null);
        navigate('/login', {
            replace: true,
            state: { logged: false },
        });
    };

    useEffect(() => {
        setUsuarioLogueado(obtenerSesion());
    }, []);

    return (
        <div>
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">
                Hendrix
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link " aria-current="page" to="/">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/DondeEstamos">
                      Donde Estamos
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/products">
                      Productos
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/grilla">
                      Grilla
                    </Link>
                  </li>
                  <li className="nav-item">
                        <Link className="nav-link" to="/googlecharts">Charts Google</Link>
                    </li>
                </ul>
                  <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                      <BotonTema />
                    </li>
                    <li className="nav-item">
                      <span className="navbar-usuario">Usuario: {usuarioLogueado?.nombreUsuario} - {usuarioLogueado?.rol}</span>
                    </li>
                    <li className="nav-item">
                      <button onClick={cerrarSesion} className="btn btn-success" type="button">
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
              </div>
            </div>
          </nav>
        </div>
      );
      
};

export default Navbar;
