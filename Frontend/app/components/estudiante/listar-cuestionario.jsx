"use client";
import { useEffect, useState, styled, apiRest, GenerarCuestionario, Spinner, toast } from '@/app/components/utils/rutas';

export default function Cuestionario({ idEvaluacion, notaEvaluacion, id_estudiante }) {
	
	const [showSpinner, setShowSpinner] = useState(false);
	const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);
	const [estudiante_ya_respondio, setestudiante_ya_respondio] = useState(false);
	
	const [preguntas, setPreguntas] = useState([]);
	const [respuestas, setRespuestas] = useState({});
	const [enviado, setEnviado] = useState(false);
	const [aciertos, setAciertos] = useState(0);

	useEffect(() => {
		obtenerCuestionario();
	}, []);

	const obtenerCuestionario = async () => {

		let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
			const url = `http://localhost:3333/ovacademy/evaluaciones/cuestionario/${idEvaluacion}`
			const response = await apiRest.fetchGet(url);
			if (response.status === 200) {
				
				setPreguntas(response.data.data);
				const ids = response.data.data.map(p => p.id).join(',');
				obtener_respuestas_cuestionarios(response.data.data, ids);

			} else {
				console.error('La respuesta de la API no contiene datos válidos.');
			}
		} catch (err) {
			console.error('Error al conectar con el servidor:', err);
		}finally { clearTimeout(timeout); setShowSpinner(false);}
	};

	const obtener_respuestas_cuestionarios = async (preguntasAPI, ids) => {

		let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
			
			const url = `http://localhost:3333/ovacademy/evaluaciones/RespuestaCuestionario/${ids}`;
			const response = await apiRest.fetchGet(url, { id_estudiante: id_estudiante });
			if (response.status === 200 && response.data.data.length > 0) {
				const respuestasGuardadas = {};
				let correctas = 0;

				response.data.data.forEach((resp) => {
					respuestasGuardadas[resp.cuestionarioId] = resp.respuesta;
					const pregunta = preguntasAPI.find(p => p.id === resp.cuestionarioId);
					if (pregunta && pregunta.respuestaCorrecta === resp.respuesta) {
						correctas++;
					}
				});

				setRespuestas(respuestasGuardadas);
				setAciertos(correctas);
				setEnviado(true);
				setestudiante_ya_respondio(true);
			} else if (response.status != 404) {
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
			<LayoutBody>
			<h1 className="titulo">Cuestionario</h1>

			{!estudiante_ya_respondio ? (
				<GenerarCuestionario preguntas={preguntas} notaEvaluacion={notaEvaluacion} idEvaluacion={idEvaluacion}/>
			) : enviado && (
				<div className="resultado">
					<h2>Resultado</h2>
					<p>Ya has respondido este cuestionario.</p>
					<p>Respuestas correctas: {aciertos} de {preguntas.length}</p>
					<ul>
						{preguntas.map((pregunta) => (
							<li key={pregunta.id}>
								<strong>{pregunta.pregunta}</strong><br />
								Tu respuesta:{' '}
								<span style={{ color: respuestas[pregunta.id] === pregunta.respuestaCorrecta ? 'green' : 'red' }}>
									{respuestas[pregunta.id] || 'No respondida'}
								</span><br />
								Respuesta correcta: {pregunta.respuestaCorrecta}
							</li>
						))}
					</ul>
				</div>
			)}
		</LayoutBody>
		);
	}

	return contenido;
}

const LayoutBody = styled.div`
  max-width: 110rem;
  margin: 40px auto;
  padding: 20px;
  font-family: var(--font-lexend);

  .titulo {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }

  .formulario {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 1.5rem;
  }

  .pregunta {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  .opcion {
    display: block;
    margin: 0.5rem 0;
    cursor: pointer;
  }

  .boton {
    margin-top: 2rem;
    align-self: flex-start;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background-color: #0070f3;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  .resultado {
    margin-top: 3rem;
    padding: 1.5rem;
    background-color: #eef1f5;
    border-radius: 12px;

    ul {
      margin-top: 1rem;
      padding-left: 1.5rem;
    }

    li {
      margin-bottom: 1rem;
    }
  }
`;
