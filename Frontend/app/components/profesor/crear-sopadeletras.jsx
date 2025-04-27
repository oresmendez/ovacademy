"use client"; 

import { styled, apiRest, useState, useEffect, toast} from '@/app/components/utils/rutas';

export default function crear_sopadeletras({id_unidad, type_id, nota_evaluacion, TabClick, idEvaluacion = null, handleVolver}) {

	const [palabras, setPalabras] = useState([]);
	const [nuevaPalabra, setNuevaPalabra] = useState('');
	const [error, setError] = useState('');

    useEffect(() => {
        if (idEvaluacion) {
            obtener_sopadeletras()
        }
    }, [idEvaluacion]);

    const obtener_sopadeletras = async () => {
		
        try {
            const url = `http://localhost:3333/ovacademy/evaluaciones/SopaDeLetras/${idEvaluacion}`
			const response = await apiRest.fetchGet(url);
			if (response.status === 200) {
				const palabrasData = response.data.data[0]?.palabras;
                    setPalabras(palabrasData.split(','));
			} else {
				toast.error(response.data.message);
			} 
		} catch (error) {
			console.error(error);
		}
        
	};

    const crear_sopadeletras = async () => {

		if (!palabras || palabras.length < 2) {
			toast.error("Por favor, agrega al menos dos palabras para crear la sopa de letras.");
			return;
		}
		
        try {
			const response = await apiRest.fetchPost(
				"http://localhost:3333/ovacademy/evaluaciones",
				{ id_unidad, type_id, nota_evaluacion, palabras: palabras.join() }
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

  const editar_sopadeletras = async () => {
		
        try {
			const response = await apiRest.fetchPut(
				"http://localhost:3333/ovacademy/evaluaciones/SopaDeLetras",
				{ evaluacion_id: idEvaluacion,  palabras: palabras.join() }
			);

			if (response.status === 200) {
				toast.success(response.data.message);
				handleVolver()
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.error(error);
		}
        
	};

	const agregarPalabra = () => {
        const palabraLimpia = nuevaPalabra.trim();
    
        if (palabraLimpia.length <= 1) {
            setError('La palabra debe tener más de 2 letras.');
            return;
        }
    
        if (palabraLimpia.includes(' ')) {
            setError('La palabra no debe contener espacios.');
            return;
        }
    
        setPalabras([...palabras, palabraLimpia]);
        setNuevaPalabra('');
        setError('');
    };
    
	const eliminarPalabra = (index) => {
		setPalabras(palabras.filter((_, i) => i !== index));
	};

    return (
        <Component>
        <h1 className="titulo">Lista de Palabras</h1>
        <div className="form-wrapper">
            <input
            type="text"
            value={nuevaPalabra}
            onChange={(e) => setNuevaPalabra(e.target.value)}
            className="input"
            placeholder="Agregar palabra"
            />
            <button onClick={agregarPalabra} className="boton">Agregar</button>
        </div>
        <ul className="lista">
            {palabras.map((palabra, index) => (
            <li key={index} className="item">
                {palabra}
                <button className="eliminar" onClick={() => eliminarPalabra(index)}>✖</button>
            </li>
            ))}
        </ul>
        
        {error && <div className="error">{error}</div>}
        <div className='center'>

            {
                idEvaluacion ?(
                    <button onClick={editar_sopadeletras} className="guardar">Guardar</button>
                ) :(
                    <button onClick={crear_sopadeletras} className="guardar">Guardar</button>
                )
            }

            
        </div>
        </Component>
    );
}

const Component = styled.div`


	.titulo {
		font-size: 2rem;
		font-weight: 600;
		color: #1f2937;
		text-align: center;
		margin-bottom: 30px;
	}

	.lista {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 12px;
		margin-bottom: 25px;
		padding: 0;
		list-style: none;
	}

	.item {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 10px 14px;
		font-size: 14px;
		color: #374151;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 2px 5px rgba(0,0,0,0.05);
		transition: all 0.2s ease;
	}

	.item:hover {
		transform: scale(1.02);
		background: #f3f4f6;
	}

	.eliminar {
		background: transparent;
		border: none;
		color: #ef4444;
		font-size: 16px;
		cursor: pointer;
		transition: color 0.2s ease;
	}

	.eliminar:hover {
		color: #b91c1c;
	}

	.form-wrapper {
		display: flex;
		gap: 12px;
		margin-bottom: 16px;
		flex-wrap: wrap;
		max-width:700px;
	}

	.input {
		flex: 1;
		padding: 10px 14px;
		border-radius: 10px;
		border: 1px solid #d1d5db;
		font-size: 14px;
		background: white;
		transition: box-shadow 0.2s ease;
	}

	.input:focus {
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
		outline: none;
	}

	.boton {
		background-color: #3b82f6;
		color: white;
		padding: 10px 18px;
		border-radius: 10px;
		font-weight: 500;
		border: none;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.boton:hover {
		background-color: #2563eb;
	}

	.error {
		color: #dc2626;
		font-size: 14px;
		text-align: center;
		margin-bottom: 16px;
	}

	.guardar {
		margin-top: 20px;
		padding: 14px;
		font-size: 16px;
		background-color: #2563eb;
		color: white;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		font-weight: 600;
		transition: background-color 0.2s;
	}

	.guardar:hover {
		background-color: #059669;
	}
`;


