"use client";
import { useState, useEffect, useParams, BannerMateria, styled, apiRest, Link, textBarHeader, Spinner } from '@/app/components/utils/rutas';
import { FaExclamationCircle } from 'react-icons/fa'; // Asegúrate de instalar react-icons

export default function MateriasUnidades() {

    const { setHeaderText } = textBarHeader();
    const [showSpinner, setShowSpinner] = useState(false);
	const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);

    const { idUnidad } = useParams();
    const [nameUnidad, setNameUnidad] = useState('');
    const [allUnidades, setAllUnidades] = useState([]);
    const [contenidos, setContenidos] = useState([]);

    useEffect(() => {
        if (idUnidad) {
            obtenerUnidad();
            obtenerAllUnidades();
        }
    }, [idUnidad]);
    

    useEffect(() => {
        if (nameUnidad) {
            setHeaderText(() => (
                <>
                    <Link href="/ovacademy/estudiante/dashboard">Dashboard</Link>
                    <span className="separator">&gt;</span>
                    {nameUnidad}
                </>
            ));
        }
    }, [nameUnidad]);

   
    const obtenerUnidad = async () => {
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades/${idUnidad}`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                setNameUnidad(`${response.data.data.modulo} - ${response.data.data.nombre}`);
                obtenerContenidosByUnidad()
            }

        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
        }finally { clearTimeout(timeout); setShowSpinner(false);}
    };

    const obtenerAllUnidades = async () => {
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades/estudiante`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                setAllUnidades(response.data.data);
            }

        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
        }finally { clearTimeout(timeout); setShowSpinner(false);}
    };

    const obtenerContenidosByUnidad = async () => {
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/contenido/${idUnidad}`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                setContenidos(response.data)
            }

        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
        }finally { clearTimeout(timeout); setShowSpinner(false);setIsLoadingRespuestas(false);}
    };

    let contenido;

    if (showSpinner || isLoadingRespuestas) {
        contenido = <Spinner show={showSpinner} />;
    } else {
        const contenidoDisponible = Array.isArray(contenidos) && contenidos.length > 0;
        contenido = (
            <div className='layout-body'>
                <div className='container-body'>
                    <BannerMateria />
                    <div className='description-content-subjects mt-30'>
                        <div className="description-content-subjects-list">
                            <div className="course-content">
                                <ul className="content-list">
                                    {contenidoDisponible ? (
                                        contenidos.map((item) => (
                                            <li className="content-item" key={item.id}>
                                                <Link href={`/ovacademy/estudiante/unidad/${idUnidad}/${item.id}`} passHref legacyBehavior>
                                                    <a>
                                                        <span className="content-title">{item.nombre}</span>
                                                        <p>{item.descripcion ? item.descripcion : "Sin descripción disponible."}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                        ))
                                    ) : (
                                        <div style={containerStyle}>
                                            <FaExclamationCircle style={iconStyle} />
                                            <h2 style={titleStyle}>El contenido no está disponible</h2>
                                            <p style={messageStyle}>Ocurrió un error al obtener el contenido de la unidad, contacte a su profesor.</p>
                                        </div>
                                    )}
                                </ul>
                            </div>
                        </div>
    
                        {/* Si el contenido está disponible, se muestra en dos columnas */}
                        {contenidoDisponible ? (
                            <div className='opciones'>
                                <div className='btn-evaluacion center'>
                                    <Link href={`/ovacademy/estudiante/unidad/${idUnidad}/evaluaciones`} className="btn-evaluaciones center">
                                        Evaluación
                                    </Link>

                                </div>
                                
                                <div className='related-units-tittle mt-10'>Otras unidades que pueden interesarte</div>
                                <div className='description-content-subjects-other-subjets mt-20'>
                                    <div className='related-units-list center-column'>
                                        {allUnidades
                                            .filter((item) => item.id !== parseInt(idUnidad)) // Excluye la unidad actual
                                            .slice(0, 5) 
                                            .map((unidad) => (
                                                <div className='related-unit-card center-left' key={unidad.id}>
                                                    <Link href={`/ovacademy/estudiante/unidad/${unidad.id}`} passHref>
                                                        <h4>{unidad.nombre}</h4>
                                                    </Link>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Si el contenido no está disponible, se muestra en una sola columna
                            <div className="single-column">
                                {/* Puedes mostrar aquí un mensaje alternativo o solo las unidades relacionadas */}
                                <div className='related-units-tittle mt-10'>Otras unidades que pueden interesarte</div>
                                <div className='description-content-subjects-other-subjets mt-20'>
                                    <div className='related-units-list center-column'>
                                        {allUnidades
                                            .filter((item) => item.id !== parseInt(idUnidad)) // Excluye la unidad actual
                                            .slice(0, 5) 
                                            .map((unidad) => (
                                                <div className='related-unit-card center-left' key={unidad.id}>
                                                    <Link href={`/ovacademy/estudiante/unidad/${unidad.id}`} passHref>
                                                        <h4>{unidad.nombre}</h4>
                                                    </Link>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    


    return <Component>{contenido}</Component>;

}

const Component = styled.div`

    .banner-subjects {
        width: 100%;
        height: 8rem;
        background: linear-gradient(to right, #026b95, #0d1e37);
        border-radius: 0.5rem;
        color: white;
        font-family: var(--font-lexend);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
    }

    .banner-subjects-text {
        font-weight: 600;
        font-size: 2rem;
    }

    .banner-subjects-subtext {
        font-weight: 400;
        font-size: 1.3rem;
    }

    .description-subjects-general {
        width: 100%;
        font-family: var(--font-lexend);
        color: black;
        font-weight: 400;
        font-size: 1.3rem;
        text-align: justify;
    }

    .description-content-subjects {
        display: flex;
        flex-direction: row;
        height: 350px;
    }

    .description-content-subjects-list {
        flex-grow: 2;
        max-width: 1100px;
        max-height: 35rem; /* Limita la altura máxima */
        height: 35rem;
        overflow-y: auto; /* Agrega un scroll vertical si el contenido excede */
    }

    /* Estilizar el scroll */
    .description-content-subjects-list::-webkit-scrollbar {
        width: 0.1rem;/* Cambia el ancho del scroll */
    }

    .description-content-subjects-list::-webkit-scrollbar-thumb {
        background: #a9c4d9; /* Color de la barra */
        border-radius: 10px; /* Hace que los bordes sean redondeados */
    }

    .description-content-subjects-list::-webkit-scrollbar-thumb:hover {
        background: #8aa9c0; /* Color al pasar el cursor */
    }

    .description-content-subjects-list::-webkit-scrollbar-track {
        background: transparent; /* Color de fondo del track del scroll */
    }

    .course-content {
        padding: 20px;
        font-family: var(--font-lexend);
    }

    .content-list {
        list-style: none;
        padding: 0;
    }

    .content-list li {
        background: #f0f4ff;
        margin: 10px 0;
        padding: 15px;
        border-left: 5px solid #4a90e2;
        border-radius: 5px;
        transition: background 0.3s ease;
        cursor: pointer;
    }

    .content-list li:hover {
        background: #a9c4d9;
        color: white;
    }

    .content-title {
        font-weight: bold;
        font-size: 1.4em;
        color: #2c3e50;
    }

    .content-list p {
        margin: 5px 0 0;
        color: #555;
        font-size: 1.2rem;
    }

    .description-content-subjects-other-subjets {
        background-color: inherit;
        max-width: 31rem;
        max-height: 28rem; /* Limita la altura máxima */
        height: 28rem;
        overflow-y: auto; /* Corregir desbordamiento */
        padding: 20px; /* Agregar espacio interno */
        font-family: var(--font-lexend);
    }

    .description-content-subjects-other-subjets::-webkit-scrollbar {
        width: 0.1rem;/* Cambia el ancho del scroll */
    }

    .description-content-subjects-other-subjets::-webkit-scrollbar-thumb {
        background: #a9c4d9; /* Color de la barra */
        border-radius: 10px; /* Hace que los bordes sean redondeados */
    }

    .related-units-tittle {
        font-size: 1.2rem;
        font-weight: bold;
        color: #333;
        text-align: center;
    }

    .related-units-list {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .related-unit-card {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        padding: 15px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: pointer;
        width: 100%; /* Ajusta la tarjeta dentro del enlace */
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .related-units-list a:hover .related-unit-card {
        transform: translateY(-5px);
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    }

    .related-unit-card h4 {
        font-size: 1.2rem;
        color: #026b95;
        margin-bottom: 10px;
    }

    .related-unit-card p {
        font-size: 1.2rem;
        color: #555;
        margin-bottom: 15px;
    }

    .related-unit-link {
        display: inline-block;
        padding: 10px 15px;
        background-color: #026b95;
        color: white;
        border-radius: 5px;
        text-decoration: none;
        font-weight: bold;
        transition: background-color 0.3s ease;
    }

    .related-unit-link:hover {
        background-color: #024d73;
    }

    .btn-evaluaciones {
        width: 80%;
        height: 2.5rem;
        background-color: #276483;
        color: white;
        padding: 10px 20px;
        font-size: 16px;
        border: none;
        border-radius: 8px;
        font-size: 1.2rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
        font-family: var(--font-lexend);
    }

    .btn-evaluaciones:hover {
        background-color: #0056b3;
    }

`;

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',

    borderRadius: '16px',
    padding: '40px',
    fontFamily: 'Segoe UI, Roboto, sans-serif',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '0 auto',
  };

  const iconStyle = {
    fontSize: '48px',
    color: '#ff6b6b',
    marginBottom: '20px',
  };

  const titleStyle = {
    fontSize: '22px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  };

  const messageStyle = {
    fontSize: '18px',
    color: '#666',
    lineHeight: '1.5',
  };