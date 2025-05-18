"use client"; import {  useEffect, useState, styled, apiRest, toast} from '@/app/components/utils/rutas';

export default function SopaInteractiva({ id_sopa, palabrasMeta, notaEvaluacion, idEvaluacion }) {

	const direcciones = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, -1], [1, -1], [-1, 0]]
	const [grid, setGrid] = useState([])
	const [inicio, setInicio] = useState(null)
	const [seleccionadas, setSeleccionadas] = useState([])
	const [palabrasEncontradas, setPalabrasEncontradas] = useState([])

	useEffect(() => {
		generarGrid();
	}, [palabrasMeta])


	function obtenerPalabraMasLarga() {

		let palabraMasLarga = '';
	
		for (const palabra of palabrasMeta) {
			if (palabra.length > palabraMasLarga.length) {
				palabraMasLarga = palabra;
			}
		}

		return palabraMasLarga.length
	}

	function generarGrid() {

		let tamaño = obtenerPalabraMasLarga();

		if (tamaño < 10) { tamaño = 10;} else {tamaño += 2;}

		const grid = Array.from({ length: tamaño }, () =>
			Array.from({ length: tamaño }, () => '')
		)

		palabrasMeta.forEach(palabra => {
			let colocada = false
			let intentos = 0

			while (!colocada && intentos < 100) {
				const direccion = direcciones[Math.floor(Math.random() * direcciones.length)]
				const dx = direccion[1]
				const dy = direccion[0]

				const maxFila = dy === -1 ? tamaño - 1 : tamaño - (dy * (palabra.length - 1)) - 1
				const maxCol = dx === -1 ? tamaño - 1 : tamaño - (dx * (palabra.length - 1)) - 1

				const fila = Math.floor(Math.random() * (maxFila + 1))
				const col = Math.floor(Math.random() * (maxCol + 1))

				let puedeColocar = true
				for (let i = 0; i < palabra.length; i++) {
					const f = fila + dy * i
					const c = col + dx * i
					if (f < 0 || f >= tamaño || c < 0 || c >= tamaño || (grid[f][c] !== '' && grid[f][c] !== palabra[i])) {
						puedeColocar = false
						break
					}
				}

				if (puedeColocar) {
					for (let i = 0; i < palabra.length; i++) {
						const f = fila + dy * i
						const c = col + dx * i
						grid[f][c] = palabra[i]
					}
					colocada = true
				}

				intentos++
			}
		})

		// Rellenar espacios vacíos con letras aleatorias
		const letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'
		for (let i = 0; i < tamaño; i++) {
			for (let j = 0; j < tamaño; j++) {
				if (grid[i][j] === '') {
					grid[i][j] = letras[Math.floor(Math.random() * letras.length)]
				}
			}
		}
		
		setGrid(grid);
	}

	const handleClick = (fila, col) => {
		if (!inicio) {
			setInicio({ fila, col })
			setSeleccionadas([{ fila, col }])
		} else {
			const fin = { fila, col }
			const camino = obtenerCamino(inicio, fin)

			if (!camino) {
				setInicio(null)
				setSeleccionadas([])
				return
			}

			const letras = camino.map(({ fila, col }) => grid[fila][col])
			const palabra = letras.join('')

			if (palabrasMeta.includes(palabra) && !palabrasEncontradas.includes(palabra)) {
				setPalabrasEncontradas([...palabrasEncontradas, palabra])
				setSeleccionadas([])
			} else {
				setSeleccionadas(camino)
				setTimeout(() => setSeleccionadas([]), 600)
			}

			setInicio(null)
		}
	}

	const resolver = () => {
		setPalabrasEncontradas([...palabrasMeta])
	}

	const obtenerCamino = (inicio, fin) => {
		const dx = fin.col - inicio.col
		const dy = fin.fila - inicio.fila

		const pasos = Math.max(Math.abs(dx), Math.abs(dy))
		const dirX = dx === 0 ? 0 : dx / Math.abs(dx)
		const dirY = dy === 0 ? 0 : dy / Math.abs(dy)

		if (!(
			(dirX === 0 || dirY === 0 || Math.abs(dx) === Math.abs(dy)) && pasos > 0
		)) return null

		const camino = []
		for (let i = 0; i <= pasos; i++) {
			const fila = inicio.fila + dirY * i
			const col = inicio.col + dirX * i
			if (!grid[fila] || grid[fila][col] === undefined) return null
			camino.push({ fila, col })
		}

		return camino
	}

	const estaSeleccionada = (fila, col) =>
		seleccionadas.some(c => c.fila === fila && c.col === col)

	const estaEncontrada = (fila, col) => {
		return palabrasEncontradas.some(palabra => {
			const coords = encontrarCoordenadasDePalabra(palabra)
			return coords?.some(c => c.fila === fila && c.col === col)
		})
	}

	const encontrarCoordenadasDePalabra = (palabra) => {
		
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

	const guardar_sopadeletras = async () => {

		if (palabrasEncontradas.length !== palabrasMeta.length) {
			toast.error("Debes encontrar todas las palabras antes de guardar.");
			return;
		}
	
		try {
			const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/SaveSopaDeLetras`
			const response = await apiRest.fetchPost( url,
				{ sopa_id: id_sopa , matrix: grid }
			);
	
			if (response.status === 200) {
				toast.success(response.data.message);
				await enviarNotaEvaluacion(notaEvaluacion, idEvaluacion);
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.error(error);
		}
	};
	
	const enviarNotaEvaluacion = async (notaEvaluacionCalculada, idEvaluacion) => {
		try {
			const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/SaveNotaEstudiante`
			const response = await apiRest.fetchPost(url, {
				nota_evaluacion: parseFloat(notaEvaluacionCalculada).toFixed(2),
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
	

	return (
		<Component>
			<div className='container mt-30'>
				<h2>Sopa de Letras</h2>
				{grid.length > 0 && (
					<div className="grid mt-20">
						{grid.map((fila, i) => (
						<div key={i} className="row">
							{fila.map((letra, j) => {
							const isSel = estaSeleccionada(i, j)
							const isFound = estaEncontrada(i, j)
							return (
								<div
								key={j}
								className={`cell ${isSel ? 'selected' : ''} ${isFound ? 'found' : ''}`}
								onClick={() => handleClick(i, j)}
								>
								{letra}
								</div>
							)
							})}
						</div>
						))}
					</div>
				)}

				<div className="palabras">
					<h3 className='mb-20 mt-20'>Palabras a buscar:</h3>
					<ul>
					{palabrasMeta.map((p, i) => (
						<li key={i} className={palabrasEncontradas.includes(p) ? 'ok' : ''}>
						{palabrasEncontradas.includes(p) ? '✔️ ' : '⬜ '} {p}
						</li>
					))}
					</ul>
					<div className='center'>
						<div className='mt-20 mr-10'>
							<button onClick={resolver} className="resolver">Resolver</button>
						</div>
						<div className='mt-20'>
							<button onClick={guardar_sopadeletras} className="resolver">Guardar</button>
						</div>
					</div>
				</div>
			</div>
		</Component>
	);
}

const Component = styled.div``;