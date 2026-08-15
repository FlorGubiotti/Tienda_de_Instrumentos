import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Usuario from "../../entities/Usuario";
import { login } from "../../services/AuthService";
import { guardarSesion } from "../../services/sesion";
import { Roles } from "../../entities/Roles";
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [usuario] = useState<Usuario>(new Usuario());
  const [txtValidacion, setTxtValidacion] = useState<string>("");

  const handleLogin = async () => {
    if (!usuario?.nombreUsuario || usuario?.nombreUsuario === "") {
      setTxtValidacion("Ingrese el nombre de usuario");
      return;
    }
    if (!usuario?.clave || usuario?.clave === "") {
      setTxtValidacion("Ingrese la clave");
      return;
    }

    try {
      const sesion = await login(usuario.nombreUsuario, usuario.clave);
      guardarSesion(sesion);
      // Quien va a trabajar cae directo en su herramienta; VISOR, que solo mira, va al catálogo
      const destino = sesion.rol === Roles.VISOR ? "/products" : "/grilla";
      navigate(destino, { replace: true });
    } catch (error) {
      setTxtValidacion("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form>
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaUser />
            </span>
            <input
              type="text"
              id="txtUsuario"
              className="form-control"
              placeholder="Nombre de usuario"
              defaultValue={usuario?.nombreUsuario}
              onChange={(e) => (usuario.nombreUsuario = String(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            />
          </div>
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaLock />
            </span>
            <input
              type="password"
              id="txtClave"
              className="form-control"
              placeholder="Clave"
              defaultValue={usuario?.clave}
              onChange={(e) => (usuario.clave = String(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            />
          </div>
          <div className="d-grid">
            <button onClick={handleLogin} className="btn btn-success" type="button">
              Ingresar
            </button>
          </div>
          <div className="mt-3">
            <p className="validation-message">{txtValidacion}</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
