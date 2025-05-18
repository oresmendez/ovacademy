"use client"; import { styled, apiRest, useState, toast } from '@/app/components/utils/rutas';

export default function CrearCuestionario({ id_unidad, type_id, nota_evaluacion, TabClick }) {

    const [preguntas, setPreguntas] = useState([
        { id: 1, texto: '', opciones: [''], respuestaCorrecta: null },
    ]);

    const agregarPregunta = () => {
        setPreguntas([
        ...preguntas,
        {
            id: preguntas.length + 1,
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

        const todasConRespuesta = preguntas.every(
            (pregunta) =>
                pregunta.respuestaCorrecta !== null &&
                pregunta.opciones[pregunta.respuestaCorrecta]?.trim() !== ''
        );
    
        if (!todasConRespuesta) {
            toast.error("Por favor, selecciona una respuesta correcta para cada pregunta.");
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
            <button type="button" onClick={crear_cuestionario}>Guardar cuestionario</button>
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
