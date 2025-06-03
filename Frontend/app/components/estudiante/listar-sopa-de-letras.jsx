"use client"; import {  useEffect, useState, styled, apiRest, GenerarSopaDeLetras, Spinner, toast} from '@/app/components/utils/rutas';

export default function ListarSopaDeletras({ idEvaluacion, idUnidad, typeId, notaEvaluacion, id_estudiante=null }) {

	const [showSpinner, setShowSpinner] = useState(false);
	const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);

	const [grid, setGrid] = useState([])
	const [id_sopa, setid_sopa] = useState('')
	const [palabrasMeta, setPalabrasMeta] = useState([])
	const [estudiante_ya_respondio, setestudiante_ya_respondio] = useState(false)
	const [palabrasEncontradas, setPalabrasEncontradas] = useState([])

	useEffect(() => {
		obtenerPalabrasSopadeLetras();
	}, [])

	useEffect(() => {
		if (grid.length > 0 && palabrasMeta.length > 0) {
			setPalabrasEncontradas([...palabrasMeta]);
			setestudiante_ya_respondio(true);
		}
	}, [grid, palabrasMeta]);
	  
	const obtenerPalabrasSopadeLetras = async () => {

		let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
			const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/SopaDeLetras/${idEvaluacion}`
            const response = await apiRest.fetchGet(url);

            if (response.status === 200) {
				const sopaId = response.data.data[0].id;
				setid_sopa(sopaId);
				let palabrasLimpias = response.data.data[0].palabras
					.replace(/{|}/g, '')
					.replace(/\"/g, '')
					.split(',');

				setPalabrasMeta(palabrasLimpias.map(p => p.toUpperCase()));
				obtener_Respuestas_SopadeLetras(sopaId);

            } else {
                console.error('La respuesta de la API no contiene datos válidos.');
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
        
		} finally { clearTimeout(timeout); setShowSpinner(false);}
	}

	const obtener_Respuestas_SopadeLetras = async (sopaId) => {
		let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
			const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/RespuestaSopaDeLetras/${sopaId}`
            const response = await apiRest.fetchGet(url, { id_estudiante: id_estudiante });
            if (response.status === 200) {
				setGrid(response.data.data[0].matrix)
			} else if (response.status != 404) {
            	console.error('La respuesta de la API no contiene datos válidos.');
            } 
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
        }finally { clearTimeout(timeout); setShowSpinner(false);setIsLoadingRespuestas(false);}
	}

	const estaSeleccionada = () => {};
	const estaEncontrada = (fila, col) => {
		return palabrasEncontradas.some(palabra => {
			const coords = encontrarCoordenadasDePalabra(palabra)
			return coords?.some(c => c.fila === fila && c.col === col)
		})
	}

	const encontrarCoordenadasDePalabra = (palabra) => {
		const direcciones = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, -1], [1, -1], [-1, 0]]

		for (let f = 0; f < grid.length; f++) {
			for (let c = 0; c < grid[0].length; c++) {
				for (let [dy, dx] of direcciones) {
					let coords = []

					for (let i = 0; i < palabra.length; i++) {
						const nf = f + dy * i
						const nc = c + dx * i
						if (!grid[nf] || grid[nf][nc] !== palabra[i]) break
						coords.push({ fila: nf, col: nc })
					}
					
					if (coords.length === palabra.length) return coords
				}
			}
		}
		return null
	}


	let contenido;

	if (showSpinner || isLoadingRespuestas) {
		contenido = <Spinner show={showSpinner} />;
	} else {
		contenido = estudiante_ya_respondio ? (
			<div className="container mt-30">
				<h1 className="titulo">Sopa de Letras</h1>
	
				{grid.length > 0 && (
					<div className="grid mt-20">
						{grid.map((fila, i) => (
							<div key={i} className="row">
								{fila.map((letra, j) => {
									const isSel = estaSeleccionada();
									const isFound = estaEncontrada(i, j);
									return (
										<div
											key={j}
											className={`cell ${isSel ? 'selected' : ''} ${isFound ? 'found' : ''}`}
										>
											{letra}
										</div>
									);
								})}
							</div>
						))}
					</div>
				)}
	
				<div className="palabras">
					<h3 className="mb-20 mt-20">Palabras a encontradas:</h3>
					<ul>
						{palabrasMeta.map((p, i) => (
							<li key={i} className={palabrasEncontradas.includes(p) ? 'ok' : ''}>
								{palabrasEncontradas.includes(p) ? '✔️ ' : '⬜ '} {p}
							</li>
						))}
					</ul>
					<div className="mt-20"></div>
				</div>
			</div>
		) : (
			<GenerarSopaDeLetras
				id_sopa={id_sopa}
				palabrasMeta={palabrasMeta}
				notaEvaluacion={notaEvaluacion}
				idEvaluacion={idEvaluacion}
			/>
		);
	}
	
	return <Component>{contenido}</Component>;
	
	  
}

const Component = styled.div`

.titulo {
		font-size: 2.5rem;
		text-transform: uppercase;
		letter-spacing: 2px;
		text-align: center;
		color: #0f172a;
		margin: 0px 0px 3rem 0px;
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

	.container {
		font-family: sans-serif;
		text-align: center;
		overflow-x: auto;
		font-family: var(--font-lexend);
	}
	.grid {
		display: inline-block;
		margin-bottom: 20px;
	}
	.row {
		display: flex;
	}
	.cell {
		width: 30px;
		height: 30px;
		margin: 1px;
		background: #f9f9f9;
		border: 1px solid #ddd;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		font-size: 16px;
		cursor: pointer;
		transition: background 0.2s;
	}
	.cell.selected {
		background-color: #ffe082;
	}
	.cell.found {
		background-color: #1565c0;
		color: white;
	}
	.palabras ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		justify-content: center;
	}
	.palabras li.ok {
		color: #024d73;
		font-weight: bold;
	}
	.resolver {
		margin-top: 10px;
		padding: 6px 12px;
		background-color: #1976d2;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	.resolver:hover {
		background-color: #1565c0;
	}
`;