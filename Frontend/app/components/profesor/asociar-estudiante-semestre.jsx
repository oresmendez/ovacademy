'use client'; import { styled, useState, useEffect, apiRest, toast, Select, MessageError, Spinner } from '@/app/components/utils/rutas';

export default function SelectAulaEstudiantes() {

	const [aulaSeleccionada, setAulaSeleccionada] = useState(null);
	const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState([]);
	const [aulas, setAulas] = useState([]);
	const [estudiantes, setEstudiantes] = useState([]);

	const [showSpinner, setShowSpinner] = useState(false);
	const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);


	useEffect(() => {   
		obtenerAula();
	}, []);

  	const obtenerAula = async () => {
		let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
			const url = `${process.env.NEXT_PUBLIC_API_URL}/aula/profesor`
			const response = await apiRest.fetchGet(url);
			if (response.status === 200) {
				const aulasFormateadas = response.data.data.map((aulas) => ({
					value: aulas.id,
					label: aulas.nombreAula,
				}));
				setAulas(aulasFormateadas);
				obtenerEstudiantesInscritos();
			} else {
				console.error('La respuesta de la API no contiene datos válidos.');
			}
		} catch (err) {
			console.error('Error al conectar con el servidor:', err);
		}finally { clearTimeout(timeout); setShowSpinner(false);}
	};

	const obtenerEstudiantesInscritos = async () => {
		let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
			
			const url = `${process.env.NEXT_PUBLIC_API_URL}/aula/estudiantesInscritos`
			const response = await apiRest.fetchGet(url);
			if (response.status === 200) {
				obtenerEstudiantesNoInscritos(response.data.estudiantesInscritos)
			} else {
				console.error('La respuesta de la API no contiene datos válidos.');
			}
		} catch (err) {
			console.error('Error al conectar con el servidor:', err);
		}finally { clearTimeout(timeout); setShowSpinner(false);setIsLoadingRespuestas(false);}
	};

	const obtenerEstudiantesNoInscritos = async (estudiantesInscritos) => {
		let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);

			const url = `${process.env.NEXT_PUBLIC_API_URL}/user?type_id=1`
			const response = await apiRest.fetchGet(url);
	
			if (response.status === 200) {
				
				const idsInscritos = estudiantesInscritos.map(e => e.estudianteId);
				const estudiantesNoInscritos = response.data.data
					.filter(estudiante => !idsInscritos.includes(estudiante.id))
					.map((estudiante) => ({
						value: estudiante.id,
						label: (estudiante.name && estudiante.surname)
							? `${estudiante.name} ${estudiante.surname} - ${estudiante.email}`
							: `${estudiante.email}`
					}));
	
				setEstudiantes(estudiantesNoInscritos);
			}
		} catch (err) {
			console.error('Error al conectar con el servidor:', err);
		}finally { clearTimeout(timeout); setShowSpinner(false);}
	};
	

	function transformarDatos() {
		const semestreId = aulaSeleccionada.value.toString();
		
		return estudiantesSeleccionados.map(estudiante => ({
			semestre_profesor_aula_id: semestreId,
			estudiante_id: estudiante.value.toString()
		}));
	}
	

 	const guardarData = async () => {

		if (!aulaSeleccionada?.value) {
			toast.error("Debes seleccionar un aula antes de guardar.");
			return;
		}
	
		if (!estudiantesSeleccionados?.length) {
			toast.error("Debes seleccionar al menos un estudiante.");
			return;
		}

		const url = `${process.env.NEXT_PUBLIC_API_URL}/aula/asociarEstudiante`
		const response = await apiRest.fetchPost( url,
			transformarDatos()
		);

		if (response.status === 200) {
			toast.success(response.data.message);
			setAulaSeleccionada(null);  
			setEstudiantesSeleccionados([]);
			
			obtenerEstudiantesInscritos();
		} else {
			toast.error(response.data.message);
		}
    
  	};


	let contenido;

	if (showSpinner || isLoadingRespuestas) {
        contenido = <Spinner show={showSpinner} />;

    }else if (!aulas.length) {
		contenido = (
			<MessageError message={"No tienes una sección asignada por el momento."}/>
		);
	} else {
		contenido = (
			<Component>
				<div className="container">
					<div className="campo">
						<label className="label">Selecciona un Sección</label>
						<Select
							options={aulas}
							placeholder="Selecciona un sección..."
							value={aulaSeleccionada}
							onChange={setAulaSeleccionada}
							styles={customStyles}
							isClearable
						/>
					</div>

					<div className="campo">
						<label className="label">
							{estudiantesSeleccionados.length <= 1 ? 'Selecciona Estudiante' : 'Selecciona Estudiantes'}
						</label>
						<Select
							options={estudiantes}
							isMulti
							placeholder="Selecciona estudiantes..."
							value={estudiantesSeleccionados}
							onChange={setEstudiantesSeleccionados}
							styles={customStyles}
						/>
					</div>
					<div className='center pt-10'>
						<button className="boton" onClick={guardarData}>Guardar</button>
					</div>
				</div>
			</Component>
		);
	}

	return contenido;
  
}

const customStyles = {
	control: (styles) => ({
		...styles,
		backgroundColor: "white",
		borderColor: "#ccc",
		borderRadius: "4px",
		padding: "5px",
		fontSize: "16px",
	}),
	option: (styles, { isFocused, isSelected }) => ({
		...styles,
		backgroundColor: isSelected ? "#0465ac" : isFocused ? "#e0e0e0" : "white",
		color: isSelected ? "white" : "#333",
	}),
	multiValue: (styles) => ({
		...styles,
		backgroundColor: "#0465ac",
		color: "white",
	}),
	multiValueLabel: (styles) => ({
		...styles,
		color: "white",
	}),
	multiValueRemove: (styles) => ({
		...styles,
		color: "white",
		":hover": { backgroundColor: "red", color: "white" },
	}),
};

const Component = styled.div`
	.container {	
		max-width: 70rem;
		margin: 20px auto;
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 8px;
		background-color: #f9f9f9;
		font-family: var(--font-lexend);
	}

	.campo {
		margin-bottom: 15px;
	}

	.label {
		display: block;
		font-weight: bold;
		margin-bottom: 5px;
	}

	.boton {
		width: 20%;
		padding: 10px;
		font-size: 16px;
		color: white;
		background-color: #0465ac;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		margin-top: 10px;
	}
`;

