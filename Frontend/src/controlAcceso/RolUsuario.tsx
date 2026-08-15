import { Navigate, Outlet } from 'react-router-dom';
import { Roles } from '../entities/Roles';
import { useState } from 'react';
import { obtenerSesion, Sesion } from '../services/sesion';

interface Props {
  /** Cualquiera de estos roles puede entrar. */
  roles: Roles[];
}

function RolUsuario({ roles }: Props) {

    // obtenerSesion descarta la sesión si el token ya venció
    const [sesion] = useState<Sesion | null>(() => obtenerSesion());

    if (sesion && roles.includes(sesion.rol as Roles)) {
        return <Outlet />;
    } else if (sesion) {
        return <Navigate replace to='/grilla' />;
    } else {
        return <Navigate replace to='/login' />;
    }

}
export default RolUsuario;
