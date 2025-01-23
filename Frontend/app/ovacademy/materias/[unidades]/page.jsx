"use client";
import { useState, useEffect, useParams, styled, apiRest, Link, textBarHeader } from '@/app/utils/hooks';

export default function MateriasUnidades() {

    const { unidades } = useParams();

    const [units, setUnits] = useState([]); 
    const [unaMateria, setUnaMateria] = useState({});
    const [todasLasUnidades, setTodasLasUnidades] = useState([]);
    const [allUnidades, setAllUnidades] = useState({});

    const { setHeaderText } = textBarHeader();

    useEffect(() => {
        const breadcrumbHTML = (
            <>
                <Link href={`/ovacademy/dashboard`}>Dashboard</Link>{" "}
                <span className='separator'>&gt; </span>
                unidades
            </>
        );

        setHeaderText(breadcrumbHTML);

        const fetchData = async () => {
            try {
                const [rUnaMateria, rTodasLasUnidades, rAllUnidades, rUnits] = await Promise.all([
                    apiRest.fetchPost('http://localhost:3333/ovacademy/subject/obtenerUnaMateria', { id: 1 }),
                    apiRest.fetchPost('http://localhost:3333/ovacademy/subject/unidades/obtenerTodasLasUnidades', { id: 1 }),
                    apiRest.fetchPost('http://localhost:3333/ovacademy/subject/unidades/show', { id: unidades }),
                    apiRest.fetchPost('http://localhost:3333/ovacademy/subject/unidades/contents/index', { id: unidades }),
                ]);

                setUnaMateria(rUnaMateria.data);
                setTodasLasUnidades(rTodasLasUnidades.data.slice(0, 3)); // Limitar a un máximo de 3
                setAllUnidades(rAllUnidades.data);
                setUnits(rUnits.data);
            } catch (err) {
                console.error('Error al conectar con el servidor:', err);
            }
        };

        fetchData();
    }, [unidades]);

    return (
        <StyledComponent>
            <div className='layout-body'>
                <div className='container-body'>
                    <div className='banner-subjects'>
                        <span className='banner-subjects-text ml-20'>{unaMateria.nombre}</span>
                        <span className='banner-subjects-subtext ml-30 mt-05'>
                            {todasLasUnidades[0]?.nombre || 'Nombre de la unidad'}
                        </span>
                    </div>

                    <div className='description-subjects-general mt-10 p-10'>
                        <p>{todasLasUnidades[0]?.descripcion || 'Sin descripción disponible.'}</p>
                    </div>

                    <div className='description-content-subjects'>
                        <div className='description-content-subjects-list'>
                            <div className='course-content'>
                                <ul className='content-list'>
                                    {units.map((unit) => (
                                        <li key={unit.id}>
                                            <Link href={`/ovacademy/materias/${unidades}/${unit.id}`} passHref>
                                                <span className='content-title'>{unit.nombre}</span>
                                            </Link>
                                            <p>{unit.descripcion || 'Sin descripción disponible.'}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className='description-content-subjects-other-subjets'>
                            <div className='related-units-tittle mb-10'>Otras unidades que pueden interesarte</div>
                            <div className='related-units-list center-column'>
                                {todasLasUnidades.slice(0, 5).map((unidad) => ( // Limitar a 3 elementos
                                    <div className='related-unit-card center-left' key={unidad.id}>
                                        <h4>{unidad.nombre}</h4>
                                        {/* <a href={`/ovacademy/materias/${unaMateria.id}/${unidad.id}`} className="related-unit-link">-</a> */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StyledComponent>
    );
}

const StyledComponent = styled.div`

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
        max-height: 28rem; /* Limita la altura máxima */
        height: 28rem;
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
        flex: 1 1 calc(30% - 20px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        width:100%;
    }

    .related-unit-card:hover {
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
`;