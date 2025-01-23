'use client'; import { useRouter, useEffect, usePathname, gestorCookie, useState, Header_app } from '@/app/utils/hooks';

export default function LayoutDashboard({ children }) {

    const pathname = usePathname();
    const router = useRouter();

    const [isAuthChecked, setIsAuthChecked] = useState(false); // Controla si se verificó la autenticación
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Controla si el usuario está autenticado

    useEffect(() => {
        gestorCookie.verifyCookie(setIsAuthenticated, setIsAuthChecked, router);
    }, [pathname]);

    if (!isAuthChecked || !isAuthenticated) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <main>
            <Header_app />
            {children}
        </main>
    );
}