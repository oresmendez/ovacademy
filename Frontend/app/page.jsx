'use client'; import { useEffect, Cookies, Image, Link, styled, LogoName, HeaderSearchBar } from '@/app/utils/hooks';

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
                    <LogoName size_logo={40} size_name={1.5} />
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
                <HeaderSearchBar texto={"Inicio"}/>
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
                    Formulación y Evaluación de Proyectos
                </div>
                <div className='banner-text-description center'>
                    Convierte ideas en proyectos, y proyectos en éxito. <br></br>
                    Tu guía para diseñar proyectos sostenibles y rentables.
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
        max-width: 90%;
        margin: 0 auto;
        position: relative;
        z-index: 2;
        font-family: var(--font-lexend);
        text-align: center;
    }

    .banner-text-title {
        font-weight: 600;
        font-size: 2rem;
    }

    .banner-text-description{
        margin-top: 1rem;
        font-weight: 200;
        font-size: 1rem;
        text-align: center;
    }

    .layout-footer{

    }

    @media (min-width: 2560px) {
        .banner-text-title {
            font-size: 2.6rem;
        }
        .banner-text-description{
            font-size: 1.3rem;
        }
    }

    /* 🖥️ Monitores grandes y pantallas Full HD (1441px - 2559px) */
    @media (min-width: 1441px) and (max-width: 2559px) {
        .banner-text-title {
            font-size: 2.5rem;
        }

        .banner-text-description{
            font-size: 1.2rem;
        }
    }

    @media (min-width: 1440px) and (max-width: 2375px) {
        .banner-text{
            padding-right: 8rem;
        }

    }
        /* 🖥️ Escritorios estándar (1025px - 1440px) */
    @media (min-width: 1025px) and (max-width: 1440px) {
        .banner-text-title {
            font-size: 2.1rem;
        }

        .banner-text-description{
            font-size: 1.2rem;
        }

    }

        /* 💻 Tablets y pantallas pequeñas (769px - 1024px) */
    @media (min-width: 769px) and (max-width: 1024px) {
        .banner-text-title {
            font-size: 2rem;
        }

        .banner-text-description{
            font-size: 1.2rem;
        }

    }

        /* 📱 Móviles grandes y pequeñas tablets (481px - 768px) */
    @media (min-width: 481px) and (max-width: 768px) {
        .banner-text-title {
            font-size: 1.8rem;
        }

        .banner-text-description{
            font-size: 1.1rem;
        }

    }

        /* 📱 Móviles estándar (321px - 480px) */
    @media (min-width: 321px) and (max-width: 480px) {
        .banner-text-title {
            font-size: 1.6rem;
        }

        .banner-text-description{
            font-size: 1rem;
        }

    }

        /* 📱 Móviles pequeños (hasta 320px) */
    @media (max-width: 320px) {
        .banner-text-title {
            font-size: 1.4rem;
        }

        .banner-text-description{
            font-size: 0.8rem;
        }

    }

`;