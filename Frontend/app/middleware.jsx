// middleware.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Verifica si la ruta existe como archivo o directorio en la carpeta 'pages'
  const isFileOrDirectory = fs.existsSync(
    path.join(process.cwd(), 'pages', `${pathname === '/' ? 'index' : pathname}.js`)
  );

  if (!isFileOrDirectory) {
    // Redirigimos a la página de inicio
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Continuar con la solicitud si es una ruta válida
  return NextResponse.next();
}

export const config = {
  // Aplica el middleware a todas las rutas
  matcher: '/:path*',
};
