'use client';
import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { apiRest } from '@/app/utils/hooks';
import LayoutDashboard from "../layout";

const LayoutSecundario = ({ children }) => {
    const router = useRouter(); // Para redirigir al usuario si es necesario

    useEffect(() => {
        const fetchData = async () => {
            try {
                
                const response = await apiRest.fetchGet('http://localhost:3333/ovacademy/teacher');

                if (response.status === 401) {
                    console.log("Usuario no autorizado. Redirigiendo al inicio de sesión...");
                    router.push('/auth/login'); // Redirigir al inicio de sesión
                } else {
                    console.log("Datos obtenidos:",  response.data);
                }
            } catch (err) {
                console.error("Error al realizar la solicitud:", err);
            }
        };

        fetchData();
    }, [router]);

    return (
        <LayoutDashboard showHeader={false}>
            <div>
                {children}
            </div>
        </LayoutDashboard>
    );
};

export default LayoutSecundario;
