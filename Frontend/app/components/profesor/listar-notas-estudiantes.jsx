'use client'; import { useState, useEffect, ListarEvaluaciones, Select, PreguntasAbiertas, styled, PropTypes, utils, apiRest, toast, export_file, ButtonAccion, InputSearch, DataTableIndex, SopaDeLetras, Cuestionario } from '@/app/components/utils/rutas';
import { TbEyeEdit } from "react-icons/tb";

export default function ListarUnidades() {

    const [data, setData] = useState([]);
    const [dataEvaluaciones, setDataEvaluaciones] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [unidadSeleccionada, setUnidadSeleccionada] = useState(true);
    const [typesEvaluaciones, setTypesEvaluaciones] = useState([]);
    const [typeEvaluacion, settypeEvaluacion] = useState('');
    const [mostrarEvaluaciones, setMostrarEvaluaciones] = useState(false);
    const [evaluacion, setevaluacion] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [idEvaluacion, setidEvaluacion] = useState('')
    const [notaEvaluacion, setnotaEvaluacion] = useState('')
    const [estudianteId, setestudianteId] = useState(5);
    const [aulas, setAulas] = useState([]);
    const [aulaSeleccionada, setAulaSeleccionada] = useState(null);
    const [estudiantes, setestudiantes] = useState([]);
    const [estudianteSeleccionado, setestudianteSeleccionado] = useState(null);

    const [modulo, setModulo] = useState('');
    const [idUnidad, setidUnidad] = useState('');

    useEffect(() => {
        recargar();
        obtenerAula();
    }, []);

    useEffect(() => {
        if (estudianteSeleccionado?.value) {
            setestudianteId(estudianteSeleccionado.value);
        }
    }, [estudianteSeleccionado]);

    
    useEffect(() => {
        if (aulaSeleccionada) {
            obtenerEstudiantes();
        }
    }, [aulaSeleccionada]);

    const recargar = async () => {
        setCargando(true);
        try {
            await obtenerUnidades();
            await obtenerTypeEvaluaciones();
        } catch (error) {
            console.error('Error al recargar:', error);
        } finally {
            setCargando(false);
        }
    };

    const recargar2 = async () => {
        setCargando(true);
        try {
            obtener_evaluaciones(idUnidad, modulo)
        } catch (error) {
            console.error('Error al recargar:', error);
        } finally {
            setCargando(false);
        }
    };

    const obtenerUnidades = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades/profesor`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                const unidades = response.data.data;
                const unidadesConNotas = await Promise.all(
                    unidades.map(async (unidad) => {
                        const nota = await obtener_nota_by_unidad(unidad.id);
                        return {
                            ...unidad,
                            notaAcumulativa: nota.toFixed(2)
                        };
                    })
                );
    
                setData(unidadesConNotas);
            } else {
                console.error('La respuesta de la API no contiene datos válidos.');
                setData([]);
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
            setData([]);
        }
    };

    const obtenerEstudiantes = async () => {
       
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/aula/estudiantesByAula`
            const response = await apiRest.fetchPost(url, {
                aulaId :aulaSeleccionada.value
            }); 
            console.log(response)

            if (response.status === 200) {
                obtenerUnidades();
                const data = response.data.data.map((a) => {
                    const name = a.name?.trim() || '';
                    const surname = a.surname?.trim() || '';
                    let label = [name, surname].filter(Boolean).join(' ');
                    
                    if (!label) label = a.email || 'Sin identificador';
                
                    return {
                        value: a.id,
                        label,
                    };
                });

                if (data.length > 0) {
                    setestudianteSeleccionado(data[0]);
                }
                  

                setestudiantes(data);
            } else {
                setestudianteSeleccionado(null);
                setData([]);         
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
            
        }
    };

    const obtenerAula = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/aula/profesor`
            const response = await apiRest.fetchGet(url);
            console.log(response);
    
            if (response.status === 200 && Array.isArray(response.data.data)) {
                const aulasFormateadas = response.data.data.map((aulas) => ({
                    value: aulas.aulaId,
                    label: aulas.nombreAula,
                }));
    
                if (aulasFormateadas.length > 0) {
                    const primeraAula = aulasFormateadas[0];
                    setAulaSeleccionada(primeraAula);
                }
    
                setAulas(aulasFormateadas);
            } else {
                console.warn('No se recibieron aulas. Mensaje del servidor:', response.data?.message || 'Sin mensaje');
                setAulas([]); // Vaciar si no hay datos válidos
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
        }
    };
    
    
    const obtener_evaluaciones = async (idUnidad, modulo) => {
        
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/${idUnidad}`
            const response = await apiRest.fetchGet(url);
            
            if (response.status === 200) {
                const evaluaciones = response.data;
    
                const evaluacionesConNotas = await Promise.all(
                    evaluaciones.map(async (evaluacion) => {
                        const nota = await obtener_nota_by_evaluaciones(evaluacion.id);
                        return {
                            ...evaluacion,
                            notaEstudiante: nota.length > 0 ? nota[0].notaEvaluacion : null
                        };
                    })
                );
    
                setModulo(modulo);
                setidUnidad(idUnidad);
                setDataEvaluaciones(evaluacionesConNotas);
                setUnidadSeleccionada(false);
                setMostrarEvaluaciones(true);
            } else {
                console.error('La respuesta de la API no contiene datos válidos.');
                setDataEvaluaciones([]);
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
            setDataEvaluaciones([]);
        }
    };

    const obtener_nota_by_unidad = async (unidadId) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/NotaEstudiante/${estudianteId}/${unidadId}`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                const datos = response.data.data;
                const sumaNotas = datos.reduce((total, item) => total + parseFloat(item.notaEvaluacion), 0);
                return sumaNotas;
            } else {
                return 0;
            }
        } catch (err) {
            console.error('Error al obtener nota acumulativa:', err);
            return 0;
        }
    };

    const obtener_nota_by_evaluaciones = async (evaluacion_id) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/NotaEstudiante/nota/${estudianteId}/${evaluacion_id}`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                return response.data.data;
            } else {
                return 0;
            }
        } catch (err) {
            console.error('Error al obtener nota acumulativa:', err);
            return 0;
        }
    };

    const obtenerTypeEvaluaciones = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/TypeEvaluaciones`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                setTypesEvaluaciones(response.data.data);
            } else {
                console.error('La respuesta de la API no contiene datos válidos.');
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
        }
    };

    const obtener_details_evaluaciones = (id, type, notaEvaluacion) => {
        setidEvaluacion(id);
        settypeEvaluacion(type);
        setnotaEvaluacion(notaEvaluacion);
        setMostrarEvaluaciones(false);
        setevaluacion(true);
    };

    const handleVolver = () => {
        setUnidadSeleccionada(true);
        setMostrarEvaluaciones(false);
    };

    const handleVolverEvaluacion = () => {
        recargar2();
        setevaluacion(false);
        setMostrarEvaluaciones(true);
    };
    
    const filteredData = data.filter(
        (item) =>
            (item.nombre?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.modulo?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.descripcion?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.createdAt?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.updateAt?.toLowerCase() || '').includes(filterText.toLowerCase()) 
    );

    const filteredDataEvaluaciones = dataEvaluaciones.filter(
        (item) =>
            (item.id?.toString().toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.idUnidad?.toString().toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.typeId?.toString().toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.notaEvaluacion?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.status?.toString().toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.createdAt?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.updateAt?.toLowerCase() || '').includes(filterText.toLowerCase())
    );

    const columns = [
        {   name: 'Módulo', 
            selector: (row) => row.modulo || 'No disponible', 
            sortable: true, 
            grow: 1 
        },
        {   name: 'Nombre', 
            selector: (row) => row.nombre || 'No disponible', 
            sortable: true, 
            grow: 3.5 
        },
        {   name: 'Nota Unidad', 
            selector: (row) => {
                if (row.notaUnidad == 0) return '0 puntos';
              
                const nota = parseFloat(row.notaUnidad);
                const texto = nota === 1 ? 'punto' : 'puntos';
                return `${nota} ${texto}`;
            },              
            sortable: true, 
            grow: 1.8 
        },
        // {   name: 'Nota Acumulativa',
        //     selector: (row) => {
        //         if (row.notaAcumulativa == 0) return '0 puntos';
              
        //         const nota = parseFloat(row.notaAcumulativa);
        //         const texto = nota === 1 ? 'punto' : 'puntos';
        //         return `${nota} ${texto}`;
        //     },              
        //     sortable: true, 
        //     grow: 1.8 
        // },    
        {
            name: 'Acción',
            grow: 1.5,
            cell: (row) => (
                <>
                    <button onClick={() => obtener_evaluaciones(row.id, row.modulo)} style={{ color: '#0465ac' }}><TbEyeEdit  size={28}/></button>
                </>
            ),
        }   
    ];

    const columnsEvaluaciones = [
        {
            name: 'Módulo',
            selector: () => modulo || 'No disponible',
            sortable: true,
            grow: 1
        },
        {
            name: 'Evaluación',
            grow: 2,
            selector: (row) => {
                const tipo = typesEvaluaciones.find((t) => t.id === row.typeId);
                return tipo ? tipo.type : 'No disponible';
            },
            sortable: true,
        },
        {
            name: 'Nota Evaluación',
            selector: (row) => {
                if (row.notaEvaluacion == 0) return '0 puntos';
                const nota = parseFloat(row.notaEvaluacion);
                const texto = nota === 1 ? 'punto' : 'puntos';
                return `${nota} ${texto}`;
            },
            sortable: true,
            grow: 1.8
        },
        {
            name: 'Nota obtenida',
            selector: (row) => {
                if ( row.notaEstudiante == null) return (
                    <span style={{ color: 'red' }}>
                        -
                    </span>
                );
                const nota = parseFloat(row.notaEstudiante);
                const texto = nota === 1 ? 'punto' : 'puntos';
                return `${nota} ${texto}`;
            },
            sortable: true,
            grow: 1.8
        },
        {
            name: 'Acción',
            grow: 1,
            cell: (row) => {
                const nota = parseFloat(row.notaEstudiante);
                if (isNaN(nota) || nota == null) {
                    return (
                        <span style={{ color: 'red' }}>
                            El estudiante aún no realiza esta evaluación
                        </span>
                    );
                }
                return (
                    <button onClick={() => obtener_details_evaluaciones(row.id, row.typeId, row.notaEvaluacion)} style={{ color: '#0465ac' }}>
                        <TbEyeEdit  size={28}/>
                    </button>
                );
            },
        }
        
        
    ];

    let contenido;

    if (unidadSeleccionada) {
    contenido = (
        <>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="botones-exportar">
                <ButtonAccion onClick={recargar} loading={true}></ButtonAccion>
                <div>
                    <Select
                        options={aulas}
                        placeholder="Selecciona un sección..."
                        value={aulaSeleccionada}
                        onChange={setAulaSeleccionada}
                        styles={customStyles}
                        isClearable
                    />
                </div> 
                <div>
                    <Select
                        options={estudiantes}
                        placeholder="Selecciona un estudiante..."
                        value={estudianteSeleccionado}
                        onChange={setestudianteSeleccionado}
                        styles={customStyles}
                        isClearable
                    />
                </div> 
            </div>
            <InputSearch filterText={filterText} setFilterText={setFilterText} />
        </div>

        <DataTableIndex columns={columns} data={filteredData} />
        </>
    );
    } else if (mostrarEvaluaciones) {
    contenido = (
        <>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="botones-exportar">
                    <ButtonAccion onClick={handleVolver} loading={true}>Atrás</ButtonAccion> 
                    <ButtonAccion onClick={recargar2} loading={true}></ButtonAccion> 
                </div>
            </div>

            <DataTableIndex columns={columnsEvaluaciones} data={filteredDataEvaluaciones}/>
        </>
    );
    } else if (evaluacion && typeEvaluacion === 1) {
    contenido = (
        <>
        <ButtonAccion onClick={handleVolverEvaluacion} loading={true}>Atrás</ButtonAccion>
        <SopaDeLetras idEvaluacion={idEvaluacion} id_estudiante={estudianteId} />
        </>
    );
    } else if (evaluacion && typeEvaluacion === 2) {
    contenido = (
        <>
        <ButtonAccion onClick={handleVolverEvaluacion} loading={true}>Atrás</ButtonAccion>
        <Cuestionario idEvaluacion={idEvaluacion} id_estudiante={estudianteId} />
        </>
    );
    } else if (evaluacion && typeEvaluacion === 3) {
    contenido = (
        <>
        <ButtonAccion onClick={handleVolverEvaluacion} loading={true}>Atrás</ButtonAccion> 
        <PreguntasAbiertas idEvaluacion={idEvaluacion} id_estudiante={estudianteId} notaEvaluacion={notaEvaluacion} isProfesor={true}/>
        </>
    );
    } else {
    contenido = null;
    }

    return (
    <Componente>
        <div style={{ padding: '1rem', fontFamily: 'Lexend Deca, sans-serif' }}>
        {contenido}
        </div>
    </Componente>
    );

      
    
    
    
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

const InputFieldNumber = ({ label, type = "number", value, onChange, placeholder, required = false }) => (
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

const TextAreaField = ({ label, value, onChange, placeholder, required = false }) => (
	<div className="form-group">
		<label className="form-label">{label}</label>
		<textarea
			className="form-textarea"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			required={required}
			rows="4"
		/>
	</div>
);
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

InputField.propTypes = {
	label: PropTypes.string.isRequired,
	type: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	required: PropTypes.bool
};

TextAreaField.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	required: PropTypes.bool
};

const Componente = styled.div`

    .header-edicion {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .btn-volver,
    .btn-evaluaciones {
        padding: 0.5rem 1rem;
        background-color: #0465ac;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
    }

    .slide-panel {
        animation: slideIn 0.4s ease-out forwards;
        
        padding: 1rem;
        border-radius: 12px;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0%);
            opacity: 1;
        }
    }

    .slide-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .btn-cerrar {
        background: transparent;
        border: none;
        color: #0465ac;
        font-size: 1rem;
        cursor: pointer;
    }

    .tabla-ejemplo {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
    }

    .tabla-ejemplo th,
    .tabla-ejemplo td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: center;
    }

    .tabla-ejemplo th {
        background-color: #0465ac;
        color: white;
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
