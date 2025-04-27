"use client";

import { styled, apiRest, useState, useEffect, Select, toast, ModalField} from '@/app/components/utils/rutas';



export default function Asignar_aula_profesor() {

    const [semestreActivo, setSemestreActivo] = useState([]);
    const [aulas, setAulas] = useState([]);
    const [profesoresDisponibles, setProfesoresDisponibles] = useState([]);
    const [aulasConProfesor, setAulasConProfesor] = useState([]);

    const [aulaSeleccionada, setAulaSeleccionada] = useState(null);

    const [visible, setVisible] = useState(false);
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
    };

    useEffect(() => {
        listarAulas();
    }, [aulasConProfesor]);
    

    const registrar = async (id, idProfesor) => {
        
        try {

            const url = `http://localhost:3333/ovacademy/semestre/aula`
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

        try {

            const url = `http://localhost:3333/ovacademy/semestre/aula`
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
        }
        
      };
    
    const obtenerSemestreActivo = async () => {
        try {

            const response = await apiRest.fetchGet('http://localhost:3333/ovacademy/semestre/activo');
            if (response.status === 200) {
                setSemestreActivo(response.data.data[0]);
            } else {
                setSemestreActivo([]);
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', err);
            setSemestreActivo([]);
        }   
    };

    const listarAulas = async () => {
        try {
            const response = await apiRest.fetchGet('http://localhost:3333/ovacademy/aula');
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
            } else {
                setAulas([]);
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setAulas([]);
        }
    };
    

    const listarProfesores = async () => {
        try {
            const response = await apiRest.fetchGet('http://localhost:3333/ovacademy/user?type_id=2');
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
        }
    };

    const obtenerAulasConProfesor = async () => {
        try {
            const response = await apiRest.fetchGet("http://localhost:3333/ovacademy/aula/profesorWithAula");
            if (response.status === 200) {
                setAulasConProfesor(response.data.data);
            } else {
                setAulasConProfesor([]);
            }
        } catch (error) {
            console.error("Error al obtener asignaciones:", error);
            setAulasConProfesor([]);
        }
    };
    

    return (
        <Component>
            <div className="container">
                <h2 className="titulo mb-20">🏫 Secciones Disponible - Semestre {semestreActivo.nombre}</h2>

                {(semestreActivo.length === 0 || aulas.length === 0 || profesoresDisponibles.length === 0) ? (
                    <div className='DivNoDisponible'>
                        <p>Para habilitar esta sección, debes tener registrado un semestre, un profesor y al menos una sección</p>
                    </div>
                ) : (
                    <>
                        <div className="grid mt-20">
                            {aulas.map((aula) => (
                                <div key={aula.id} className="card mt-8">
                                    <h3>{aula.nombre}</h3>
                                    <Select
                                        options={aula.profesor ? [] : profesoresDisponibles}
                                        placeholder="Asignar profesor"
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
                                    {aula.profesor && (
                                        <button
                                            className="btn-limpiar"
                                            onClick={() => abrirModal(aula.id)}
                                        >
                                            Eliminar
                                        </button>
                                    )}

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
        </Component>

    );
}


  

const Component = styled.div`

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
    margin-top: 120px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
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
`;