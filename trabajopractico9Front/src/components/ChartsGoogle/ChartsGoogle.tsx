import { useEffect, useState } from "react";
import PedidoService from "../../services/PedidoService";
import Chart from "react-google-charts";

export const optionsBar = {
    title: "Historial de pedidos",
    chartArea: { width: "50%" },
    colors: ["#b0120a", "#ffab91"],
    hAxis: {
        title: "Pedidos",
        minValue: 0,
    },
    vAxis: {
        title: "Fecha",
    }
};

export const optionsPie = {
    title: "Cantidad de Pedidos por Instrumento",
};

function ChartsGoogle() {

    const [datosChartBar, setDatosChartBar] = useState<any>();
    const [datosChartPie, setDatosChartPie] = useState<any>();
    const pedidoService = new PedidoService();

    const getBarChart = async () => {
        const datosBackend = await pedidoService.getDatosChartBar();
        console.log(datosBackend);
        setDatosChartBar(datosBackend);
    }

    const getPieChart = async () => {
        const datosBackend = await pedidoService.getDatosChartPie();
        console.log(datosBackend);
        setDatosChartPie(datosBackend);
    }

    useEffect(() => {
        getBarChart();
        getPieChart();
    }, []);


    return (
        <>
            <Chart
                chartType="BarChart"
                width="100%"
                height="400px"
                data={datosChartBar}
                options={optionsBar}
            />
            <Chart
                chartType="PieChart"
                data={datosChartPie}
                options={optionsPie}
                width={"100%"}
                height={"400px"}
            />
        </>
    )
}

export default ChartsGoogle