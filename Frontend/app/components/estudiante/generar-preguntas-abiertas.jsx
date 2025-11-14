"use client";

import { useEffect, useState, styled, apiRest, toast, ButtonSave, gestorCookie } from '@/app/components/utils/rutas';

export default function FormularioRespuestas({ idEvaluacion, id_estudiante, preguntas, respuestasPrevias, notaEvaluacion, isProfesor }) {

    const [respuestas, setRespuestas] = useState({});
    const [respuestasExistentes, setRespuestasExistentes] = useState([]);
    const [error, setError] = useState(false);
    const [editarCalificaciones, seteditarCalificaciones] = useState(false);
    const [calificaciones, setCalificaciones] = useState({});
    const [califico, setcalifico] = useState(true);
    const [kcalifico, setkcalifico] = useState(true);
    const [mensajesCalificacion, setMensajesCalificacion] = useState({});
    const [tiposApreciacion, setTiposApreciacion] = useState([]);

    const [typeUser, setTypeUser] = useState(0);


    const todasRespondidas = preguntas.every((p) =>
        respuestasExistentes.some((r) => r.preguntasAbiertasId === p.id)
    );

    useEffect(() => {
        recargar();
    }, []);

    useEffect(() => {
        // Verifica si todas las preguntas están calificadas
        const hayAlgunaCalificada = preguntas.some((p) => {
            const r = respuestasExistentes.find(r => r.preguntasAbiertasId === p.id);
            return r && r.idEscalaApreciacion !== null;
        });
    
        setkcalifico(!hayAlgunaCalificada);
    }, [preguntas, respuestasExistentes]);
    

    const recargar = async () => {
        setTypeUser(await gestorCookie.get_one_element_cookie("user-data", "type"));
        obtener_type_escala_apreciacion();
    
        const respuestasIniciales = {};
        const calificacionesIniciales = {};
    
        respuestasPrevias.forEach((r) => {
            respuestasIniciales[r.preguntasAbiertasId] = r.respuesta;
            if (r.idEscalaApreciacion !== null) {
                calificacionesIniciales[r.preguntasAbiertasId] = r.idEscalaApreciacion;
            }
        });
        setRespuestas(respuestasIniciales);
        setRespuestasExistentes(respuestasPrevias);
        setCalificaciones(calificacionesIniciales);
    };
    

    const actualizarRespuesta = (id, valor) => {
        setRespuestas({
            ...respuestas,
            [id]: valor
        });
    };

    const actualizarCalificacion = (id, valor) => {
        setCalificaciones({
            ...calificaciones,
            [id]: valor
        });
    };

    const guardarRespuestas = async () => {
        const faltanRespuestas = preguntas.some((p) => {
            const yaRespondida = respuestasExistentes.some(r => r.preguntasAbiertasId === p.id);
            return !yaRespondida && (!respuestas[p.id] || respuestas[p.id].trim() === '');
        });

        if (faltanRespuestas) {
            setError(true);
            return;
        }

        setError(false);
        const respuestasFormateadas = preguntas
            .filter(p => !respuestasExistentes.some(r => r.preguntasAbiertasId === p.id))
            .map(p => ({
                preguntaId: p.id,
                respuesta: respuestas[p.id],
                calificacion: isProfesor ? calificaciones[p.id] || null : null
            }));

        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/SavePreguntasAbiertas`
            const response = await apiRest.fetchPost(url, { respuestas: respuestasFormateadas });
            
            if (response.status === 200) {
                toast.success(response.data.message);
                enviarNotaEvaluacion();
                recargar()
                window.history.go(-1);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Ocurrió un error al guardar las respuestas.");
        }
    };

    const enviarNotaEvaluacion = async () => {
        try {

            const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/SaveNotaEstudiante`
            const response = await apiRest.fetchPost(url, {
                nota_evaluacion: 0,
                evaluacion_id: idEvaluacion
            });

            if (response.status != 201) {
                toast.error("Hubo un problema al enviar la nota.");
            }

        } catch (error) {
            console.error(error);
            toast.error("Error al enviar la nota.");
        }
    };

    const obtener_type_escala_apreciacion = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/TypeEscalaApreciacion`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                setTiposApreciacion(response.data.data);
            } else {
                // console.error('La respuesta de la API no contiene datos válidos.');
                setTiposApreciacion([]);
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
            setTiposApreciacion([]);
        }
    };

    const calcularNotaGlobal = (calificaciones, notaGlobalMaxima) => {

        const totalPreguntas = calificaciones.length;
        const valorPorPregunta = notaGlobalMaxima / totalPreguntas;
    
        let notaFinal = 0;
    
        for (const item of calificaciones) {
            let puntaje = 0;
    
            switch (item.calificacion) {
                case 1: // buena
                    puntaje = valorPorPregunta;
                    break;
                case 2: // regular
                    puntaje = valorPorPregunta * 0.5;
                    break;
                case 3: // mala
                    break;
                default:
                    throw new Error('Calificación no válida: ' + item.calificacion);
            }
    
            notaFinal += puntaje;
        }
    
        return parseFloat(notaFinal.toFixed(2)); // Para dejarlo con 2 decimales
    }
    
    const editarCalificacion = async (datosParaEnviar) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/NotaEstudiante`
            const response = await apiRest.fetchPut(url, { 
                estudiante_id: id_estudiante,
                evaluacion_id: idEvaluacion,
                nota_evaluacion: calcularNotaGlobal(datosParaEnviar, notaEvaluacion)
            });
            console.log(response)
            if (response.status != 200) {
                toast.error("❌ Hubo un problema al guardar las calificaciones.");
            }
        } catch (error) {
            console.error(error);
            toast.error("❌ Error al guardar las calificaciones.");
        }
    }

    const guardarTodasLasCalificaciones = async () => {
        const preguntasSinCalificar = preguntas.filter(p => !calificaciones[p.id]);
    
        if (preguntasSinCalificar.length > 0) {
            toast.error("Por favor califica todas las respuestas antes de guardar.");
            return;
        }
    
        const datosParaEnviar = preguntas.map(p => ({
            preguntaId: p.id,
            calificacion: calificaciones[p.id]
        }));

    
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/preguntasAbiertas`
            const response = await apiRest.fetchPut(url, { calificacion: datosParaEnviar });
            console.log(response)
            if (response.status === 200) {
                toast.success("✅ Calificaciones guardadas correctamente.");
                editarCalificacion(datosParaEnviar)
            } else {
                toast.error("❌ Hubo un problema al guardar las calificaciones.");
            }
        } catch (error) {
            console.error(error);
            toast.error("❌ Error al guardar las calificaciones.");
        }
    };
    
    const todasCalificadas = preguntas.every(p => {
        const r = respuestasExistentes.find(r => r.preguntasAbiertasId === p.id);
        return r && r.idEscalaApreciacion !== null;
    });

    const editarCalificacionFunc = () => {
        setcalifico(!califico);
        seteditarCalificaciones(!editarCalificaciones);
    }
    

    return (
        <Contenedor>
            <h1 className="titulo">Preguntas Abiertas</h1>
    
            {preguntas.map((p) => {
                const yaRespondida = respuestasExistentes.some(r => r.preguntasAbiertasId === p.id);
    
                return (
                    <PreguntaBox key={p.id}>
                        <PreguntaTexto>{p.pregunta}</PreguntaTexto>
    
                        <RespuestaInput
                            value={respuestas[p.id] || ''}
                            onChange={(e) => actualizarRespuesta(p.id, e.target.value)}
                            placeholder="Escribe tu respuesta aquí..."
                            disabled={yaRespondida}
                        />

                        {typeUser === 1 && yaRespondida && (() => {
                            const r = respuestasExistentes.find(r => r.preguntasAbiertasId === p.id);
                            const tipo = r?.idEscalaApreciacion;
                            const texto =
                                tipo === 1 ? 'Buena' :
                                tipo === 2 ? 'Regular' :
                                tipo === 3 ? 'Mala' :
                                'Aún no evaluada';

                            return (
                                <ContenedorValoracion>
                                    Calificación del profesor:
                                    <EtiquetaValoracion tipo={tipo}>{texto}</EtiquetaValoracion>
                                </ContenedorValoracion>
                            );
                        })()}


                        




    
                            {isProfesor && (
                            <OpcionesCalificacion>
                                {(() => {
                                    const respuestaExistente = respuestasExistentes.find(r => r.preguntasAbiertasId === p.id);
                                    let yaCalificada = respuestaExistente?.idEscalaApreciacion !== null;
                                    
                                    if (yaCalificada && califico) {
                                        const tipoSeleccionado = tiposApreciacion.find(tipo => tipo.id === respuestaExistente.idEscalaApreciacion);
                                        
                                        if (!tipoSeleccionado) {
                                            return <div style={{ color: 'red' }}>⚠️ Calificación no válida</div>;
                                        }

                                        return (
                                            <BotonCalificacion
                                                key={tipoSeleccionado.id}
                                                activo={true}
                                                deshabilitado={true}
                                                color={
                                                    tipoSeleccionado.id === 1 ? '#28a745' :
                                                    tipoSeleccionado.id === 2 ? '#ffc107' :
                                                    tipoSeleccionado.id === 3 ? '#dc3545' :
                                                    '#ccc'
                                                }
                                            >
                                                {tipoSeleccionado.id === 1 && '✅'}
                                                {tipoSeleccionado.id === 2 && '⚠️'}
                                                {tipoSeleccionado.id === 3 && '❌'} {tipoSeleccionado.type}
                                            </BotonCalificacion>
                                        );
                                    }
                                    

                                    // Si NO está calificada aún, mostrar todos los botones
                                    return tiposApreciacion.map((tipo) => (
                                        <BotonCalificacion
                                            key={tipo.id}
                                            onClick={() => actualizarCalificacion(p.id, tipo.id)}
                                            activo={calificaciones[p.id] === tipo.id}
                                            deshabilitado={false}
                                            color={
                                                tipo.id === 1 ? '#28a745' :
                                                tipo.id === 2 ? '#ffc107' :
                                                tipo.id === 3 ? '#dc3545' :
                                                '#ccc'
                                            }
                                        >
                                            {tipo.id === 1 && '✅'}
                                            {tipo.id === 2 && '⚠️'}
                                            {tipo.id === 3 && '❌'} {tipo.type}
                                        </BotonCalificacion>
                                    ));
                                })()}
                            </OpcionesCalificacion>
                        )}

                    </PreguntaBox>
                );
            })}
    
            {error && (
                <MensajeError>⚠️ Por favor responde todas las preguntas antes de guardar.</MensajeError>
            )}
    
            {!todasRespondidas && (
                <div className='center'>
                    <ButtonSave className="mt-10" onClick={guardarRespuestas}>Guardar</ButtonSave>
                </div>
            )}

            {isProfesor && (
            <>
                {!editarCalificaciones ? (
                !kcalifico ? (
                    
                    
                    <div className="center">
                        <ButtonSave onClick={() => editarCalificacionFunc()} className="" >
                                Editar
                        </ButtonSave>
                    
                    </div>
                ) : (
                    
                    <div className="center">
                        <ButtonSave onClick={() => guardarTodasLasCalificaciones()} className="" >
                                Guardar
                        </ButtonSave>
                    </div>
                )
                ) : (
                // Mostrar Guardar + Cancelar cuando está en modo edición
                
                    <div className="center mt-30">
                        <ButtonSave onClick={() => guardarTodasLasCalificaciones()} className="" >
                                    Guardar
                        </ButtonSave>
                        <ButtonSave
                            bgColor="#d5dbdb"
                            hoverColor="#bfc9ca"
                            className="ml-10"
                            onClick={() => editarCalificacionFunc()}
                        >
                            Cancelar
                        </ButtonSave>
                    </div>
                
                )}
            </>
            )}

    
            

        </Contenedor>
    );
    
    
}

// Estilos
const EtiquetaValoracion = styled.span.withConfig({
  shouldForwardProp: (prop) => !['tipo'].includes(prop)
})`
    padding: 0.2rem 0.6rem;
    border-radius: 9999px;
    font-size: 1rem;
    font-weight: 500;
    color: white;
    background-color: ${({ tipo }) =>
        tipo === 1 ? '#2ecc71' :
        tipo === 2 ? '#f1c40f' :
        tipo === 3 ? '#e74c3c' :
        '#95a5a6'};
    line-height: 1;
    white-space: nowrap;
`;


const ContenedorValoracion = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    margin-top: 0.5rem;
    margin-left: 1.5rem;
`;




const BotonGuardarCalificacion = styled.button`
    margin-top: 0.5rem;
    background: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
        background: #0056b3;
    }
`;

const MensajeResultado = styled.div`
    margin-top: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    color: ${({ tipo }) => (tipo === 'exito' ? '#155724' : '#721c24')};
    background: ${({ tipo }) => (tipo === 'exito' ? '#d4edda' : '#f8d7da')};
    border: 1px solid ${({ tipo }) => (tipo === 'exito' ? '#c3e6cb' : '#f5c6cb')};
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
`;


const Contenedor = styled.div`
    padding: 2rem;
    background: #ffffff;
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
		margin: 0px 0px 5rem 0px;
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

const Titulo = styled.h2`
    font-size: 2rem;
    font-weight: 600;
    color: #333;
`;

const PreguntaBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const PreguntaTexto = styled.p`
    font-size: 1.2rem;
    font-weight: 500;
    color: #444;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
`;

const RespuestaInput = styled.textarea`
    width: 100%;
    height: 100px;
    padding: 1rem;
    font-size: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 1rem;
    background: #f9f9f9;
    resize: none;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: #007bff;
        background: #fff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
    }

    &:disabled {
        background: #eee;
        cursor: not-allowed;
        color: #777;
    }
`;

const OpcionesCalificacion = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
`;

const BotonCalificacion = styled.button.withConfig({
    shouldForwardProp: (prop) => !['activo', 'deshabilitado'].includes(prop)
})`
    padding: 0.4rem 0.8rem;
    border-radius: 0.5rem;
    border: 1px solid ${({ activo, color }) => (activo ? color : '#ccc')};
    background: ${({ activo, color }) => (activo ? color : '#f0f0f0')};
    color: ${({ activo }) => (activo ? '#fff' : '#333')};
    cursor: ${({ deshabilitado }) => (deshabilitado ? 'not-allowed' : 'pointer')};
    opacity: ${({ deshabilitado }) => (deshabilitado ? 0.6 : 1)};
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
        opacity: ${({ deshabilitado }) => (deshabilitado ? 0.6 : 0.85)};
    }
`;


const MensajeError = styled.div`
    color: #d93025;
    font-weight: 500;
    background: #ffe6e6;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    border: 1px solid #ffbdbd;
`;

const BotonGuardar = styled.button`
    align-self: flex-end;
    background: #28a745;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);

    &:hover {
        background: #1e7e34;
    }
`;
