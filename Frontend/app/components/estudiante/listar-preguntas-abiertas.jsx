"use client"; import {  useEffect, useState, styled, apiRest, GenerarPreguntasAbiertas, Spinner, toast} from '@/app/components/utils/rutas';

export default function ListarPreguntasAbiertas({ idEvaluacion, idUnidad, typeId, notaEvaluacion, id_estudiante=null, isProfesor = false }) {

	const [showSpinner, setShowSpinner] = useState(false);
	const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);

	const [preguntas, setpreguntas] = useState([])
	const [respuestasPrevias, setrespuestasPrevias] = useState([])

	useEffect(() => {
		obtener_preguntas_abiertas();
	}, [])
	  
	const obtener_preguntas_abiertas = async () => {
		
		let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);

			const url = `http://localhost:3333/ovacademy/evaluaciones/preguntasAbiertas/${idEvaluacion}`
            const response = await apiRest.fetchGet(url);

            if (response.status === 200) {

				setpreguntas(response.data.data)
				const ids = response.data.data.map(p => p.id).join(',');
				obtener_respuestas_preguntas(ids);

            } else {
                console.error('La respuesta de la API no contiene datos válidos.');
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
        
		} finally { clearTimeout(timeout); setShowSpinner(false);}

	}

	const obtener_respuestas_preguntas = async (ids) => {

		let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
			
			const url = `http://localhost:3333/ovacademy/evaluaciones/RespuestaPreguntasAbiertas/${ids}`;
			const response = await apiRest.fetchGet(url, { id_estudiante: id_estudiante });
			if (response.status === 200) {
				console.log(response.data.data)
				setrespuestasPrevias(response.data.data)

			} else if (response.status != 404) {
				setrespuestasPrevias([])
            	console.error('La respuesta de la API no contiene datos válidos.');
            }
		} catch (err) {
			console.error('Error al conectar con el servidor:', err);
		}finally { clearTimeout(timeout); setShowSpinner(false); setIsLoadingRespuestas(false);}
	};

	let contenido;

    if (showSpinner || isLoadingRespuestas) {
        contenido = <Spinner show={showSpinner} />;
    } else {
        contenido = (
            <GenerarPreguntasAbiertas
                idEvaluacion={idEvaluacion}
                id_estudiante={id_estudiante}
                preguntas={preguntas}
                respuestasPrevias={respuestasPrevias}
                notaEvaluacion={notaEvaluacion}
                isProfesor={isProfesor}
            />
        );
    }

    return <Component>{contenido}</Component>;
	  
	  
	  
}

const Component = styled.div`

	
`;