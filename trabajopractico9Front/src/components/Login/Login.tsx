import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Usuario from "../../entities/Usuario";
import UsuarioService from "../../services/UsuarioService";
import * as sha1 from "js-sha1";
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario>(new Usuario());
  const [txtValidacion, setTxtValidacion] = useState<string>("");
  const url = import.meta.env.VITE_API_URL;
  const usuarioService = new UsuarioService();
  const [users, setUsers] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await usuarioService.getAll(url + "usuario");
      setUsers(userData);
    };
    fetchData();
  }, []);

  const login = async () => {
    if (!usuario?.nombreUsuario || usuario?.nombreUsuario === "") {
      setTxtValidacion("Ingrese el nombre de usuario");
      return;
    }
    if (!usuario?.clave || usuario?.clave === "") {
      setTxtValidacion("Ingrese la clave");
      return;
    }

    // Busca el usuario en la lista de usuarios
    const foundUser = users.find(
      (user) => user.nombreUsuario.toLowerCase() === usuario.nombreUsuario.toLowerCase()
    );

    if (foundUser) {
      // Usuario encontrado, verificar la contraseña
      if (sha1.sha1(usuario.clave) === foundUser.clave) {
        setUsuario({
          id: foundUser.id,
          nombreUsuario: foundUser.nombreUsuario,
          clave: foundUser.clave,
          rol: foundUser.rol,
        });
        localStorage.setItem("usuario", JSON.stringify(foundUser));
        navigate("/products", {
          replace: true,
          state: {
            logged: true,
            usuario: foundUser,
          },
        });
      } else {
        setTxtValidacion("Contraseña incorrecta");
      }
    } else {
      setTxtValidacion("Usuario no encontrado");
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
                if (e.key === "Enter") login();
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
                if (e.key === "Enter") login();
              }}
            />
          </div>
          <div className="d-grid">
            <button onClick={login} className="btn btn-success" type="button">
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
