"use client"; 

import { styled, apiRest, useState, useEffect, toast} from '@/app/components/utils/rutas';

export default function ComponenteTest({id_unidad, type_id, nota_evaluacion, TabClick}) {
	const [preguntas, setPreguntas] = useState(['']);

	const crear_preguntas_abiertas = async () => {

        try {
			const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones`
			const response = await apiRest.fetchPost(url,
				{ id_unidad, type_id, nota_evaluacion, preguntas: preguntas }
			);

			if (response.status === 200) {
				toast.success(response.data.message);
				TabClick(1);
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.error(error);
		}
        
	};

	const agregarPregunta = () => {
		setPreguntas([...preguntas, '']);
	};

	const actualizarPregunta = (index, valor) => {
		const nuevasPreguntas = [...preguntas];
		nuevasPreguntas[index] = valor;
		setPreguntas(nuevasPreguntas);
	};

	const eliminarPregunta = (index) => {
		const nuevasPreguntas = preguntas.filter((_, i) => i !== index);
		setPreguntas(nuevasPreguntas);
	};

	return (
		<Contenedor>
			<Titulo>Módulo de Preguntas Abiertas</Titulo>
			{Array.isArray(preguntas) && preguntas.map((pregunta, index) => (
				<PreguntaWrapper key={index}>
					<PreguntaInput
						value={pregunta}
						onChange={(e) => actualizarPregunta(index, e.target.value)}
						placeholder={`Pregunta ${index + 1}`}
					/>
					<BotonEliminar onClick={() => eliminarPregunta(index)}>✕</BotonEliminar>
				</PreguntaWrapper>
			))}
			<Controles>
				<BotonAgregar onClick={agregarPregunta}>+ Agregar pregunta</BotonAgregar>
				<BotonGuardar onClick={crear_preguntas_abiertas}>💾 Guardar</BotonGuardar>
			</Controles>
		</Contenedor>
	);
}

const Contenedor = styled.div`
	padding: 2rem;
	background: #ffffff;
	border-radius: 1.5rem;
	max-width: 700px;
	margin: 2rem auto;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
	font-family: 'Segoe UI', sans-serif;
`;

const Titulo = styled.h2`
	font-size: 1.75rem;
	font-weight: 600;
	color: #333;
	margin-bottom: 1rem;
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
	background: #ff4d4f;
	color: white;
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

const Controles = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 1rem;
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


	