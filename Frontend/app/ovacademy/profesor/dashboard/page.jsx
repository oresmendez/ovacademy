'use client'; import { useState, useEffect, styled, useRouter, BannerMateria, textBarHeader, Footer, Spinner } from '@/app/components/utils/rutas';

export default function DashboardPage() {

    const [isClient, setIsClient] = useState(false);
    const { setHeaderText } = textBarHeader();

    const router = useRouter();

    useEffect(() => {
        setHeaderText((<> Inicio</>));
        const timeout = setTimeout(() => {
            setIsClient(true);
        }, 500);
        return () => clearTimeout(timeout);
    }, []);

    const handleClick = (ruta) => {
        setIsClient(false); 
        router.push(ruta);
    };

    if (!isClient) {
        return <Spinner show={true} />;
    }

    return (
        <Componente>
            <div className="dashboard-wrapper">
                <div className='layout-body'>
                    <div className='container-body'>
                        <BannerMateria />
                        <div className='center mt-20'>
                            {secciones.map(({ nombre, ruta }) => (
                                <div key={nombre} className='container-element m-10 center-column'>
                                    <span className='container-element-tittle mt-10'>{nombre}</span>
                                    <button
                                        onClick={() => handleClick(ruta)}
                                        className="button"
                                    >
                                        Entrar
                                    </button>
                                </div>
                            ))}
                        </div>                   
                    </div>
                </div>
            </div>
            <Footer />
        </Componente>
    );
}

const secciones = [
    { nombre: 'Estudiantes', ruta: '/ovacademy/profesor/estudiantes' },
    { nombre: 'Unidades', ruta: '/ovacademy/profesor/unidades' },
    { nombre: 'Contenidos', ruta: '/ovacademy/profesor/contenidos' },
    { nombre: 'Evaluaciones', ruta: '/ovacademy/profesor/evaluaciones' },
];

const Componente = styled.div`

    .icon {
        font-size: 1.5rem;
        cursor: pointer;
        transition: opacity 0.2s, transform 0.2s;
        opacity: 0;
        position: absolute;
        right: -2rem;
        top: 0;
        margin-top: 0.6rem;
    }

    .text-container:hover .icon {
        opacity: 1; /* Visible en hover */
    }

    .editable-input{
        padding: 0.3rem;
        border-radius: 0.3rem;
        border: none;
        max-width: 63rem;
        min-width: 38rem;
        background: rgba(255, 255, 255, 0.509); /* Semi-transparente */
        color: black;
        font-family: var(--font-lexend);
    }

    .editable-input-tittle {
        font-size: 1.8rem;
        
        width: auto;
        
    }

    .editable-input-descripcion{
        font-size: 1.2rem;
        width: 60rem;
    }

    .save-icon {
        color: #ffffffa5;
        cursor: pointer;
        font-size: 1.5rem;
        transition: transform 0.2s;
    }

    .save-icon:hover {
        transform: scale(1.1);
    }

    .cancel-icon {
        color: #ffffffa5;
        cursor: pointer;
        font-size: 1.5rem;
        transition: transform 0.2s;
    }

    .cancel-icon:hover {
        transform: scale(1.1);
    }

    .banner-dashboard-description {
        font-size: 1.2rem;
        font-weight: 300;
        margin-top: 0.5rem;
        line-height: 1.5;
    }

    .container-element{
        background-color:#c7ddec;
        border-radius: 0.3rem;
        font-family: var(--font-lexend);
        font-size: 1.5rem;
        cursor: pointer;
        overflow: hidden;
        height: auto;
        width: 100%
    }

    .container-element-tittle{

    }

    .container-element .button{
        color: white;
        background-color:#0c2944;
        border-radius: 0.3rem;
        padding: 0.2rem 1rem;
        margin: 2rem 0;
    }

    
`;
