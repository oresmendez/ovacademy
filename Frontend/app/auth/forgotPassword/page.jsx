'use client';   import { useState, useRouter, Link, styled, apiRest } from '@/app/utils/hooks';
                import { Logo_Name_White } from '@/app/utils/hooks';

export default function () {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
    
        try {
            const data = await apiRest.fetchPost('http://localhost:3333/ovacademy/login', {
                email, 
                password, 
            });   
            if (data) {
                router.push('/ovacademy');
            } else {
                setError(data.message || 'Credenciales incorrectas');
            }
        } catch (err) {
            setError('Error al conectar con el servidor');
        }
    };

    return (
        <Componente>
        <div className='layout-authentication center'>
            <div className='authentication-content'>
                <Logo_Name_White/>
                <div className='forgot-password center'>
                    <div className='forgot-password-tittle mt-20'>
                        PASSWORD RESET
                    </div>
                    <p className='forgot-password-text mt-10'>
                        Introduzca el nombre de usuario que utilizó al crear su cuenta. 
                        Se enviará un correo electrónico a esa dirección con más instrucciones 
                        sobre cómo restablecer su contraseña.
                    </p>
                
                </div>
                <form className='form-login mt-30' onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" className="button-login">Send Password Reset Email</button>
                </form>
                <Link href="/auth/login" passHref>
                    <span className='forgot-password-cancel mt-20 pb-05'>Cancel</span>
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
    }

    .authentication-content {
        max-width: 32rem;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.021);
        padding: 2rem;
        height: 40rem;
        z-index: 1;
        font-family: var(--font-lexend);
    }

    .forgot-password{
        color: white;
        flex-direction: column;
    }

    .forgot-password-tittle{
        font-size: 2rem;
    }

    .forgot-password-text{
        text-align: justify;
        font-size: 1.1rem;
        font-weight: 200;
    }

    .form-login {
        display: flex;
        flex-direction: column;
    }

    input {
        padding:0.8rem;
        margin-bottom: 1rem;
    }

    .button-login {
        background-color: #d4eb33;
        padding:0.8rem;
    }

    .error-message {
        color: red;
        font-size: 0.9rem;
        margin-top: 1rem;
    }

    .forgot-password-cancel{
        display: inline-block;
        color: white;

        display: Flex;
        justify-content: center;
        align-items: center;
    }

    .forgot-password-cancel:hover{
        text-decoration: underline; 
        cursor: pointer;
    }
`;
