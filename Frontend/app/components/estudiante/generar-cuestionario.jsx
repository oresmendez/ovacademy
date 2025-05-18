"use client"; import {  useEffect, useState, styled, apiRest, toast } from '@/app/components/utils/rutas';

export default function Cuestionario({ preguntas, notaEvaluacion, idEvaluacion }) {
	
	const [estudiante_ya_respondio, setestudiante_ya_respondio] = useState(false)
	
	const [respuestas, setRespuestas] = useState({});
	const [enviado, setEnviado] = useState(false);
	const [aciertos, setAciertos] = useState(0);


	const guardar_cuestionario = async (id, respuestaUsuario) => {
		
		try {
			const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/SaveCuestionario`
			const response = await apiRest.fetchPost(url, {
				cuestionario_id: id,
				respuesta: respuestaUsuario,
			});
	
			return response.status === 200;
		} catch (error) {
			console.error(error);
			return false;
		}
	};

	const enviarNotaEvaluacion = async (notaEvaluacionCalculada, idEvaluacion) => {
		try {
			const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/SaveNotaEstudiante`
			const response = await apiRest.fetchPost(url, {
				nota_evaluacion: notaEvaluacionCalculada.toFixed(2),
				evaluacion_id: idEvaluacion
			});

			if (response.status === 201) {
				toast.success("¡Nota enviada correctamente!");
			} else {
				toast.error("Hubo un problema al enviar la nota.");
			}
		} catch (error) {
			console.error(error);
			toast.error("Error al enviar la nota.");
		}
	};

	
	const handleChange = (preguntaId, opcion) => {
		setRespuestas({
		...respuestas,
		[preguntaId]: opcion,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
	  
		const preguntasSinResponder = preguntas.filter(
		  	(pregunta) => !respuestas.hasOwnProperty(pregunta.id)
		);
	  
		if (preguntasSinResponder.length > 0) {
			toast.error("Por favor, responde todas las preguntas antes de enviar el cuestionario.");
		  return;
		}
	  
		let correctas = 0;
	  
		const resultados = preguntas.map((pregunta) => {
			const respuestaUsuario = respuestas[pregunta.id];
			const esCorrecta = respuestaUsuario === pregunta.respuestaCorrecta;
		
			if (esCorrecta) correctas++;
		
			return {
				id: pregunta.id,
				pregunta: pregunta.pregunta,
				respuestaUsuario,
				respuestaCorrecta: pregunta.respuestaCorrecta,
				esCorrecta,
			};
		});
		
		let errores = 0;
		for (const resultado of resultados) {
			const exito = await guardar_cuestionario(resultado.id, resultado.respuestaUsuario);
			if (!exito) errores++;
		}

		if (errores === 0) {
			toast.success("¡Cuestionario guardado correctamente!");
		} else {
			toast.error("Algunas respuestas no se pudieron guardar.");
		}
	  
		setAciertos(correctas);
		setEnviado(true);
		setestudiante_ya_respondio(true);

		const notaCalculada = Math.ceil(((correctas / preguntas.length) * notaEvaluacion) * 100) / 100;
		await enviarNotaEvaluacion(notaCalculada, idEvaluacion);

	  };
	  
	  

	  return (
		<LayoutBody>
	  
		  {!estudiante_ya_respondio ? (
			<form onSubmit={handleSubmit} className="formulario">
				{preguntas.map((pregunta) => (
					<div key={pregunta.id} className="card">
					<p className="pregunta">{pregunta.pregunta}</p>
					{pregunta.opciones.map((opcion, index) => (
						<label key={index} className="opcion">
						<input
							type="radio"
							name={`pregunta-${pregunta.id}`}
							value={opcion}
							onChange={() => handleChange(pregunta.id, opcion)}
							checked={respuestas[pregunta.id] === opcion}
						/>
						{' '}{opcion}
						</label>
					))}
					</div>
			  ))}
			  <div className='center'>
			  	<button type="submit" className="boton">Guardar</button>
			  </div>
			</form>
		  ) : enviado && (
			<div className="resultado">
				<h2>Resultado</h2>
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
