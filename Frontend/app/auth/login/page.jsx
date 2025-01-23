'use client'; import {Cookies, useState, useEffect, useRouter, Link, styled, Logo_Name_White, startSession } from '@/app/utils/hooks';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        Cookies.remove('user-data', {
            secure: true,
            sameSite: 'Strict',
        });
    }, []);

    const handleRequest = async (event) => {
        event.preventDefault();
        await startSession(email, password, router);
    };

    return (
        <Componente>
            <div className="layout-authentication center">
                <div className="authentication-content">
                    <Logo_Name_White />
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
                        <span className="forgot-password pt-10">Olvidaste tu contraseña</span>
                    </Link>
                    <div className="dont-account mt-20 center">
                        <span className="dont-account-text">¿No tienes una cuenta?</span>
                        <Link href="/auth/register" passHref>
                            <button className="register-button mr-10">Crear</button>
                        </Link>
                    </div>
                    <div className="teacher-or-admin mt-20 pt-20 center">
                        <span className="teacher-or-admin-text mb-10">¿Eres Profesor o Administrador?</span>
                        <Link href="/auth/teacher" passHref>
                            <button className="register-button">Ingresa Aquí</button>
                        </Link>
                    </div>
                </div>
            </div>
        </Componente>
    );
}

const Componente = styled.div`

    .layout-authentication {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
    }

    .authentication-content {
        max-width: 28rem;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.021);
        padding: 2rem;
        height: 40rem;
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
`;
