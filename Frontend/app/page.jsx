'use client'; import { useEffect, useState, apiRest, gestorCookie, Image, Link, styled, LogoName, PropTypes, HeaderSearchBar, textBarHeader, Spinner } from '@/app/components/utils/rutas';
import { FaBookOpen, FaBookReader, FaBook } from 'react-icons/fa';

export default function Home() {

    const [showSpinner, setShowSpinner] = useState(false);
	const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);

    const [nombre, setNombre] = useState("");
	const [objetivo, setObjetivo] = useState("");
	const [descripcion, setDescripcion] = useState("");

    const { setHeaderText } = textBarHeader();

    useEffect(() => {
        setHeaderText(<>Home</>);
        obtenerMateria({ setNombre, setObjetivo, setDescripcion, setShowSpinner, setIsLoadingRespuestas });
        gestorCookie.removeCookie()

    }, []);

    let contenido;
    
    if (showSpinner || isLoadingRespuestas) {
        contenido = <Spinner show={showSpinner} />;
    } else {
        contenido = (
            <Componente>
                <Header />
                <Banner nombre={nombre} objetivo={objetivo} />
                <div className="contenedor-principal">
                    <ContenidoPrincipal descripcion={descripcion} />
                    <RecursosLibros />
                </div>
                <Footer />
            </Componente>
        );
    }

    return contenido;
}

// #region Javascript 🔆
    const obtenerMateria = async ({ setNombre, setObjetivo, setDescripcion, setShowSpinner, setIsLoadingRespuestas }) => {
        let timeout;
        try {
            timeout = setTimeout(() => setShowSpinner(true), 300);

            const url = `${process.env.NEXT_PUBLIC_API_URL}/materia`
            const response = await apiRest.fetchGet(url);
            setNombre(response.data.nombre);
            setObjetivo(response.data.objetivo);
            setDescripcion(response.data.descripcion);

        } catch (error) {
            console.error(error);
        } finally {
            clearTimeout(timeout);
            setShowSpinner(false);
            setIsLoadingRespuestas(false);
        }
    };
// #endregion
// #region componentes < Header/> 👽
    
    function Header() {
        return (
            <HeaderStyled className='layout-header'>
                <div className='container-header pl-20 pr-20'>
                    <div className='header-logo center-right pl-20'>
                        <LogoName size_logo={40} size_name={1.5} />
                    </div>
                    <nav className='header-navigation'>
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
                <HeaderSearchBar texto={"Inicio"} bgcolor={"#0c2c46"} />
            </HeaderStyled>
        );
    }

    const HeaderStyled = styled.div`
        .container-header {
            height: var(--size--header);
            display: flex;
            justify-content: space-between;
        }

        .header-logo {
            padding-left: 1.25rem;
        }

        .header-navigation {
            display: flex;
            justify-content: space-between;
            width: 22rem;
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

        .group-register-button {
            color: var(--color-azul-vibrante);
            border-radius: 2px;
            padding: 0.5rem 1rem;
            font-weight: bold;
            margin-right: 0.625rem; /* mr-10 */
        }

        .group-register-button:hover {
            background-color: #ebebeb;
        }

        .group-signIn-button {
            color: var(--ui-color-button-label-negative);
            background-color: var(--color-azul-vibrante);
            border-radius: 2px;
            padding: 0.5rem 1rem;
            margin-right: 0.625rem;
        }
    `;
    
// #endregion
// #region componentes < Banner/> 👽
    
    function Banner({ nombre, objetivo }) {
        return (
            <BannerStyled className='layout-body- center'>
                <div className='banner-image'>
                    <Image
                        src="/banner-home.png"
                        alt="banner-home"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </div>
                <div className="banner-text center-column">
                    <div className='banner-text-title'>
                        {nombre || 'Formulación y evaluación de proyectos de inversión'}
                    </div>
                    <div className='banner-text-description center'>
                        {objetivo || 'Crear profesionales que tengan habilidades para el desarrollo de micro-empresas'}
                    </div>
                </div>
            </BannerStyled>
        );
    }
    const BannerStyled = styled.div`
        position: relative;
        height: 330px;
        overflow: hidden;

        .banner-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
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
            font-size: 1.5rem;
        }

        .banner-text-description {
            margin-top: 1rem;
            font-weight: 200;
            font-size: 1rem;
            text-align: center;
        }

        @media (min-width: 2560px) {
            .banner-text-title {
            font-size: 2.6rem;
            }
            .banner-text-description {
            font-size: 1.3rem;
            }
        }

        @media (min-width: 1441px) and (max-width: 2559px) {
            .banner-text-title {
            font-size: 2.1rem;
            }
            .banner-text-description {
            font-size: 1.4rem;
            }
        }

        @media (min-width: 1440px) and (max-width: 2375px) {
            .banner-text {
            padding-right: 30rem;
            padding-bottom: 1rem;
            }
        }

        @media (min-width: 1025px) and (max-width: 1440px) {
            .banner-text-title {
            font-size: 2.1rem;
            }
            .banner-text-description {
            font-size: 1.2rem;
            }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
            .banner-text-title {
            font-size: 2rem;
            }
            .banner-text-description {
            font-size: 1.2rem;
            }
        }

        @media (min-width: 481px) and (max-width: 768px) {
            .banner-text-title {
            font-size: 1.8rem;
            }
            .banner-text-description {
            font-size: 1.1rem;
            }
        }

        @media (min-width: 321px) and (max-width: 480px) {
            .banner-text-title {
            font-size: 1.6rem;
            }
            .banner-text-description {
            font-size: 1rem;
            }
        }

        @media (max-width: 320px) {
            .banner-text-title {
            font-size: 1.4rem;
            }
            .banner-text-description {
            font-size: 0.8rem;
            }
        }
    `;
    Banner.propTypes = {
        nombre: PropTypes.string,
        objetivo: PropTypes.string,
    };

// #endregion
// #region componentes < ContenidoPrincipal/>👽

    function ContenidoPrincipal({ descripcion }) {
        return (
            <ContenidoPrincipalStyled>
                <div className="tarjeta-contenido">
                    <h2 className="subtitulo">🤓 ¿En qué consiste?</h2>
                    <p className="descripcion">{descripcion || 'Eslogan de la materia'}</p>
                </div>

                <div className="tarjeta-contenido">
                    <h2 className="subtitulo">🎯 Objetivo</h2>
                    <p className="descripcion">
                        El objetivo principal es proporcionar a los participantes las competencias necesarias para estructurar, evaluar y tomar decisiones sobre proyectos de inversión...
                    </p>
                </div>

                <div className="tarjeta-contenido">
                    <h2 className="subtitulo">👥 ¿A quién está dirigida?</h2>
                    <p className="descripcion">
                        Dirigida a estudiantes universitarios, emprendedores, profesionales que deseen fortalecer sus conocimientos...
                    </p>
                </div>
            </ContenidoPrincipalStyled>
        );
    }

    ContenidoPrincipal.propTypes = {
        descripcion: PropTypes.string,
    };

    const ContenidoPrincipalStyled = styled.div`
        width: 48%;
        display: flex;
        flex-direction: column;
        gap: 2rem;

        .tarjeta-contenido {
            background: #ffffff;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
            animation: fadeUp 0.6s ease forwards;
        }

        .subtitulo {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 0.8rem;
            color: #1a1a1a;
            border-left: 4px solid #3498db;
            padding-left: 0.5rem;
        }

        .descripcion {
            font-size: 1.15rem;
            line-height: 1.6;
            text-align: justify;
            color: #4a4a4a;
        }

        @media (max-width: 768px) {
            width: 100%;
        }

        @keyframes fadeUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;

// #endregion
// #region componentes < RecursosLibros/>👽

    function RecursosLibros() {
        return (
            <RecursosLibrosStyled>
                <h2 className="subtitulo">📚 Recursos y Libros Recomendados</h2>
                <div className="contenedor-imagenes-libros">
                    <div className="tarjeta-libro">
                        <FaBook size={50} />
                        <p>Libro 1</p>
                        <a href="/pdfs/libro1.pdf" target="_blank" rel="noopener noreferrer">Ver PDF</a>
                    </div>
                    <div className="tarjeta-libro">
                        <FaBookOpen size={50} />
                        <p>Libro 2</p>
                        <a href="/pdfs/libro2.pdf" target="_blank" rel="noopener noreferrer">Ver PDF</a>
                    </div>
                    <div className="tarjeta-libro">
                        <FaBookReader size={50} />
                        <p>Libro 3</p>
                        <a href="/pdfs/libro3.pdf" target="_blank" rel="noopener noreferrer">Ver PDF</a>
                    </div>
                </div>
            </RecursosLibrosStyled>
        );
    };

    const RecursosLibrosStyled = styled.div`
        width: 48%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .subtitulo {
            font-size: 1.8rem;
            margin-bottom: 2rem;
            color: #2c3e50;
            font-weight: 700;
            text-align: center;
        }

        .contenedor-imagenes-libros {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1.5rem;
            width: 100%;
        }

        .tarjeta-libro {
            background: #ffffff;
            border-radius: 12px;
            padding: 1rem;
            width: 140px;
            text-align: center;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.07);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .tarjeta-libro:hover {
            transform: translateY(-6px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
        }

        .tarjeta-libro p {
            margin: 0.7rem 0 0.5rem;
            font-size: 1rem;
            font-weight: 500;
        }

        .tarjeta-libro a {
            display: inline-block;
            margin-top: 0.3rem;
            background-color: #3498db;
            color: white;
            padding: 0.4rem 0.8rem;
            border-radius: 6px;
            font-size: 0.85rem;
            text-decoration: none;
            transition: background 0.3s;
        }

        .tarjeta-libro a:hover {
            background-color: #2c80b4;
        }

        @media (max-width: 768px) {
            width: 100%;
        }
    `;

// #endregion
// #region componentes < Footer/>👽
    function Footer() {
        return <FooterStyled className='layout-footer'></FooterStyled>;
    }
    const FooterStyled = styled.div`
    
    `;
// #endregion
// #region componentes < Componente/>👽
    const Componente = styled.div`
        .contenedor-principal {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: flex-start;
            gap: 3rem;
            padding: 3rem 2rem;
            background-color: #ffffff;
            font-family: var(--font-lexend);
            flex-wrap: wrap;
        }


        .imagen-proyecto {
            width: 42%;
            border-radius: 1rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
            .contenedor-principal {
            flex-direction: column;
            }

            .imagen-proyecto {
            width: 100%;
            padding-left: 0;
            }
    }
    `;
// #endregion
