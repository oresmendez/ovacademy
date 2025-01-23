'use client'; import { useEffect, Cookies, Image, Link, styled, Logo_Name, Header_search_bar } from '@/app/utils/hooks';

export default function Home() {

    useEffect(() => {
            Cookies.remove('user-data', {
                secure: true,
                sameSite: 'Strict',
            });
        }, []);

return (
    <Componente>
        <div className='layout-header'>
            <div className='container-header pl-20 pr-20'>
                <div className='header-logo center-right pl-20'>
                    <Logo_Name size_logo={40} size_name={1.5} />
                </div>
                <nav className='header-navigation'>
                    <div className='header-navigation-test'></div>
                    <div className='header-navigation-group'>
                        <div className='header-navigation-group-button center'>
                            <Link href="/auth/register" passHref>
                                <button id='home-register' className='group-register-button mr-10'>Registrar</button>
                            </Link>
                            <Link href="/auth/login" passHref>
                                <button id='home-signUp' className='group-signIn-button mr-10'>Ingresar</button>
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>
            <div className=''>
                <Header_search_bar texto={"Inicio"}/>
            </div>
        </div>
        <div className='layout-body- center'>
            <div className='banner-image'>
                <Image
                    src="/banner-home.png"
                    alt="banner-home"
                    layout="fill"
                    objectFit="cover"
                    priority
                />
            </div>
            <div className="banner-text center-column">
                <div className='banner-text-title'>
                    Academia Universitaria
                </div>
                <div className='banner-text-description center'>
                Avanza y potencia tus habilidades, 
                transformando tus conocimientos con recursos digitales de aprendizaje innovadores.
                </div>
            </div>
        
        </div>
        <div className='layout-footer'>
        
        </div>
        
    </Componente>
);
}

const Componente = styled.div`

    .layout-header{

    }

    .container-header{
        height: var(--size--header);
        display: flex;
        justify-content: space-between;
    }

    .header-logo{

    }

    .header-navigation{
        display: flex;
        justify-content: space-between;
        width: 22rem;
    }

    .header-navigation-test {
        flex-grow: 1;
    }

    .header-navigation-group {
        display: flex;
        flex-grow: 2;
    }

    .header-navigation-group-button {
        flex: 1;
        justify-content: flex-end;

        font-family: var(--font-lexend);
        font-weight: 400;
        font-size: 1rem;
    }

    .group-register-button{
        color: var(--color-azul-vibrante);
        
        border-radius: 2px;
        padding: 0.5rem 1rem;
        font-weight: bold;
    }

    .group-register-button:hover{
        background-color: #ebebeb;
    }

    .group-signIn-button {
        color: var(--ui-color-button-label-negative);
        background-color: var(--color-azul-vibrante);
        border-radius: 2px;
        padding: 0.5rem 1rem;
    }

    .layout-body-{
        position: relative;
        height: 330px;
        overflow: hidden;
    }

    .banner-image{
        
    }

    .banner-text {
        
        color: white;
        max-width:700px;
        margin: 0 auto;
        position: relative;
        
        z-index: 2;

        font-family: var(--font-lexend);
    }  

    .banner-text-title {
        font-weight: 600;
        font-size: 2.8rem;
    }

    .banner-text-description{
        margin-top: 1rem;
        font-weight: 200;
        font-size: 1.2rem;

        text-align: center;
    }

    .layout-footer{

    }

`;