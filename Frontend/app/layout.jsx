'use client';
import { useEffect , Toaster, usePathname, styled } from '@/app/utils/hooks';
import '@/app/globals.css';
import { HeaderProvider } from "./utils/HeaderContext";

export default function RootLayout({ children }) {
    const pathname = usePathname();

    const isAuthPage = pathname?.startsWith('/auth');
    const isTeacherPage = pathname === '/ovacademy/teacher';

    // useEffect(() => {
    //     // Asegura que estas modificaciones ocurran solo en el cliente
    //     document.documentElement.className = ''; 
    //     if (isTeacherPage) {
    //         document.documentElement.classList.add('theme-module');
    //     }
    // }, [isTeacherPage]);

    return (
        <html lang="en">
            <body>
                <Toaster
                    position="top-right"
                    expand={true}
                    richColors
                    toastOptions={{
                        style: {
                            fontSize: '1rem',
                        },
                    }}
                />
                <HeaderProvider>
                    <Componente>
                        {!isAuthPage && (
                            <div className={!isTeacherPage ? 'layout-home' : 'layout-teacher'}>
                                <div className="home-container">{children}</div>
                            </div>
                        )}
                        {isAuthPage && <div>{children}</div>}
                    </Componente>
                </HeaderProvider>
            </body>
        </html>
    );
}

const Componente = styled.div``;
