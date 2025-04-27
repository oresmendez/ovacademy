"use client"; import { useState, useEffect, styled, apiRest, Spinner} from '@/app/components/utils/rutas';

export default function Banner_Materia() {

    const [showSpinner, setShowSpinner] = useState(false);
	const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);

    const [nombre, setNombre] = useState("");

    useEffect(() => {
        obtener_materia();
    }, []);

    const obtener_materia = async () => {
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const response = await apiRest.fetchGet('http://localhost:3333/ovacademy/materia');
            setNombre(response.data.nombre);
        } catch (error) {
            console.log(error);
            setNombre("Error al cargar la materia");
        }finally { clearTimeout(timeout); setShowSpinner(false);setIsLoadingRespuestas(false);}
    };

    let contenido;

    if (showSpinner || isLoadingRespuestas) {
        contenido = <Spinner show={showSpinner} />;
    } else {
        contenido = (
            <div className='banner-subjects'>
                <span className='banner-subjects-text ml-20'>{nombre || 'Nombre de la Materia'}</span>
                <span className='banner-subjects-subtext ml-30 mt-05'>
                    Nombre de la Unidad: Nombre del contenido programatico
                </span>
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


`;