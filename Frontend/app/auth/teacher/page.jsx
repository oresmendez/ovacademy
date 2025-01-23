'use client'; import { useState,  useRouter, Link, styled,  startSession, Image } from '@/app/utils/hooks';

export default function Login() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userData, setUserData] = useState(null);
    const router = useRouter();

    const handleRequest = async (event) => {
        event.preventDefault();
        await startSession(email, password, router, 2); // Para profesores
    };
    
    return (
        <Componente>
        <div className='layout-authentication center-left'>
            <div className='authentication-content'>
                <div className='logo center'>             
                    <Image
                        src="/logo-black.svg"
                        alt="Logo de la empresa"
                        width={45}
                        height={45}
                        priority
                    />
                    <div className='logo-name center'>OVACADEMY</div>
                </div>
                <div className='slogan center'>
                    Academia Digital a tus manos
                </div>
                <h3 className='login-teacher-tittle mt-20 center'>Profesor</h3>
                <form className='form-login-teacher mt-30' onSubmit={handleRequest}>
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
                <Link href="/auth/login" passHref>
                    <span className='create-accont-back mt-20 pb-05'>Regresar</span>
                </Link>
            </div>
        </div>
        </Componente>
    );
}

const Componente = styled.div`

    .layout-authentication {
        min-height: 100vh;
    }

    .authentication-content {
        max-width: 28rem;
        width: 100%;
        background-color: rgb(0 0 0 / 3%);
        padding: 2rem;
        margin-left:6rem;
        height: 40rem;
        z-index: 1;
        font-family: var(--font-lexend);
    }

    .logo {
        margin-bottom: 1rem;
    }

    .logo-name {
        margin-left: 1rem;
        color: black;
        font-family: var(--font-lexend);
        font-weight: 600;
        font-size: 2rem;
    }

    .slogan {
        color: black;
        font-weight: 400;
        font-family: var(--font-lexend);
        margin-bottom: 1rem;
    }

    .form-login-teacher {
        display: flex;
        flex-direction: column;
    }

    .form-login-teacher > input {
        padding:0.8rem;
        margin-bottom: 1rem;
    }

    .button-login {
        background-color: #d4eb33;
        padding:0.8rem;
    }

    .register-button{
        background-color: #006398;
        border-radius: 2px;
        padding: 0.5rem 1rem;
        font-weight: 300;
        color:white
    }

    .login-teacher-tittle{
        text-transform: uppercase;
        font-size:1.5rem;
    }

    .create-accont-back{
        display: inline-block;
        color: black;

        display: Flex;
        justify-content: center;
        align-items: center;
    }

    .create-accont-back:hover{
        text-decoration: underline; 
        cursor: pointer;
    }
  
`;