'use client'; import {Image, styled, PropTypes} from '@/app/components/utils/rutas';

export default function RootLayoutAuth({ children }) {

    return (
        <Componente>
            
            <div className="layout-auth">
                <div className="auth-container">
                    <Image
                        src="/fondo-login.png"
                        alt="Background Image"
                        fill
                        // priority
                        style={{
                            objectFit: "cover",
                        }}
                    />
                </div>
                <div className="auth-container-content">
                    {children}
                </div>
            </div>
               
        </Componente>
    );
}

RootLayoutAuth.propTypes = {
    children: PropTypes.node,
};

const Componente = styled.div`

.parent-container {
  position: relative;
}


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
        opacity: 0;
        animation: fadeIn 0.6s ease forwards;
    }

    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }

`;
