"use client"; import { useState, useEffect, styled, apiRest, Spinner} from '@/app/components/utils/rutas';

export default function Banner_Materia() {

    const [showSpinner, setShowSpinner] = useState(false);
	const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);

    const [nombre, setNombre] = useState("");
	const [objetivo, setObjetivo] = useState("");

    useEffect(() => {
        obtener_materia();
    }, []);

    const obtener_materia = async () => {
		let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
			const response = await apiRest.fetchGet('http://localhost:3333/ovacademy/materia');
			setNombre(response.data.nombre);
			setObjetivo(response.data.objetivo);
		} catch (error) {
			console.error(error);
		}finally { clearTimeout(timeout); setShowSpinner(false);setIsLoadingRespuestas(false);}
	};
    
    let contenido;

    if (showSpinner || isLoadingRespuestas) {
        contenido = <Spinner show={showSpinner} />;
    } else {
        contenido = (
            <div className='banner-dashboard center'>
                <span className='banner-dashboard-text'>{nombre || 'Nombre de la Materia'}</span>
                <p className='banner-dashboard-description'>
                    {objetivo || 'Eslogan de la materia'}
                </p>
            </div>
        );
    }

    return <Component>{contenido}</Component>;
}

const Component = styled.div`

    .banner-dashboard {
        width: 100%;
        height: 10rem;
        background: linear-gradient(to right, #33b0e4, #0d213a);
        border-radius: 0.5rem;
        flex-direction: column;
        color: white;
        font-family: var(--font-lexend);
    }

    .banner-dashboard-text {
        font-weight: 600;
        font-size: 2rem; 
    }

    .banner-dashboard-text-tittle{
        justify-content: center
    }

`;