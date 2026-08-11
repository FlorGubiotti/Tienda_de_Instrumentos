import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="container text-center mt-5">
            <h2>Página no encontrada</h2>
            <p className="text-muted">La página que buscás no existe o fue movida.</p>
            <Link to="/" className="btn btn-primary mt-3">
                Volver al inicio
            </Link>
        </div>
    );
}

export default NotFound;
