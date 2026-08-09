import { ReactNode, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Usuario from '../entities/Usuario';

export const RutaPrivada = ({ children }: { children: ReactNode }) => {

    const [usuario] = useState<Usuario | null>(() => {
        const jsonUsuario = localStorage.getItem('usuario');
        return jsonUsuario ? (JSON.parse(jsonUsuario) as Usuario) : null;
    });

    return usuario ? children : <Navigate to='/login' />;
};
