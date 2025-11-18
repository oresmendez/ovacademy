import { NextResponse } from 'next/server';

const getTokenFromRequestCookies = (request) => {
    const cookieData = request.cookies.get('user-data')?.value;
    if (!cookieData) return '';
    try {
        const parsedData = JSON.parse(cookieData);
        return parsedData?.token || '';
    } catch (error) {
        console.error('Error al parsear cookies:', error);
        return '';
    }
};

export async function middleware(request) {
    
    const url = request.nextUrl.clone();
    const pathname = url.pathname;
    const token = getTokenFromRequestCookies(request);

    if (token) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verifytoken`, {
                method: 'GET',
                headers: {
                    'Token': token
                }
            });

            const data = await response.json();

            if (!data?.data?.user_id) {
                console.log('⚠ La respuesta no tiene user_id. Redirigiendo a login.');
                url.pathname = '/auth/login';
                return NextResponse.redirect(url);
            }

            const userId = data.data.user_id;
            const type_id = data.data.type_id;

            // Validación según type_id y ruta
            if (type_id === 3 && !pathname.startsWith('/ovacademy/administrador')) {
                console.log('⚠ Administrador intentando acceder a una ruta no permitida');
                url.pathname = '/auth/login';
                return NextResponse.redirect(url);
            }

            if (type_id === 2 && !pathname.startsWith('/ovacademy/profesor')) {
                console.log('⚠ Profesor intentando acceder a una ruta no permitida');
                url.pathname = '/auth/login';
                return NextResponse.redirect(url);
            }

            if (type_id === 1 && !pathname.startsWith('/ovacademy/estudiante')) {
                console.log('⚠ Estudiante intentando acceder a una ruta no permitida');
                url.pathname = '/auth/login';
                return NextResponse.redirect(url);
            }

        } catch (error) {
            console.log("❌ Error verificando el token:", error);
            url.pathname = '/auth/login';
            return NextResponse.redirect(url);
        }

    } else {
        console.log('⚠ No se encontró token en cookies. Redirigiendo a login.');
        url.pathname = '/auth/login';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/ovacademy/:path*'],
};
