import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Usuario from "../../entities/Usuario";
import './Navbar.css'

const Navbar = () => {
    const navigate = useNavigate();
    const [usuarioLogueado, setUsuarioLogueado] = useState<Usuario | null>(null);

    const cerrarSesion = () => {
        localStorage.removeItem('usuario');
        setUsuarioLogueado(null); 
        navigate('/login', {
            replace: true,
            state: { logged: false },
        });
    };

    useEffect(() => {
        const jsonUsuario = localStorage.getItem("usuario");
        if (jsonUsuario) {
            try {
                const parsedUsuario = JSON.parse(jsonUsuario) as Usuario;
                setUsuarioLogueado(parsedUsuario);
            } catch (error) {
                console.error("Error parsing user JSON:", error);
            }
        }
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
                      <a className="nav-link">Usuario: {usuarioLogueado?.nombreUsuario} - {usuarioLogueado?.rol}</a>
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
