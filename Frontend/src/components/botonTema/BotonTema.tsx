import { useEffect, useState } from "react";
import { alternarTema, iniciarTema, obtenerTema, Tema } from "../../services/tema";
import "./BotonTema.css";

/** Botón para alternar entre modo claro y oscuro. Vive en el navbar. */
const BotonTema = () => {
    const [tema, setTema] = useState<Tema>(obtenerTema);

    // iniciarTema devuelve la función para dejar de escuchar al sistema
    useEffect(() => iniciarTema(setTema), []);

    const esOscuro = tema === "oscuro";
    const descripcion = esOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro";

    return (
        <button
            type="button"
            className="boton-tema"
            onClick={() => setTema(alternarTema())}
            aria-label={descripcion}
            title={descripcion}
        >
            <i className={esOscuro ? "bi bi-sun" : "bi bi-moon-stars"} aria-hidden="true"></i>
        </button>
    );
};

export default BotonTema;
