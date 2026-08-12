import { BrowserRouter, useLocation } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import Navbar from "./components/navbar/Navbar"
import Footer from "./components/footer/Footer"

/*
 * El login ocupa el alto completo de la ventana, así que va sin navbar ni pie:
 * con ellos aparece una barra de scroll y la tarjeta deja de quedar centrada.
 */
const Contenido = () => {
  const esLogin = useLocation().pathname === "/login";

  return (
    <>
      {!esLogin && <Navbar />}
      <AppRoutes />
      {!esLogin && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Contenido />
    </BrowserRouter>
  )
}

export default App
