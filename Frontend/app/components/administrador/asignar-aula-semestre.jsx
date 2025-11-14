"use client";

import { styled, apiRest, useState, useEffect, useRouter, Select, toast, ModalField, ButtonAccion, ButtonSave, Spinner} from '@/app/components/utils/rutas';

export default function Asignar_aula_profesor({ handleTabClick }) {

    const router = useRouter();

    const [showSpinner, setShowSpinner] = useState(false);
	const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);

    const [seccionSeleccionada, setseccionSeleccionada] = useState(false);
    
    const [idAula, setidAula] = useState("");
    const [nombreAula, setnombreAula] = useState("");
    const [ubicacion, setubicacion] = useState("");

    const [semestreActivo, setSemestreActivo] = useState([]);
    const [aulas, setAulas] = useState([]);
    const [profesoresDisponibles, setProfesoresDisponibles] = useState([]);
    const [aulasConProfesor, setAulasConProfesor] = useState([]);

    const [aulaSeleccionada, setAulaSeleccionada] = useState(null);

    const [visible, setVisible] = useState(false);
    const [visibleEditar, setVisibleEditar] = useState(false);
    const [visibleEliminar, setvisibleEliminar] = useState(false);

    const abrirModal = (idAula) => {
        setAulaSeleccionada(idAula);
        setVisible(true);
    };
    const cerrarModal = () => setVisible(false);

    useEffect(() => {
        recargar();
    }, []);
      
    const recargar = async () => {
        obtenerSemestreActivo();
        listarProfesores();
        obtenerAulasConProfesor();
        listarAulas();
        setseccionSeleccionada(false);
    };

    useEffect(() => {
        listarAulas();
    }, [aulasConProfesor]);
    

    const registrar = async (id, idProfesor) => {
        
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/semestre/aula`
            const response = await apiRest.fetchPost(url, {
                aula: id,
                profesor: idProfesor
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                setAulas(
                    aulas.map((aula) =>
                        aula.id === id ? { ...aula, profesor: idProfesor } : aula
                    )
                );
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            toast.error("Error al crear profesor.");
        }finally { clearTimeout(timeout); setShowSpinner(false);setIsLoadingRespuestas(false);}
    };

    const handleDeleteClick = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/aula/id/${idAula}`
            const response = await apiRest.fetchDelete(url);
            if (response.status === 200) {
                toast.success(`Sección Eliminada`);
                recargar()
                setVisible(false)
            } else {
                console.error('Error al editar el aula');
            }
        } catch (err) {
            console.log(err);
            toast.error('Error al conectar con el servidor.');
        }
    };

    const eliminar = async (id) => {
        
        if (!aulaSeleccionada) return;

        const aula = aulas.find(a => a.id === aulaSeleccionada);

        if (!aula || !aula.profesor) {
            toast.error("No se encontró el profesor asignado.");
            cerrarModal();
            return;
        }

        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);

            const url = `${process.env.NEXT_PUBLIC_API_URL}/semestre/aula`
            const response = await apiRest.fetchDelete(url, {
                aula: aula.id,
                profesor: aula.profesor
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                recargar();
                cerrarModal();
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            toast.error("Error al eliminar el profesor.", error);
            console.error("Error al eliminar el profesor.", error);
        }finally { clearTimeout(timeout); setShowSpinner(false);setIsLoadingRespuestas(false);}
        
      };
    
    const obtenerSemestreActivo = async () => {
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/semestre/activo`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                setSemestreActivo(response.data.data);
            } else {
                setSemestreActivo([]);
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', err);
            setSemestreActivo([]);
        }finally { clearTimeout(timeout); setShowSpinner(false);}
    };

    const listarAulas = async () => {
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/aula`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                const aulasObtenidas = response.data.data;
    
                // Asignar profesor si ya está en aulasConProfesor
                const aulasConAsignaciones = aulasObtenidas.map(aula => {
                    const asignacion = aulasConProfesor.find(a => a.aulaId === aula.id);
                    return {
                        ...aula,
                        profesor: asignacion ? asignacion.profesorId : null
                    };
                });
    
                setAulas(aulasConAsignaciones);
                await new Promise(resolve => setTimeout(resolve, 700));
            } else {
                setAulas([]);
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setAulas([]);
        }finally { clearTimeout(timeout); setShowSpinner(false);setIsLoadingRespuestas(false);}
    };
    
    const listarProfesores = async () => {
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/user?type_id=2`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                const profesoresFormateados = response.data.data.map((prof) => ({
                    value: prof.id,
                    label: `${prof.name} ${prof.surname}`,
                }));
                setProfesoresDisponibles(profesoresFormateados);
            } else {
                setProfesoresDisponibles([]);
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setProfesoresDisponibles([]);
        }finally { clearTimeout(timeout); setShowSpinner(false);}
    };

    const obtenerAulasConProfesor = async () => {
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/aula/profesorWithAula`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                setAulasConProfesor(response.data.data);
            } else {
                setAulasConProfesor([]);
            }
        } catch (error) {
            console.error("Error al obtener asignaciones:", error);
            setAulasConProfesor([]);
        }finally { clearTimeout(timeout); setShowSpinner(false);}
    };

    const editar_seccion = async () => {
        
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/aula/`
            const response = await apiRest.fetchPut(url,
                { id: idAula, nombre: nombreAula, ubicacion:ubicacion }
            );
            if (response.status === 200) {
                recargar()
                setVisibleEditar(false)
            } else {
                console.error('Error al editar el aula');
            }
        } catch (error) {
            console.error("Error al editar el aula:", error);
        }finally { clearTimeout(timeout); setShowSpinner(false);}
    };

    const obtenerSeccionId = async (id) => {
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/aula/${id}`
            const response = await apiRest.fetchGet(url);
            console.log(response)
            if (response.status === 200) {
                setidAula(response.data.data.id);
                setnombreAula(response.data.data.nombre);
                setubicacion(response.data.data.ubicacion);
                await new Promise(resolve => setTimeout(resolve, 800));
                setseccionSeleccionada(true);
            } else {
                // console.error('La respuesta de la API no contiene datos válidos');
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
        }finally { clearTimeout(timeout); setShowSpinner(false);}
    };

    let contenido;

    if (showSpinner || isLoadingRespuestas) {
        contenido = <Spinner show={showSpinner} />;
    } else if (seccionSeleccionada) {
        contenido = (
            <>
                <div className="header-edicion center-left">
                    <ButtonAccion onClick={() => setseccionSeleccionada(false)}>Atrás</ButtonAccion>
                    <ButtonSave bgColor="#e74c3c" hoverColor="#c0392b" className="ml-10" onClick={() => setvisibleEliminar(true)} animation={false}> Eliminar Sección</ButtonSave>
                </div>

                <div className="form-wrapper">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                        className="space-y-4"
                    >
                        <div className="form-column">
                            <div className="form-item">
                                <InputField
                                    label="Nombre de la Sección"
                                    value={nombreAula}
                                    onChange={setnombreAula}
                                    placeholder="nombre"
                                    required
                                />
                            </div>
                            <div className="form-item nombre">
                                <InputField
                                    label="Ubicación"
                                    value={ubicacion}
                                    onChange={setubicacion}
                                    placeholder="Ubicación"
                                    required
                                />
                            </div>

                        </div>
                        
                        <div className='center'>
							<ButtonSave type="button" className="mt-10 mr-10" onClick={() => setVisibleEditar(true)}>Guardar</ButtonSave>
							<ButtonSave bgColor="#d5dbdb" hoverColor="#bfc9ca" className="mt-10" onClick={() => setseccionSeleccionada(false)}>Regresar</ButtonSave>
						</div>
                    </form>
                    <ModalField 
                        visible={visibleEditar} 
                        cerrarModal={() => setVisibleEditar(false)} 
                        onclick={() => editar_seccion()}
                        width={"700"}
                        height={"100"}
                        title={"¿Estas seguro?"}
                        mensaje={
                            <>
                                ¿Que deseas editar el detalle de esta Sección? <br /><br />
                            </>
                        }
                    />
                    <ModalField 
                        visible={visibleEliminar} 
                        cerrarModal={() => setvisibleEliminar(false)} 
                        onclick={() => handleDeleteClick()}
                        width={"700"}
                        height={"100"}
                        title={"¿Estas seguro?"}
                        mensaje={
                            <>
                                ¿Que deseas eliminar Sección? <br /><br />
                            </>
                        }
                    />
                </div>
            </>
        );
    } else {
        contenido = (
            <>
                <div className="container">
                    <h2 className="titulo mb-20">🏫 Secciones Disponible - Semestre {semestreActivo?.nombre ?? 'N/A'}</h2>

                    {(semestreActivo.length === 0 || aulas.length === 0 || profesoresDisponibles.length === 0) ? (
                        <div className='DivNoDisponible'>
                            <p>Para habilitar esta sección, debes tener registrado un semestre, un profesor y al menos una sección</p>
                            <div className='center'>
                                <ButtonSave bgColor="#33b0e4" hoverColor="#3380e4" className="mt-30" onClick={() => router.push('/ovacademy/administrador/profesores')}>Profesor</ButtonSave>
                                <ButtonSave bgColor="#33b0e4" hoverColor="#3380e4" className="mt-30 ml-10" onClick={() => router.push('/ovacademy/administrador/semestre')}>Semestre</ButtonSave>
                                <ButtonSave bgColor="#33b0e4" hoverColor="#3380e4" className="mt-30 ml-10 mr-10" onClick={() => handleTabClick(0)}>Sección</ButtonSave>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid">
                                {aulas.map((aula) => (
                                    <div key={aula.id} className="card mt-8">
                                        <h3>{aula.nombre}</h3>
                                        <Select
                                            options={aula.profesor ? [] : profesoresDisponibles}
                                            placeholder="Vincular profesor"
                                            value={profesoresDisponibles.find((p) => p.value === aula.profesor) || null}
                                            onChange={(selectedOption) =>
                                                registrar(aula.id, selectedOption ? selectedOption.value : null)
                                            }
                                            isClearable
                                            isDisabled={!!aula.profesor} // <-- Desactiva si ya tiene profesor
                                            menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    fontFamily: 'var(--font-lexend)',
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    fontFamily: 'var(--font-lexend)',
                                                }),
                                                option: (base) => ({
                                                    ...base,
                                                    fontFamily: 'var(--font-lexend)',
                                                }),
                                                menuPortal: (base) => ({
                                                    ...base,
                                                    zIndex: 9999,
                                                }),
                                            }}
                                        />
                                        <button
                                            className="btn-editar mr-10"
                                            onClick={() => obtenerSeccionId(aula.id)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn-limpiar"
                                            onClick={aula.profesor ? () => abrirModal(aula.id) : undefined}
                                            disabled={!aula.profesor}
                                        >
                                            Desvincular
                                        </button>


                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <ModalField 
                    visible={visible} 
                    cerrarModal={cerrarModal} 
                    onclick={eliminar}
                    width={"700"}
                    height={"300"}
                    title={"¿Estas seguro?"}
                    mensaje={
                        <>
                            ¿Estás seguro que deseas remover este profesor de esta sección? <br /><br />
                            Al confirmar, estarías eliminando{' '}
                            <span style={{ color: 'red', fontWeight: 'bold' }}>permanentemente</span> su asignación actual y{' '}
                            <strong>todo el avance</strong> de los estudiantes asociados.
                        </>
                    }
                />
            </>
        );
    }

    return <Component>{contenido}</Component>;
    
}


const InputField = ({ label, type = "text", value, onChange, placeholder, required = false }) => (
    <div className="form-group">
        <label className="form-label">{label}</label>
        <input
            type={type}
            className="form-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
        />
    </div>
);

const Component = styled.div`

    .btn-editar {
        margin-top: 10px;
        background: #0466ac;
        color: white;
        padding: 6px 12px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        transition: background 0.3s;
    }

    .btn-editar:hover {
        background: #0056b3;
    }

    .btn-limpiar {
        margin-top: 10px;
        background: #e74c3c;
        color: white;
        padding: 6px 12px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        transition: background 0.3s;
    }

    .btn-limpiar:hover {
        background: #c0392b;
    }

    .btn-limpiar:disabled {
        background: #faf5f5;
        color: #666;
        cursor: not-allowed;
    }



  .container {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    padding: 20px;
    
  }

  .titulo {
    font-size: 24px;
    margin-bottom: 20px;
    font-weight: bold;
  }

  .DivNoDisponible{
    margin-top: 120px;
  }

  .grid {
    margin-top: 3rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media (min-width: 1024px) {
        .grid {
            margin-top: 7rem;
        }
    }

  @media (max-width: 1024px) {
        .grid {
            grid-template-columns: repeat(2, 1fr);
        }
  }

  @media (max-width: 600px) {
    .grid {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  .card {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
    
  }

  .card:hover {
    transform: translateY(-5px);
  }

  .card h3 {
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
  }

  .card input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
  }

  .card input:focus {
    outline: none;
    border-color: #0465ac;
  }

  .card .react-select__control {
    width: 100%;
  }

  .btn-guardar {
    margin-top: 50px;
    background: #0465ac;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .btn-guardar:hover {
    background: #0056b3;
  }

  
    .form-row {
        display: flex;
        gap: 1rem;
        width: 100%;
    }

    .form-item {
        flex: 1;
    }

    .form-item.nombre {
        flex: 3;
    }

    .form-item.evaluativo {
        flex: 1;
    }

    .label-row{
        border-radius: 5px;
        width: 100%;
    }

    .label-status-user{
        color: white;
        border-radius: 5px;
        padding: 5px 10px;  
    }

    .btn-register-teacher{
        background-color: blue;
    }

    .btn-export{
        padding: 0.5rem 1rem;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .btn-pdf{
        background-color: #0465ac;
    }

    .btn-excel{
        background-color: #0465ac;
    }

    .form-wrapper {
        margin: 50px 0;
        background: #fff;
        border-radius: 12px;
    }

    .form-group {
        margin-bottom: 16px;
    }

    .form-label {
        display: block;
        margin-bottom: 6px;
        color: #555;
        font-weight: 600;
    }

    .form-input,
    .form-textarea {
        width: 100%;
        padding: 10px 14px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s, box-shadow 0.3s;
    }

    .form-textarea {
        resize: none; /* Evita que se pueda redimensionar */
        overflow-y: auto; /* Barra de desplazamiento si se pasa el contenido */
        height: 150px; /* Tamaño fijo */
    }

    .form-input:focus,
    .form-textarea:focus {
        border-color: #0465ac;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
        outline: none;
    }

    .btn-primary {
        width: 20%;
        padding: 12px;
        background: #0465ac;
        color: white;
        font-size: 1.1rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.3s;
    }

    .btn-primary:hover {
        background: #0056b3;
    }

    @media (max-width: 500px) {
        .form-wrapper {
        padding: 20px;
        }
    }
`;