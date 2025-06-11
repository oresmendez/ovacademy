"use client"; 

import { styled, apiRest, useState, useEffect, toast, ButtonSave} from '@/app/components/utils/rutas';

export default function ComponenteTest({id_unidad, type_id, nota_evaluacion, TabClick, idEvaluacion = null,}) {
	
	const [preguntas, setPreguntas] = useState([{ id: null, pregunta: '' }]);
	const [preguntasOriginales, setPreguntasOriginales] = useState([]);


	useEffect(() => {
        
        if (idEvaluacion != null) {
            obtener_preguntasAbiertas();
        }

    }, [idEvaluacion]);

	const obtener_preguntasAbiertas = async () => {
		try {
			const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/preguntasAbiertas/${idEvaluacion}`;
			const response = await apiRest.fetchGet(url);

			if (response.status === 200 && Array.isArray(response.data.data)) {
				const preguntasObtenidas = response.data.data.map(p => ({
					id: p.id,
					pregunta: p.pregunta
				}));
				setPreguntas(preguntasObtenidas.length > 0 ? preguntasObtenidas : [{ id: null, pregunta: '' }]);
				setPreguntasOriginales(preguntasObtenidas); // <--- Guardamos originales
			} else {
				toast.error(response.data.message || 'Error al obtener preguntas.');
			}
		} catch (error) {
			console.error(error);
			toast.error('Error del servidor al obtener las preguntas.');
		}
	};




	const crear_preguntas_abiertas = async () => {
		console.log('Preguntas:', preguntas.map(p => p.pregunta));
		if (nota_evaluacion === null || nota_evaluacion === undefined || nota_evaluacion === '') {
            toast.error("Por favor, ingresa una nota para la evaluación.");
            return;
        }
		try {
			const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones`;
			const response = await apiRest.fetchPost(url, {
				id_unidad,
				type_id,
				nota_evaluacion,
				preguntas: preguntas.map(p => p.pregunta), // solo enviamos texto
			});

			if (response.status === 200) {
				toast.success(response.data.message);
				TabClick(1);
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.error(error);
			toast.error('Error al guardar las preguntas.');
		}
	};


	const agregarPregunta = () => {
		setPreguntas([...preguntas, { id: null, pregunta: '' }]);
	};


	const actualizarPregunta = (index, valor) => {
		const nuevasPreguntas = [...preguntas];
		nuevasPreguntas[index].pregunta = valor;
		setPreguntas(nuevasPreguntas);
	};


	const eliminarPregunta = (index) => {
		const nuevasPreguntas = preguntas.filter((_, i) => i !== index);
		setPreguntas(nuevasPreguntas);
	};

	const editar_preguntas = async () => {
		try {
			
			const idsActuales = preguntas.map(p => p.id).filter(id => id !== null);
			const preguntasEliminadas = preguntasOriginales
				.filter(p => !idsActuales.includes(p.id))
				.map(p => ({ ...p, eliminada: true }));
			const preguntasActivas = preguntas.map(p => ({
				...p,
				eliminada: false
			}));

			const payloadPreguntas = [...preguntasActivas, ...preguntasEliminadas];

			console.log('Payload preguntas:', payloadPreguntas);

			const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/preguntaAbiert`;
			const payload = {
				evaluacion_id: idEvaluacion,
				palabras: payloadPreguntas
			};

			const response = await apiRest.fetchPut(url, payload);
			console.log('Response:', response);

			if (response.status === 200) {
				toast.success(response.data.message || 'Preguntas guardadas correctamente.');
				
			} else {
				toast.error(response.data.message || 'Error al guardar preguntas.');
			}

		} catch (error) {
			console.error(error);
			toast.error('Error del servidor al guardar las preguntas.');
		}
	};



		return (
			<Contenedor>
				<h1 className="titulo">Preguntas Abiertas</h1>
				{Array.isArray(preguntas) && preguntas.map((item, index) => (
					<PreguntaWrapper key={index}>
						<PreguntaInput
							value={item.pregunta}
							onChange={(e) => actualizarPregunta(index, e.target.value)}
							placeholder={`Pregunta ${index + 1}`}
						/>
						<BotonEliminar onClick={() => eliminarPregunta(index)}>✕</BotonEliminar>
					</PreguntaWrapper>
				))}	
				<div className='center'>
					<ButtonSave onClick={() => agregarPregunta()} className="mr-20" bgColor="#33b0e4" hoverColor="#33b0e4">
						+ Añadir pregunta
					</ButtonSave>
					{
						idEvaluacion ?(
							<ButtonSave onClick={() => editar_preguntas()} className="" >
								Guardar
							</ButtonSave>
						) :(
							<ButtonSave onClick={() => crear_preguntas_abiertas()} className="" >
								Guardar
							</ButtonSave>
						)
					}
				</div>
			
			</Contenedor>
		);
	}

const Contenedor = styled.div`
	padding: 2rem;
	border-radius: 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;

	.titulo {
		font-size: 2.5rem;
		text-transform: uppercase;
		letter-spacing: 2px;
		text-align: center;
		color: #0f172a;
		margin: 36px 0px;
		overflow: hidden;
		white-space: nowrap;
		border-right: 3px solid #0f172a;
		width: 0;
		animation: typing 2s steps(20, end) forwards, hideCursor 0.1s 2s forwards;
	}

	@keyframes typing {
		from { width: 0 }
		to { width: 100% }
	}

	@keyframes hideCursor {
		to {
			border-right: none;
		}
	}
`;

const PreguntaWrapper = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 0.75rem;
`;

const PreguntaInput = styled.textarea`
	flex: 1;
	padding: 1rem;
	font-size: 1rem;
	border: 1px solid #e0e0e0;
	border-radius: 1rem;
	background: #f9f9f9;
	height: 100px;
	resize: none;
	transition: all 0.3s ease;

	&:focus {
		outline: none;
		border-color: #007bff;
		background: #fff;
		box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
	}
`;

const BotonEliminar = styled.button`
	margin-top: 2rem;
	background: #d4eb33;
	font-weight: 600;
	color: black;
	border: none;
	padding: 0.5rem 0.75rem;
	font-size: 1rem;
	border-radius: 0.5rem;
	cursor: pointer;
	transition: background 0.2s ease;
	height: 40px;

	&:hover {
		background: #d9363e;
	}
`;



const BotonBase = styled.button`
	padding: 0.75rem 1.5rem;
	font-size: 1rem;
	border: none;
	border-radius: 0.75rem;
	cursor: pointer;
	transition: all 0.3s ease;
	font-weight: 500;
	box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
`;

const BotonAgregar = styled(BotonBase)`
	background: #007bff;
	color: white;

	&:hover {
		background: #0056b3;
	}
`;

const BotonGuardar = styled(BotonBase)`
	background: #28a745;
	color: white;

	&:hover {
		background: #1e7e34;
	}
`;


	