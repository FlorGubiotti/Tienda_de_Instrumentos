import { useEffect, useMemo, useState } from "react";
import PedidoService from "../../services/PedidoService";
import Chart from "react-google-charts";
import LoaderPage from "../LoaderPage/LoaderPage";
import '../../styles/panelAdmin.css'
import './ChartsGoogle.css'

/*
 * Google Charts dibuja en un <svg> con colores fijos pasados por options, no
 * con CSS: no hereda el tema de la página ni reacciona solo al modo oscuro.
 * Por eso se leen los tokens como texto y se vuelven a leer cada vez que
 * cambia data-tema, en vez de fijarlos una sola vez.
 */
const leerToken = (variable: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

// Paleta categórica para el gráfico de torta: variaciones del propio acento de
// marca en vez de colores arbitrarios, para no salirse de la paleta del sitio.
const TOKENS_PALETA_TORTA = ['--laton', '--laton-oscuro', '--laton-claro', '--laton-mas-oscuro', '--texto-secundario', '--texto-tenue'];

function useColoresDelTema() {
    const [tema, setTema] = useState(() => document.documentElement.getAttribute('data-tema'));

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setTema(document.documentElement.getAttribute('data-tema'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-tema'] });
        return () => observer.disconnect();
    }, []);

    // Se recalculan cuando cambia data-tema; useMemo evita releer el DOM en cada render
    return useMemo(() => ({
        texto: leerToken('--texto-primario'),
        textoSecundario: leerToken('--texto-secundario'),
        acento: leerToken('--acento'),
        superficie: leerToken('--superficie-tarjeta'),
        paletaTorta: TOKENS_PALETA_TORTA.map(leerToken),
    }), [tema]);
}

function ChartsGoogle() {
    const [datosChartBar, setDatosChartBar] = useState<Array<(string | number)[]> | null>(null);
    const [datosChartPie, setDatosChartPie] = useState<Array<(string | number)[]> | null>(null);
    const [error, setError] = useState(false);
    const colores = useColoresDelTema();

    useEffect(() => {
        const pedidoService = new PedidoService();
        const cargar = async () => {
            try {
                const [bar, pie] = await Promise.all([
                    pedidoService.getDatosChartBar(),
                    pedidoService.getDatosChartPie(),
                ]);
                setDatosChartBar(bar);
                setDatosChartPie(pie);
            } catch (e) {
                console.error('Error al obtener los datos de los gráficos:', e);
                setError(true);
            }
        };
        cargar();
    }, []);

    const opcionesComunes = {
        // El parser de color de Google Charts no reconoce "transparent" ni
        // "none": los ignora en silencio y pinta blanco igual. En vez de pelear
        // con eso, se le da al gráfico el mismo color sólido que su tarjeta
        // contenedora, para que se mimetice en los dos modos.
        backgroundColor: colores.superficie,
        chartArea: { backgroundColor: colores.superficie },
    };

    // Sin título propio: Google Charts pinta un rectángulo blanco fijo detrás
    // del texto del título (y de los títulos de eje) que no responde a ningún
    // color de las options. El título va como <h2> propio arriba de la
    // tarjeta en su lugar, así no queda ese parche blanco en modo oscuro.
    const optionsBar = {
        ...opcionesComunes,
        colors: [colores.acento],
        // Una sola serie: la leyenda repetiría lo que ya dice el título
        legend: { position: 'none' },
        hAxis: { textStyle: { color: colores.textoSecundario } },
        vAxis: { minValue: 0, textStyle: { color: colores.textoSecundario } },
    };

    // Sin leyenda propia tampoco: el mismo parche blanco de Google aparece
    // detrás de cada ítem de la leyenda, en cualquier posición, sin que
    // ninguna combinación de options lo saque. Se arma una leyenda HTML propia
    // más abajo con los mismos colores y nombres.
    const optionsPie = {
        ...opcionesComunes,
        colors: colores.paletaTorta,
        legend: { position: 'none' },
    };

    if (error) {
        return (
            <div className="panel">
                <div className="alert alert-danger" role="alert">
                    No pudimos cargar las estadísticas. Probá de nuevo más tarde.
                </div>
            </div>
        );
    }

    if (!datosChartBar || !datosChartPie) {
        return <LoaderPage />;
    }

    // La fila 0 es el encabezado que necesita el propio <Chart>; se salta acá
    const filasTorta = datosChartPie.slice(1);

    return (
        <div className="panel">
            <header className="panel__encabezado">
                <div>
                    <h1 className="panel__titulo">Estadísticas</h1>
                    <p className="panel__cuenta">Pedidos por mes y por instrumento</p>
                </div>
            </header>

            <div className="estadisticas">
                <div className="estadisticas__tarjeta">
                    <h2 className="estadisticas__titulo">Pedidos por mes</h2>
                    <Chart
                        chartType="BarChart"
                        width="100%"
                        height="340px"
                        data={datosChartBar}
                        options={optionsBar}
                    />
                </div>
                <div className="estadisticas__tarjeta">
                    <h2 className="estadisticas__titulo">Pedidos por instrumento</h2>
                    <Chart
                        chartType="PieChart"
                        width="100%"
                        height="340px"
                        data={datosChartPie}
                        options={optionsPie}
                    />
                    {filasTorta.length > 0 && (
                        <ul className="estadisticas__leyenda">
                            {filasTorta.map((fila, i) => (
                                <li key={String(fila[0])}>
                                    <span
                                        className="estadisticas__leyenda-punto"
                                        style={{ backgroundColor: colores.paletaTorta[i % colores.paletaTorta.length] }}
                                        aria-hidden="true"
                                    ></span>
                                    {fila[0]}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChartsGoogle
