'use client';
import { apiRest, toast, gestorCookie } from '@/app/components/utils/rutas';

export const startSession = async (email, password) => {
    try {
        if (!email || !password) {
            toast.error('Por favor, completa todos los campos.');
            return { error: true };
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`
        const response = await apiRest.fetchPost(url, {
            email,
            password,
        });

        if (response.status === 200) {
            await gestorCookie.create_cookie(response.data);

            let path = '';
            if (response.data.type === 1) {
                path = '/ovacademy/estudiante/dashboard';
            } else if (response.data.type === 2) {
                path = '/ovacademy/profesor/dashboard';
            } else if (response.data.type === 3) {
                path = '/ovacademy/administrador/dashboard';
            } else {
                toast.error('Usuario no autorizado');
                return { error: true };
            }

            toast.success('Bienvenido');
            return { success: true, redirectTo: path };
        } else {
            toast.error(response.data.message || 'Error inesperado');
            return { error: true };
        }

    } catch (err) {
        toast.error('Error al conectar con el servidor');
        console.error('Error:', err);
        return { error: true };
    }
};
