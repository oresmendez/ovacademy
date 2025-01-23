'use client'; import { toast, Cookies } from '@/app/utils/hooks';

const getTokenFromCookies = () => {
    const cookieData = Cookies.get('user-data');
    if (!cookieData) return '';
    try {
        const parsedData = JSON.parse(cookieData);
        return parsedData?.token || '';
    } catch (error) {
        console.error('Error al parsear cookies:', error);
        return '';
    }
};

export const fetchGet = async (url) => {
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Token': getTokenFromCookies()
            },
        });

        return {
            status: response.status,
            data: await response.json()
        };

    } catch (error) {
        toast.error('Error en la petición GET');
        return {
            status: error.status || 500,
            error: error.message || 'Error desconocido'
        };
    }
};


export const fetchPost = async (url, bodyData) => {

    const data = JSON.stringify(bodyData);
    console.log("data recibida POST:", data);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Token': getTokenFromCookies()
            },
            body: data
        });

        return {
            status: response.status,
            data: await response.json()
        };

    } catch (error) {
        console.error('Error en la petición POST:', error);
        return {
            status: error.status || 500,
            error: error.message || 'Error desconocido'
        };
    }
    
};

export const fetchPut = async (url, bodyData) => {
    
    const data = JSON.stringify(bodyData);
    console.log("data recibida PUT:", data);

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Token': getTokenFromCookies()
            },
            body: data
        });

        return {
            status: response.status,
            data: await response.json()
        };

    } catch (error) {
        console.error('Error en la petición PUT:', error);
        return {
            status: error.status || 500,
            error: error.message || 'Error desconocido'
        };
    }
    
};

export const fetchDelete = async (url, bodyData) => {
    
    const data = JSON.stringify(bodyData);
    console.log("data recibida DELETE:", data);

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Token': getTokenFromCookies()
            },
            body: data
        });

        return {
            status: response.status,
            data: await response.json()
        };

    } catch (error) {
        console.error('Error en la petición DELETE:', error);
        return {
            status: error.status || 500,
            error: error.message || 'Error desconocido'
        };
    }
    
};

