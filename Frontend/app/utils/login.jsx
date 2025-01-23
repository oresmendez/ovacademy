'use client';
import { apiRest, toast, gestorCookie } from '@/app/utils/hooks';

export const startSession = async (email, password, router, access = 1) => {
    const loadingToastId = toast.loading('Cargando datos...');
    
    try {
        if (!email || !password) {
            toast.error('Por favor, completa todos los campos.');
            toast.dismiss(loadingToastId);
            return;
        }

        const response = await apiRest.fetchPost('http://localhost:3333/ovacademy/auth/login', {
            email,
            password,
            access,
        });

        toast.dismiss(loadingToastId);

        if (response.status === 200) {
            await gestorCookie.create_cookie(response.data);
            console.log(response.data.type);
            if(response.data.type === 1){
                router.push('/ovacademy/dashboard');
            }else if (response.data.type === 2){
                router.push('/ovacademy/teacher/dashboard');
            }else{
                toast.error('Usuario no autorizado');
                return
            }

            toast.success('Bienvenido');

        } else {
            toast.error(response.data.message || 'Error inesperado');
        }
    } catch (err) {
        toast.dismiss(loadingToastId);
        toast.error('Error al conectar con el servidor');
        console.error('Error:', err);
    }
};
