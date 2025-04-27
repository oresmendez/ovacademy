'use client'; import { useEffect, useState, apiRest, Cookies, Image, Link, styled, LogoName, HeaderSearchBar, textBarHeader } from '@/app/components/utils/rutas';
import { FaBook } from "react-icons/fa";

export default function Home() {

    const [nombre, setNombre] = useState("");
	const [objetivo, setObjetivo] = useState("");
	const [descripcion, setDescripcion] = useState("");

    const { setHeaderText } = textBarHeader();

    useEffect(() => {

        setHeaderText(<>
            Inicio
        </>);

        obtener_materia();

        Cookies.remove('user-data', {
            secure: true,
            sameSite: 'Strict',
        });

    }, []);

    const obtener_materia = async () => {
		try {
			const response = await apiRest.fetchGet('http://localhost:3333/ovacademy/materia');
			setNombre(response.data.nombre);
			setObjetivo(response.data.objetivo);
			setDescripcion(response.data.descripcion);
		} catch (error) {
			console.error(error);
		}
	};

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
                    <HeaderSearchBar texto={"Inicio"} bgcolor={"#0c2c46"}/>
                </div>
            </div>
            <div className='layout-body- center'>
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
                        {nombre || 'Nombre de la Materia'}
                    </div>
                    <div className='banner-text-description center'>
                        {objetivo || 'Eslogan de la materia'}
                    </div>
                </div>
            
            </div>
            <div className="contenedor-principal">
                <div className="contenido-proyecto">
                    <h2 className="subtitulo">¿En que consiste?</h2>
                    <p className="descripcion-principal">
                        {descripcion || 'Eslogan de la materia'}
                    </p>

                    <h2 className="subtitulo">Objetivo</h2>
                    <p className="descripcion-secundaria">
                        El objetivo principal es proporcionar a los participantes las competencias necesarias para estructurar, evaluar y tomar decisiones sobre proyectos de inversión, utilizando herramientas financieras, metodológicas y estratégicas para garantizar su éxito y sostenibilidad.
                    </p>
                    <h2 className="subtitulo">¿A quién está dirigida?</h2>
                    <p className="descripcion-secundaria">
                        Dirigida a estudiantes universitarios, emprendedores, profesionales que deseen fortalecer sus conocimientos en gestión de proyectos, y cualquier persona interesada en transformar ideas en proyectos viables.
                    </p>
                </div>
                <div className="contenedor-libros">
                    <h2 className="subtitulo">Recursos y Libros Recomendados</h2>
                    <div className="contenedor-imagenes-libros">
                        <a href="/pdfs/libro1.pdf" target="_blank" rel="noopener noreferrer">
                            <FaBook />
                        </a>
                        <a href="/pdfs/libro2.pdf" target="_blank" rel="noopener noreferrer">
                            {/* <Image
                                src="/libros/libro2.png"
                                alt="Libro 2"
                                width={200}
                                height={300}
                            /> */}
                        </a>
                        <a href="/pdfs/libro3.pdf" target="_blank" rel="noopener noreferrer">
                            {/* <Image
                                src="/libros/libro3.png"
                                alt="Libro 3"
                                width={200}
                                height={300}
                            /> */}
                        </a>
                    </div>
                </div>

            </div>
            <div className='layout-footer'>
            
            </div>
            
        </Componente>
    );
}

const Componente = styled.div`

    .contenedor-principal {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 2rem;
        background-color: #ffffff;
        font-family: var(--font-lexend);
    }

    .imagen-proyecto {
        width: 42%;
        border-radius: 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .contenido-proyecto {
        width: 50%;
        padding-right: 2.5rem;
    }

    .titulo-principal {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: #1a1a1a;
    }

    .descripcion-principal {
        margin-bottom: 1.5rem;
        color: #4a4a4a;
        font-size: 1.2rem;
        line-height: 1.6;
        text-align: justify;

    }

    .subtitulo {
        font-size: 1.8rem;
        font-weight: 600;
        margin-bottom: 0.7rem;
        color: #1a1a1a;
    }

    .descripcion-secundaria {
        margin-bottom: 1.5rem;
        color: #4a4a4a;
        font-size: 1.2rem;
        line-height: 1.6;
        text-align: justify;
        
    }

    .contenedor-libros {
        margin-top: 3rem;
        text-align: center;
    }

    .contenedor-imagenes-libros {
        display: flex;
        justify-content: center;
        gap: 2rem;
        flex-wrap: wrap;
        margin-top: 1.5rem;
    }

    .contenedor-imagenes-libros a {
        transition: transform 0.3s ease;
    }

    .contenedor-imagenes-libros a:hover {
        transform: scale(1.05);
}


    @media (max-width: 768px) {
        .contenedor-principal {
            flex-direction: column;
        }

        .imagen-proyecto, 
        .contenido-proyecto {
            width: 100%;
            padding-left: 0;
        }

        .contenido-proyecto {
            margin-top: 2rem;
        }
    }












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
            font-size: 2.1rem;
        }

        .banner-text-description{
            font-size: 1.4rem;
        }
    }

    @media (min-width: 1440px) and (max-width: 2375px) {
        .banner-text{
            padding-right: 30rem;
            padding-bottom: 1rem;
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