'use client'; import { apiRest, toast, gestorCookie } from '@/app/components/utils/rutas';

export const startSession = async (email, password, router) => {
    
    try {

        if (!email || !password) {
            toast.error('Por favor, completa todos los campos.');
            return;
        }

        const url = `http://localhost:3333/ovacademy/auth/login`
        const response = await apiRest.fetchPost(url, {
            email,
            password,
        });

        if (response.status === 200) {

            await gestorCookie.create_cookie(response.data);

            if(response.data.type === 1){
                router.push('/ovacademy/estudiante/dashboard');
            }else if (response.data.type === 2){
                router.push('/ovacademy/profesor/dashboard');
            }else if (response.data.type === 3){
                router.push('/ovacademy/administrador/dashboard');
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
