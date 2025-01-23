'use client'; import { useState, useEffect, styled, apiRest, textBarHeader, gestorCookie, useRouter } from '@/app/utils/hooks';

import Carrousel_main from '@/app/components/carrousel-main';

export default function dashboard_page() {

    const [boxes, setBoxes] = useState([]);
    const [nameMateria, setNameMateria] = useState({});

    const { setHeaderText } = textBarHeader();
    
    const router = useRouter();
    const validateUser = async () => {
        await gestorCookie.validateTypeId(router, 1);
    };

    useEffect(() => {

        setHeaderText((<> Dashboard</>));
        // validateUser();

        const fetchData = async () => {
            try {

                const [responseNameMateria, responseBoxes] = await Promise.all([
                    apiRest.fetchPost('http://localhost:3333/ovacademy/subject/obtenerUnaMateria', { id: 1 }),
                    apiRest.fetchPost('http://localhost:3333/ovacademy/subject/unidades/obtenerTodasLasUnidades', { id: 1 })
                ]);

                setNameMateria(responseNameMateria.data);
                setBoxes(responseBoxes.data);

            } catch (err) {
                console.error('Error al conectar con el servidor:', err);
            }
        };
        fetchData();
    }, []);

    return (
        <Componente>
            <div className='layout-body'>
                <div className='container-body'>
                    <div className='banner-dashboard center'>
                        <span className='banner-dashboard-text'>{nameMateria?.nombre || 'Nombre de la materia'}</span>
                        <p className='banner-dashboard-description'>Con nuestras herramientas y recursos, estarás preparado para enfrentar cualquier reto tecnológico. Aprende, crece y destaca.</p>
                    </div>
                    <Carrousel_main boxes={boxes} tittle={"Unidades Disponibles"} description={"Explora la amplia variedad de materias disponibles diseñadas para enriquecer tus conocimientos y desarrollar tus habilidades en áreas clave"}/>
                </div>            
            </div>
        </Componente>
    );
}

const Componente = styled.div`

   .banner-dashboard {
        width: 100%;
        height: 10rem;
        background: linear-gradient(to right, #33b0e4, #0d213a);
        border-radius: 0.5rem;
        flex-direction: column;
        color: white;
        font-family: var(--font-lexend);
    }

    .banner-dashboard-text{
        
        font-weight: 600;
        font-size: 2rem;

    }

    .banner-dashboard-slogan {
        font-size: 1.5rem;
        font-weight: 100;
        margin: 5px 0;
    }

    .banner-dashboard-description {

        font-size: 1.2rem;
        font-weight: 300;
        margin-top: 0.5rem;
        line-height: 1.5;
    }

    




`;