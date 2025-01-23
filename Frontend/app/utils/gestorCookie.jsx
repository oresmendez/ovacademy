import { Cookies, toast } from '@/app/utils/hooks';

// Crear una cookie
export const create_cookie = (data) => {
    Cookies.set('user-data', JSON.stringify(data), {
        expires: 0.0833, // Duración: 2 horas
        secure: true,
        sameSite: 'Strict',
    });
};

// Verificar si existe una cookie específica
export const doesCookieExist = (cookieName) => {
    const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
    return cookies.some((cookie) => cookie.startsWith(`${cookieName}=`));
};

// Verificar y manejar la existencia de la cookie
export const verifyCookie = (setIsAuthenticated, setIsAuthChecked, router) => {
    try {
        const isValid = doesCookieExist("user-data");
        if (!isValid) {
            return router.push("/auth/login");
        }
        setIsAuthenticated(true);
    } catch (error) {
        console.error("Error al verificar la cookie:", error);
        setIsAuthenticated(false);
    } finally {
        setIsAuthChecked(true);
    }
};

// Obtener y decodificar la cookie
export const get_cookie = (setUserData) => {
    const tokenUser = Cookies.get('user-data');

    if (tokenUser) {
        try {
            const parsedData = JSON.parse(tokenUser); // Sin codificación extra
            setUserData(parsedData);
        } catch (error) {
            console.error("Error al parsear la cookie:", error);
        }
    } else {
        console.log("No se encontró la cookie 'user-data'");
    }
};

// Actualizar la cookie existente reutilizando create_cookie
export const update_cookie = (newData) => {
    const existingCookie = Cookies.get('user-data');

    if (existingCookie) {
        try {
            // Decodifica la cookie actual
            const existingData = JSON.parse(existingCookie);

            // Actualiza los campos deseados
            const updatedData = {
                ...existingData,
                ...newData, // Sobrescribe con los valores de newData
            };

            // Reutilizar create_cookie para sobrescribir la cookie
            create_cookie(updatedData);
        } catch (error) {
            console.error("Error al actualizar la cookie:", error);
        }
    } else {
        console.warn('La cookie no existe. No se puede actualizar.');
    }
};

export const validateTypeId = async (router, access) => {
    const cookieName = 'user-data';
    const cookieValue = Cookies.get(cookieName);

    if (!cookieValue) {
        console.warn(`La cookie '${cookieName}' no existe.`);
        router.push('/auth/login'); // Redirigir si la cookie no existe
        return false;
    }

    try {
        const parsedData = JSON.parse(cookieValue);
        console.log(parsedData.type);

        if (parsedData.type === access) {
            return true;
        } else {
            toast.error("Usuario No autorizado");
            // Esperar 1 segundo para mostrar el mensaje antes de redirigir
            await new Promise((resolve) => setTimeout(resolve, 1000));
            router.push('/auth/login');
            return false;
        }
    } catch (error) {
        console.error('Error al parsear la cookie:', error);
        router.push('/auth/login'); // Redirigir en caso de error
        return false;
    }
};


