'use client'; import { useState, useEffect, useParams, styled, apiRest, Link, textBarHeader, EditorContent, Crucigrama, Quiz, TrueFalseQuiz } from '@/app/components/utils/rutas';

export default function () {
    const params = useParams();
    const { unidad, contenido } = params;
 
    const [materia, setMateria] = useState({});
    const [unidades, setUnidades] = useState({});
    const [conteniido, setConteniido] = useState({});
    const [activeTab, setActiveTab] = useState(0);

    const { setHeaderText } = textBarHeader();

    useEffect(() => {
    
        setHeaderText(<>
            <Link href={`/ovacademy/dashboard`}>Dashboard</Link>{/*
            */}<span className="separator">&gt;</span>{/*
            */}<Link href={`/ovacademy/materias/${unidad}`}>unidades</Link>{/*
            */}<span className="separator">&gt;</span>{/*
            */}contenido
        </>);


        const fetchData = async () => {
            try {

                const Materia_ = await apiRest.fetchGet('http://localhost:3333/ovacademy/materia');
                setMateria(Materia_.data[0]);

                const Unidades_ = await apiRest.fetchGet(`http://localhost:3333/ovacademy/unidades/${unidad}`);
                setUnidades(Unidades_.data);

                const Contenido_ = await apiRest.fetchGet(`http://localhost:3333/ovacademy/contenido/${unidad}/${contenido}`);
                console.log(Contenido_.data)
                setConteniido(Contenido_.data);
                

            } catch (err) {
                console.error('Error al conectar con el servidor:', err);
            }
        };
        fetchData();
    }, []);

    const TabClick = (index) => {
        setActiveTab(index);
    };

    return (
        <Componente>
            <div className='layout-body'>
                <div className='container-body'>
                    
                    <div className='banner-subjects'>
                        <span className='banner-subjects-text ml-20'>{materia.nombre}</span>
                        <span className='banner-subjects-subtext ml-30 mt-05'>
                            {unidades?.nombre || 'Nombre de la unidad'} &gt; {conteniido?.nombre || 'Nombre del Contenido'}

                        </span>
                    </div>

                    <div className='description-subjects-general mt-10 p-10'>
                        <p>
                            {conteniido?.descripcion?.length > 0 
                                ? conteniido.descripcion|| "Sin descripción disponible." 
                                : "Sin descripción disponible."}
                        </p>
                    </div>

                    
                    <div className='description-content-subjects-list'>
                        <div className='course-content'>
                            <div className='tab'>
                                <button
                                    className={`tab-button ${activeTab === 0 ? 'active' : ''}`}
                                    onClick={() => TabClick(0)}
                                >
                                    Contenido
                                </button>
                                <button
                                    className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
                                    onClick={() => TabClick(1)}
                                >
                                    Material Multimedia
                                </button>
                                <button
                                    className={`tab-button ${activeTab === 2 ? 'active' : ''}`}
                                    onClick={() => TabClick(2)}
                                >
                                    Evaluación
                                </button>
                                <button
                                    className={`tab-button ${activeTab === 3 ? 'active' : ''}`}
                                    onClick={() => TabClick(3)}
                                >
                                    Bibliografia
                                </button>
                            </div>
                            <div className='tab-content'>
                                <div className={`tab-panel ${activeTab === 0 ? 'active' : ''}`}>
                                    <h3>Qué es un proyecto</h3>
                                    <p>Un proyecto es la búsqueda de una solución inteligente al planteamiento de un problema, la
                                        cual tiende a resolver una necesidad humana.
                                        En este sentido puede haber diferentes ideas, inversiones de monto distinto, tecnología y
                                        metodologías con diverso enfoque, pero todas ellas destinadas a satisfacer las necesidades del
                                        ser humano en todas sus facetas, como pueden ser: educación, alimentación, salud, ambiente,
                                        cultura, etcétera.
                                        El proyecto de inversión es un plan que, si se le asigna determinado monto
                                        de capital y se le proporcionan insumos de varios tipos, producirá un bien o un
                                        servicio, útil al ser humano o a la sociedad.
                                        La evaluación de un proyecto de inversión, cualquiera que éste sea, tiene por
                                        objeto conocer su rentabilidad económica y social, de tal manera que asegure resolver
                                        una necesidad humana en forma eficiente, segura y rentable. Sólo así es posible
                                        asignar los escasos recursos económicos a la mejor alternativa. (Baca, 2010)</p><br></br>

                                    <p>
                                    Un proyecto de inversión es una propuesta técnica y económica para resolver un
                                        problema de la sociedad utilizando los recursos humanos, materiales y tecnológicos
                                        disponibles, mediante un documento escrito que comprende una serie de
                                        estudios que permiten al inversionista saber si es viable su realización. (Córdoba, 2010)
                                    </p><br></br>
									{/* <EditorContent /> */}

                                    <h3>Por qué se invierte y por qué son necesarios los proyectos</h3>
                                    <p> Día a día y en cualquier sitio donde nos encontremos, siempre hay a la mano una serie de productos
                                        o servicios proporcionados por el hombre: desde la ropa que vestimos hasta los alimentos
                                        procesados que consumimos y las modernas computadoras que apoyan en gran medida el
                                        trabajo del ser humano. Todos y cada uno de estos bienes y servicios, antes de su venta comercial,
                                        fueron evaluados desde varios puntos de vista, siempre con el objetivo final de satisfacer
                                        una necesidad humana. Después de ello, alguien tomó la decisión de producirlo en masa, para
                                        lo cual tuvo que realizar una inversión económica.
                                        Por tanto, siempre que exista una necesidad humana de un bien o un servicio habrá necesidad
                                        de invertir, hacerlo es la única forma de producir dicho bien o servicio. Es claro que las inversiones
                                        no se hacen sólo porque alguien desea producir determinado artículo o piensa que al
                                        producirlo ganará dinero. En la actualidad una inversión inteligente requiere una base que
                                        la justifique. Dicha base es precisamente un proyecto estructurado y evaluado que indique la
                                        pauta a seguir. De ahí se deriva la necesidad de elaborar los proyectos. (Baca, 2010)</p>
									
                                </div>
                                <div className={`tab-panel ${activeTab === 1 ? 'active' : ''}`}>
                                    
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
                                    <h3>Evaluaciones</h3>
                                    {/* <Crucigrama /> */}
                                    {/* <Quiz /> */}
                                    <TrueFalseQuiz/>
                                </div>
                                <div className={`tab-panel ${activeTab === 3 ? 'active' : ''}`}>
                                    <h3>Bibliografia</h3>
                                    <p>Baca, Gabriel. (2010). Evaluación de proyectos, Sexta edición. Editorial The McGraw-Hill.</p>
                                    <p>Córdoba, Marcial. (2011). Formulación y Evaluacion de Proyectos, Segunda edición. Editorial Digiprint Editores E.U.</p>
                                </div>
                            </div>
                        </div>
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