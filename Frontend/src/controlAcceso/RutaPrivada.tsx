import { ReactNode, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { obtenerSesion, Sesion } from '../services/sesion';

export const RutaPrivada = ({ children }: { children: ReactNode }) => {

    // obtenerSesion descarta la sesión si el token ya venció
    const [sesion] = useState<Sesion | null>(() => obtenerSesion());

    return sesion ? children : <Navigate to='/login' />;
};
