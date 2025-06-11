'use client'; import { useState, useEffect, useParams, styled, apiRest, Link, textBarHeader, BannerMateria, ButtonAccion, EditorContent, Crucigrama, Footer, TrueFalseQuiz } from '@/app/components/utils/rutas';

export default function () {
    const params = useParams();
    const { idUnidad, idContenido } = params;

    const [nameUnidad, setNameUnidad] = useState('');
    const [nameContenido, setNameContenido] = useState('');
    const [descripcion, setDescripcion] = useState('');
 
    const [activeTab, setActiveTab] = useState(0);

    const { setHeaderText } = textBarHeader();

    useEffect(() => {
        obtenerUnidad();
        obtenerContenidoDetails();
    }, []);

    useEffect(() => {
        if (nameContenido) {
            setHeaderText(
                <>
                    <Link href={`/ovacademy/estudiante/dashboard`}>Inicio</Link>
                    <span className="separator">&gt;</span>
                    <Link href={`/ovacademy/estudiante/unidad/${idUnidad}`}>{nameUnidad}</Link>
                    <span className="separator">&gt;</span>
                    {nameContenido}
                </>
            );
        }
    }, [nameContenido]);

    const obtenerUnidad = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades/${idUnidad}`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                setNameUnidad(`${response.data.data.modulo} - ${response.data.data.nombre}`);
            }

        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
        }
    };

    const obtenerContenidoDetails = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/contenido/contenidoDetalles/${idContenido}`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                setNameContenido(response.data.nombre);
                setDescripcion(response.data.descripcion);
            }

        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
        }
    };

    const TabClick = (index) => {
        setActiveTab(index);
    };

    const borrar = () => {
        obtenerUnidad();
        obtenerContenidoDetails();
    };

    return (
        <Componente>
            <div className='layout-body'>
                <div className='container-body'>
                    <BannerMateria />
                    <ButtonAccion onClick={() => borrar()}>Borrar reload</ButtonAccion>
                    <div className='description-content-subjects-list mt-30'>
                        <div className='course-content'>
                            <div className='tab'>
                                <button
                                    className={`tab-button ${activeTab === 0 ? 'active' : ''}`}
                                    onClick={() => TabClick(0)}
                                >
                                    Contenido
                                </button>
                            </div>
                            <div className='tab-content'>
                                {activeTab === 0 && (
                                    <div className='tab-panel active'>
                                        <div className='descripcion-contenido' dangerouslySetInnerHTML={{ __html: descripcion }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                        
                    

                    
                </div>
            </div>
            <Footer />
        </Componente>
    );
}

const Componente = styled.div`

    .descripcion-contenido {
        font-family: var(--font-lexend);
        font-size: 1rem; /* puedes ajustar el tamaño si deseas */
        color: #333; /* opcional, para mejorar contraste */
        word-wrap: break-word;
        line-height: 1.6;
    }

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

    .description-content-subjects-list {
        height: inherit;
        
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
        border-bottom: 2px solid #0465ac;
        font-weight: bold;
    }

    .tab-content {
        padding: 20px;
        min-height: 300px;

        max-height: auto; /* ajusta según tus necesidades */
        overflow-y: auto; /* agrega scroll si el contenido es muy largo */
        word-wrap: break-word; /* asegura que las palabras largas no rompan el layout */
    }


    .tab-panel {
        display: none;
    }

    .tab-panel.active {
        display: block;
    }

    .tab-panel h3 {
        font-size: 1.5rem;
        color: #0465ac;
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
        border-color: #0465ac;
        color: #0465ac;
        cursor: pointer;
    }

    .resource-item.pdf::before {
        content: '📄';
        margin-right: 10px;
        font-size: 1.2rem;
        color: #0465ac;
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
        color: #0465ac;
    }

    .resource-item.ppt::before {
        content: '📈';
        margin-right: 10px;
        font-size: 1.2rem;
        color: #E67E22;
    }
    
`;