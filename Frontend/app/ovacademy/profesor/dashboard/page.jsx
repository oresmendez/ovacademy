'use client'; import { useEffect, styled, Link, BannerMateria, textBarHeader } from '@/app/components/utils/rutas';

export default function DashboardPage() {

    const { setHeaderText } = textBarHeader();

    useEffect(() => {
        setHeaderText((<> Dashboard</>));
    }, []);

    return (
        <Componente>
            <div className='layout-body'>
                <div className='container-body'>
                    <BannerMateria />
                    <div className='center mt-20'>
                        <div className='container-element m-10 center-column'>
                            <span className='container-element-tittle mt-10'>Estudiantes</span>
                            <Link href="/ovacademy/profesor/estudiantes" passHref className="button">
                                Entrar
                            </Link>
                        </div>
                        <div className='container-element m-10 center-column'>
                            <span className='container-element-tittle mt-10'>Unidades</span>
                            <Link href="/ovacademy/profesor/unidades" passHref className="button">
                                Entrar
                            </Link>
                        </div>
                        <div className='container-element m-10 center-column'>
                            <span className='container-element-tittle mt-10'>Contenidos</span>
                            <Link href="/ovacademy/profesor/contenidos" passHref className="button">
                                Entrar
                            </Link>
                        </div>
                        <div className='container-element m-10 center-column'>
                            <span className='container-element-tittle mt-10'>Evaluaciones</span>
                            <Link href="/ovacademy/profesor/evaluaciones" passHref className="button">
                                Entrar
                            </Link>
                        </div>
                    </div>                   
                </div>
            </div>
        </Componente>
    );
}

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
