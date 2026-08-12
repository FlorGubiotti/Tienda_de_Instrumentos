import { BrowserRouter, useLocation } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import Navbar from "./components/navbar/Navbar"
import Footer from "./components/footer/Footer"
import { CarritoContextProvider } from "./context/CarritoContext"

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
      {/*
        * El carrito envuelve a toda la aplicación, no solo al catálogo: si el
        * proveedor vive dentro de una pantalla, se desmonta al navegar y el
        * carrito se vacía solo. Además la barra necesita el contador.
        */}
      <CarritoContextProvider>
        <Contenido />
      </CarritoContextProvider>
    </BrowserRouter>
  )
}

export default App
