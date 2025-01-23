'use client'; import {toast, useState, apiRest, useRouter, Link, styled, Logo_Name_White, startSession } from '@/app/utils/hooks';

export default function crear_user() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');

    const handleRequest = async (event) => {
        event.preventDefault();

        if (!password?.trim() || !verifyPassword?.trim()) {
            return toast.error('Las contraseñas no pueden estar vacías.');
        }
        
        if (password !== verifyPassword) {
            setPassword("");
            setVerifyPassword("");
            return toast.error('Las contraseñas no coinciden.');
        }

        const response = await apiRest.fetchPost('http://localhost:3333/ovacademy/user', {
            email,
            password,
            type_id: 1,
        });

        if (response.status === 409) {
            toast.error(response.data.message);
            return router.push('/auth/login');
        }else if (response.status != 200) {
            return toast.error(response.data.message);
        }

        await startSession(email, password, router);
    };

    return (
        
        <Componente>
            
        <div className='layout-authentication center'>
            <div className='authentication-content mt-30'>
                <Logo_Name_White/>
                <div className='create-account center'>
                    <div className='create-account-tittle mt-20'>
                        CREAR CUENTA
                    </div>
                </div>
                <form className='form-create-account mt-30' onSubmit={handleRequest}>
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
                    <input
                        type="password"
                        placeholder="verificar contraseña"
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                    />
                    <button type="submit" className="button-create-account">Crear</button>
                </form>
                <p className='create-accont-text mt-20'>
                        Al registrarte estas aceptando que tus datos personales sean vistos o manipulados
                        por el personal de la academia.
                    </p>
                <Link href="/" passHref>
                    <span className='create-accont-back mt-20 pb-05'>Regresar</span>
                </Link>                
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
        overflow: auto; /* Permite el desplazamiento */
    }

    .authentication-content {
        max-width: 32rem;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.021);
        padding: 2rem;
        height: auto;
        z-index: 1;
        font-family: var(--font-lexend);
        overflow-y: auto;
    }

    .create-account{
        color: white;
        flex-direction: column;
    }

    .create-account-tittle{
        font-size: 2rem;
    }

    .form-create-account {
        display: flex;
        flex-direction: column;
    }

    input {
        padding:0.8rem;
        margin-bottom: 1rem;
        background-color: #d9d9d9;
    }

    .button-create-account {
        background-color: #d4eb33;
        padding:0.8rem;
    }

    .error-message {
        color: red;
        font-size: 0.9rem;
        margin-top: 1rem;
    }

    .create-accont-text{
        color: white;
        text-align: justify;
        font-size: 1.1rem;
        font-weight: 200;
    }

    .create-accont-back{
        display: inline-block;
        color: white;

        display: Flex;
        justify-content: center;
        align-items: center;
    }

    .create-accont-back:hover{
        text-decoration: underline; 
        cursor: pointer;
        
    }

`;
