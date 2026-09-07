import { Link } from "react-router-dom";
import isotipoClaro from "../../assets/isotipo-tremolo-claro.png";
import isotipoOscuro from "../../assets/isotipo-tremolo-oscuro.png";
import "./Footer.css";

const Footer = () => (
    <footer className="pie">
        <div className="pie__contenido">
            <div>
                <div className="pie__marca-bloque">
                    <img src={isotipoClaro} alt="" className="pie__isotipo pie__isotipo--claro" />
                    <img src={isotipoOscuro} alt="" className="pie__isotipo pie__isotipo--oscuro" />
                    <p className="pie__marca">Trémolo</p>
                </div>
                <p className="pie__texto">
                    Instrumentos para hacer sonar tus ideas.
                </p>
            </div>

            <div>
                <p className="pie__titulo-columna">Explorar</p>
                <nav className="pie__enlaces" aria-label="Enlaces del pie de página">
                    <Link to="/">Inicio</Link>
                    <Link to="/products">Productos</Link>
                    <Link to="/DondeEstamos">Dónde estamos</Link>
                </nav>
            </div>

            <div>
                <p className="pie__titulo-columna">Encontranos</p>
                <p className="pie__texto">
                    <i className="bi bi-geo-alt" aria-hidden="true"></i> Mendoza, Argentina
                </p>
            </div>
        </div>

        <p className="pie__legal">
            Proyecto de portfolio. Los precios y productos son de demostración.
        </p>
    </footer>
);

export default Footer;
