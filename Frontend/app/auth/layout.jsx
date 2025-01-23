'use client'; import {usePathname, Image, styled} from '@/app/utils/hooks';

export default function RootLayoutAuth({ children }) {

    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith('/auth/teacher');

    return (
        <Componente>
            
            <div className="layout-auth">
                <div className="auth-container">
                    {!isAuthPage && (
                        <Image
                            src="/fondo-login.png"
                            alt="Background Image"
                            fill
                            priority
                            style={{
                                objectFit: "cover",
                            }}
                        />
                    )}
                    {isAuthPage && <div>{children}</div>}
                </div>
                <div className="auth-container-content">
                    {children}
                </div>
            </div>
               
        </Componente>
    );
}

const Componente = styled.div`

    .layout-auth {
        margin: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    .auth-container {
        position: fixed;
        width: 100vw;
        height: 100vh;
        z-index: -1;
    }

    .auth-container-content {
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }
`;
