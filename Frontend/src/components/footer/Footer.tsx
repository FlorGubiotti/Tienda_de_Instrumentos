import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => (
    <footer className="pie">
        <div className="pie__contenido">
            <div>
                <p className="pie__marca">Trémolo</p>
                <p className="pie__texto">
                    Instrumentos musicales con más de 15 años de experiencia.
                </p>
            </div>

            <nav className="pie__enlaces" aria-label="Enlaces del pie de página">
                <Link to="/products">Productos</Link>
                <Link to="/DondeEstamos">Dónde estamos</Link>
            </nav>

            <p className="pie__texto">
                <i className="bi bi-geo-alt" aria-hidden="true"></i> Mendoza, Argentina
            </p>
        </div>

        <p className="pie__legal">
            Proyecto de portfolio. Los precios y productos son de demostración.
        </p>
    </footer>
);

export default Footer;
