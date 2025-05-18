'use client'; import {useState, useEffect, useRouter, Link, styled, LogoNameWhite, startSession, gestorCookie, Spinner } from '@/app/components/utils/rutas';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showSpinner, setShowSpinner] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);


    useEffect(() => {
        gestorCookie.removeCookie();
        setIsHydrated(true);
    }, []);

    const handleRequest = async (event) => {
        event.preventDefault();
    
        const result = await startSession(email, password);
    
        if (result?.success) {
            setIsLeaving(true);
            setTimeout(() => {
                router.push(result.redirectTo);
            }, 600);
        }
    };
    
    if (!isHydrated || showSpinner) {
        return <Spinner show={true} />;
    }

    return (
        <Componente>
            <div className="layout-authentication center">
                <div className={`authentication-content ${isLeaving ? 'fade-out' : ''}`}>
                    <LogoNameWhite />
                    <form className="form-login mt-30" onSubmit={handleRequest}>
                        <input
                            type="text"
                            placeholder="correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="button-login">Entrar</button>
                    </form>
                    <Link href="/auth/forgotPassword" passHref>
                        {/* <span className="forgot-password pt-10">Olvidaste tu contraseña</span> */}
                    </Link>
                    <div className="dont-account mt-20 center">
                        <span className="dont-account-text">¿No tienes una cuenta?</span>
                        <Link href="/auth/register" passHref>
                            <button className="register-button mr-10">Crear</button>
                        </Link>
                    </div>
                <Link href="/" passHref className="center back-home mt-20 pb-05"> Home
                </Link> 
                </div>
            </div>
        </Componente>
    );
}

const Componente = styled.div`

    .back-home{
        display: inline-block;
        color: white;

        display: Flex;
        justify-content: center;
        align-items: center;
    }

    .back-home:hover{
        text-decoration: underline; 
        cursor: pointer;
        
    }

    .layout-authentication {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
    }

    .authentication-content {
        max-width: 30rem;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.021);
        padding: 2rem;
        height: 35rem;
        z-index: 1;
        font-family: var(--font-lexend);
    }

    .form-login {
        display: flex;
        flex-direction: column;
    }

    input {
        padding: 0.8rem;
        margin-bottom: 1rem;
    }

    .button-login {
        background-color: #d4eb33;
        padding: 0.8rem;
    }

    .forgot-password {
        display: inline-block;
        color: white;
        cursor: pointer;
    }

    .dont-account {
        justify-content: space-between;
        color: white;
        cursor: pointer;
    }

    .register-button {
        background-color: #006398;
        border-radius: 2px;
        padding: 0.5rem 1rem;
        font-weight: 300;
        color: white;
    }

    .teacher-or-admin {
        border-top: 1px solid white;
        color: white;
        flex-direction: column;
    }

    .fade-out {
    animation: fadeOut 0.6s ease forwards;
        
    .create-accont-text{
        color: white;
        text-align: justify;
        font-size: 1.1rem;
        font-weight: 200;
    }

    
}

@keyframes fadeOut {
    from {
        opacity: 1;
        transform: scale(1);
    }
    to {
        opacity: 0;
        transform: scale(0.95);
    }
}

`;

