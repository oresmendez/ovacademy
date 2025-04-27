'use client'; import { gestorCookie } from '@/app/components/utils/rutas';

export const fetchGet = async (url, bodyData = '') => {
    
    let finalUrl = url;

    if (bodyData && typeof bodyData === 'object') {
        const queryParams = new URLSearchParams(bodyData).toString();
        finalUrl = `${url}?${queryParams}`;
    }

    try {
        const response = await fetch(finalUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Token': gestorCookie.getTokenFromCookies()
            }
        });

        return {
            status: response.status,
            data: await response.json()
        };

    } catch (error) {
        console.error('Error en la petición GET', error);
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
                'Token': gestorCookie.getTokenFromCookies()
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
                'Token': gestorCookie.getTokenFromCookies()
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
                'Token': gestorCookie.getTokenFromCookies()
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

