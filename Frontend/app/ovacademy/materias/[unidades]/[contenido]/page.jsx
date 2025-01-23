'use client'; import { useState, useEffect, useParams, styled, apiRest, Link, textBarHeader } from '@/app/utils/hooks';

export default function () {
    const params = useParams();
    const { unidades, contenido } = params;
 
    const [nameMateria, setNameMateria] = useState({});
    const [nameUnidad, setNameUnidad] = useState({});
    const [nameContenido, setnameContenido] = useState({});
    const [activeTab, setActiveTab] = useState(0);

    const { setHeaderText } = textBarHeader();

    useEffect(() => {

        const breadcrumbHTML = (
            <>
                <Link href={`/ovacademy/dashboard`}>
                    Dashboard
                </Link>{" "}
                <span className='separator'>
                    &gt;{" "}
                </span>
                
                <Link href={`/ovacademy/materias/${unidades}`}>
                    unidades
                </Link>{" "}
                <span className='separator'>
                    &gt;{" "}
                </span>
                contenido
            </>
        );
    
        setHeaderText(breadcrumbHTML);

        const fetchData = async () => {
            try {

                const [responseNameMateria, responseNameUnidad, responseNameContenido] = await Promise.all([
                    apiRest.fetchPost('http://localhost:3333/ovacademy/subject/obtenerUnaMateria', { id:1 }),
                    apiRest.fetchPost('http://localhost:3333/ovacademy/subject/unidades/show', { id: unidades }),
                    apiRest.fetchPost('http://localhost:3333/ovacademy/subject/unidades/contents/show', { id: contenido }),
                ]);

                setNameMateria(responseNameMateria.data);
                setNameUnidad(responseNameUnidad.data);
                setnameContenido(responseNameContenido.data);
                

            } catch (err) {
                console.error('Error al conectar con el servidor:', err);
            }
        };
        fetchData();
    }, [unidades]);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    return (
        <Componente>
            <div className='layout-body'>
                <div className='container-body'>
                    
                    <div className='banner-subjects'>
                        <span className='banner-subjects-text ml-20'>
                            {nameMateria.nombre}
                        </span>
                        <span className="banner-subjects-subtext ml-30 mt-05">
                            {nameUnidad?.nombre || 'Nombre de la unidad'}: {nameContenido?.nombre || 'Nombre del Contenido'}
                        </span>
                    </div>

                    <div className='description-subjects-general mt-10 p-10'>
                        <p>
                            {nameUnidad.descripcion || 'Sin descripción disponible.'}
                        </p>
                    </div>

                    <div className='description-content-subjects'>
                        <div className='description-content-subjects-list'>
                            <div className='course-content'>
                                <div className='tab'>
                                    <button
                                        className={`tab-button ${activeTab === 0 ? 'active' : ''}`}
                                        onClick={() => handleTabClick(0)}
                                    >
                                        Sobre este curso
                                    </button>
                                    <button
                                        className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
                                        onClick={() => handleTabClick(1)}
                                    >
                                        Contenido
                                    </button>
                                    <button
                                        className={`tab-button ${activeTab === 2 ? 'active' : ''}`}
                                        onClick={() => handleTabClick(2)}
                                    >
                                        Evaluación
                                    </button>
                                </div>
                                <div className='tab-content'>
                                    <div className={`tab-panel ${activeTab === 0 ? 'active' : ''}`}>
                                        <h3>Introducción</h3>
                                        <p>En esta sección se presenta una visión general de la unidad y el contenido relacionado. Aquí puedes encontrar información básica para comenzar.</p>
                                    </div>
                                    <div className={`tab-panel ${activeTab === 1 ? 'active' : ''}`}>
                                        <h3>Contenido Detallado</h3>
                                        <p>Esta sección incluye todos los detalles relacionados con el tema. Aquí se pueden encontrar gráficos, ejemplos prácticos y explicaciones profundas.</p>
                                        
                                        <ul className="resource-list">
                                            <li>
                                                <a href="/files/ejemplo.pdf" target="_blank" download className="resource-item pdf">
                                                    📄 Guía de Introducción (PDF)
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/path-to-word.docx" target="_blank" download className="resource-item word">
                                                    📝 Plantilla de Trabajo (Word)
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/path-to-excel.xlsx" target="_blank" download className="resource-item excel">
                                                    📊 Datos de Ejemplo (Excel)
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/path-to-powerpoint.pptx" target="_blank" download className="resource-item ppt">
                                                    📈 Presentación del Tema (PowerPoint)
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className={`tab-panel ${activeTab === 2 ? 'active' : ''}`}>
                                        <h3>Recursos Adicionales</h3>
                                        <p>Accede a recursos adicionales como videos, documentos PDF, y enlaces a materiales externos que complementan la unidad.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='description-content-subjects-test'>Details</div>
                    </div>

                    
                </div>
            </div>
        </Componente>
    );
}

const Componente = styled.div`

    .banner-subjects {
        width: 100%;
        height: 8rem;
        background: linear-gradient(to right, #026b95, #0d1e37);
        border-radius: 0.5rem;
        color: white;
        font-family: var(--font-lexend);

        display: flex;
        flex-direction: column;
        align-content: space-around;
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
        height: auto;
        width: 100%;
        font-family: var(--font-lexend);
        color: black;
        font-weight: 400;
        font-size: 1.3rem;
        text-align: justify;
        flex-direction: column;
    }

    .description-content-subjects {
        display: flex;
        flex-direction: row;
        height: 350px;
    }

    .description-content-subjects-list {
        height: inherit;
        flex-grow: 2;
        max-width: 1100px;
    }
    
    .course-content {
        
        padding: 20px;
        font-family: var(--font-lexend);
    }

    .tab {
        display: flex;
        border-bottom: 2px solid #ccc;
        margin-bottom: 10px;
    }

    .tab-button {
        padding: 10px 20px;
        cursor: pointer;
        background-color: #f9f9f9;
        border: none;
        border-bottom: 2px solid transparent;
        font-size: 1.1rem;
        transition: all 0.3s ease;
    }

    .tab-button:hover {
        background-color: #e6e6e6;
    }

    .tab-button.active {
        background-color: #fff;
        border-bottom: 2px solid #007BFF;
        font-weight: bold;
    }

    .tab-content {
        padding: 20px;
        background-color: #f4f4f9;
        border: 1px solid #ddd;
        border-radius: 5px;
        min-height: 300px;
    }

    .tab-panel {
        display: none;
    }

    .tab-panel.active {
        display: block;
    }

    .tab-panel h3 {
        font-size: 1.5rem;
        color: #007BFF;
        margin-bottom: 10px;
    }

    .tab-panel p {
        font-size: 1rem;
        color: #333;
    }

    .resource-list {
        list-style: none;
        padding: 0;
        margin: 20px 0;
        font-family: var(--font-lexend);
    }

    .resource-list li {
        margin-bottom: 15px;
    }

    .resource-item {
        text-decoration: none;
        display: flex;
        align-items: center;
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        transition: all 0.3s ease;
        font-size: 1rem;
        font-weight: 500;
    }

    .resource-item:hover {
        background-color: #f4f4f9;
        border-color: #007BFF;
        color: #007BFF;
        cursor: pointer;
    }

    .resource-item.pdf::before {
        content: '📄';
        margin-right: 10px;
        font-size: 1.2rem;
        color: #E74C3C;
    }

    .resource-item.word::before {
        content: '📝';
        margin-right: 10px;
        font-size: 1.2rem;
        color: #3498DB;
    }

    .resource-item.excel::before {
        content: '📊';
        margin-right: 10px;
        font-size: 1.2rem;
        color: #27AE60;
    }

    .resource-item.ppt::before {
        content: '📈';
        margin-right: 10px;
        font-size: 1.2rem;
        color: #E67E22;
    }

    .description-content-subjects-test {
        height: inherit;
        background-color: #f0f4ff;
        flex-grow: 1;
    }

    
`;
