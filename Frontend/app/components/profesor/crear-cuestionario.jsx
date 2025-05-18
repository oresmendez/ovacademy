"use client";
import { styled, apiRest, useState, useEffect, toast } from '@/app/components/utils/rutas';

export default function CrearCuestionario({ id_unidad, type_id, nota_evaluacion, TabClick, idEvaluacion = null, handleVolver}) {
    
    const [evaluacionData, setevaluacionData] = useState([]);
    const [preguntas, setPreguntas] = useState([]);

    useEffect(() => {
        
        if (idEvaluacion != null) {
            obtener_cuestionario();
        } else {
            setPreguntas([{ id: 1, texto: '', opciones: [''], respuestaCorrecta: null }]);
        }

    }, [idEvaluacion]);

    useEffect(() => {
        
            if (evaluacionData) {
                setPreguntas(transformarPreguntas(evaluacionData));
            }

    }, [evaluacionData]);
    
    const obtener_cuestionario = async () => {
		
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/cuestionario/${idEvaluacion}`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                setevaluacionData(response.data.data);
            } else {
                toast.error(response.data.message);
            } 
        } catch (error) {
            console.error(error);
        }
    };

    const editar_cuestionario = async () => {

        const todasConRespuesta = preguntas.every((pregunta) => {
            
            const preguntaValida = pregunta.texto && pregunta.texto.trim() !== '';
            const opcionesValidas = pregunta.opciones && pregunta.opciones.length > 1;
            const respuestaCorrectaValida =
                pregunta.respuestaCorrecta !== null &&
                pregunta.opciones[pregunta.respuestaCorrecta]?.trim() !== '';
    
            return preguntaValida && opcionesValidas && respuestaCorrectaValida;
        });
    
        if (!todasConRespuesta) {
            toast.error("Por favor, asegúrate de que todas las preguntas tengan texto, más de una opción y una respuesta correcta seleccionada.");
            return;
        }

        const cuestionarioFinal = preguntas.map((pregunta) => ({
            id:pregunta.id,
            pregunta: pregunta.texto,
            opciones: pregunta.opciones,
            respuesta: pregunta.opciones[pregunta.respuestaCorrecta],
        }));

        console.log('Cuestionario guardado:', cuestionarioFinal);
		
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/cuestionario`
			const response = await apiRest.fetchPut(
				url,
				{ evaluacion_id: idEvaluacion,  cuestionario: cuestionarioFinal }
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

    const transformarPreguntas = (data) => {
        return data.map((item, index) => {
            const respuestaIndex = item.opciones.findIndex(op => op === item.respuestaCorrecta);
            return {
                id: item.id,
                texto: item.pregunta,
                opciones: item.opciones,
                respuestaCorrecta: respuestaIndex !== -1 ? respuestaIndex : null,
            };
        });
    };

    const agregarPregunta = () => {
        
        setPreguntas([
            ...preguntas,
            {
                id: 0,
                texto: '',
                opciones: [''],
                respuestaCorrecta: null,
            },
        ]);
    };

    const actualizarTextoPregunta = (index, texto) => {
        const copia = [...preguntas];
        copia[index].texto = texto;
        setPreguntas(copia);
    };

    const agregarOpcion = (preguntaIndex) => {
        const copia = [...preguntas];
        copia[preguntaIndex].opciones.push('');
        setPreguntas(copia);
    };

    const actualizarOpcion = (preguntaIndex, opcionIndex, texto) => {
        const copia = [...preguntas];
        copia[preguntaIndex].opciones[opcionIndex] = texto;
        setPreguntas(copia);
    };

    const seleccionarRespuesta = (preguntaIndex, opcionIndex) => {
        const copia = [...preguntas];
        copia[preguntaIndex].respuestaCorrecta = opcionIndex;
        setPreguntas(copia);
    };

    const crear_cuestionario = async () => {

        if (preguntas.length === 0) {
            toast.error("Por favor, agrega al menos una pregunta al cuestionario.");
            return;
        }

        const todasConRespuesta = preguntas.every((pregunta) => {
            
            const preguntaValida = pregunta.texto && pregunta.texto.trim() !== '';
            const opcionesValidas = pregunta.opciones && pregunta.opciones.length > 1;
            const respuestaCorrectaValida =
                pregunta.respuestaCorrecta !== null &&
                pregunta.opciones[pregunta.respuestaCorrecta]?.trim() !== '';
    
            return preguntaValida && opcionesValidas && respuestaCorrectaValida;
        });
    
        if (!todasConRespuesta) {
            toast.error("Por favor, asegúrate de que todas las preguntas tengan texto, más de una opción y una respuesta correcta seleccionada.");
            return;
        }

        const cuestionarioFinal = preguntas.map((pregunta) => ({
            pregunta: pregunta.texto,
            opciones: pregunta.opciones,
            respuesta: pregunta.opciones[pregunta.respuestaCorrecta],
        }));

        console.log('Cuestionario guardado:', cuestionarioFinal);

        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones`
            const response = await apiRest.fetchPost(
                url,
                { id_unidad, type_id, nota_evaluacion, cuestionario: cuestionarioFinal }
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

    return (
        <Contenedor>
            <div className='mt-20'></div>
            {preguntas.map((pregunta, i) => (
                <div key={pregunta.id} className="pregunta-card">
                    <label>
                        Pregunta {i + 1}:
                        <input
                            type="text"
                            value={pregunta.texto}
                            onChange={(e) => actualizarTextoPregunta(i, e.target.value)}
                            placeholder="Escribe la pregunta..."
                        />
                    </label>
                    <div className="opciones">
                        {pregunta.opciones.map((opcion, j) => {
                            const esCorrecta = pregunta.respuestaCorrecta === j;
                            return (
                                <div
                                    key={j}
                                    className={`opcion ${esCorrecta ? 'correcta' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name={`respuesta-${i}`}
                                        checked={esCorrecta}
                                        onChange={() => seleccionarRespuesta(i, j)}
                                    />
                                    <input
                                        type="text"
                                        value={opcion}
                                        onChange={(e) => actualizarOpcion(i, j, e.target.value)}
                                        placeholder={`Opción ${j + 1}`}
                                    />
                                    {esCorrecta && <span className="etiqueta">✓ Respuesta correcta</span>}
                                </div>
                            );
                        })}
                    </div>

                    <button type="button" className="btn-opcion" onClick={() => agregarOpcion(i)}>
                        + Añadir opción
                    </button>
                </div>
            ))}

            <div className="acciones">
                <button type="button" onClick={agregarPregunta}>+ Añadir pregunta</button>
                {
                    idEvaluacion ?(
                        <button type="button" onClick={editar_cuestionario}>Guardar cuestionario</button>
                    ) :(
                        <button type="button" onClick={crear_cuestionario}>Guardar cuestionario</button>
                    )
                }
                
            </div>
        </Contenedor>
    );
}

const Contenedor = styled.div`
    .pregunta-card {
        border: 1px solid #ccc;
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 2rem;
        background: #f9f9f9;
    }

    label {
        display: block;
        margin-bottom: 10px;
    }

    input[type="text"] {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 6px;
    }

    .opciones {
        margin-left: 20px;
    }

    .opcion {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        padding: 8px;
        border-radius: 6px;
        transition: background-color 0.2s ease;
    }

    .opcion.correcta {
        border: 1px solid #e0e0e0;
        background-color: #e6f7e6;
        border-color: #42b72a;
    }

    .etiqueta {
        font-size: 0.85rem;
        color: #42b72a;
        font-weight: bold;
    }

    .btn-opcion {
        background: none;
        border: none;
        color: #0070f3;
        font-weight: bold;
        cursor: pointer;
        padding: 0;
        margin-top: 0.5rem;
    }

    .acciones {
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
    }

    .acciones button {
        padding: 10px 20px;
        font-size: 1rem;
        background: #0070f3;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
    }
`;
