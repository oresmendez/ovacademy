'use client'; import { useState, useEffect, styled, PropTypes, utils, InputSearch, apiRest, toast, Select, export_file, ModalField, DataTableIndex,ButtonAccion,ButtonSave, EditarContenido } from '@/app/components/utils/rutas';
import { TbEyeEdit } from "react-icons/tb";


export default function ListarContenidos() {

    const [dataContenidos, setDataContenidos] = useState([]);
    const [dataUnidades, setDataUnidades] = useState([]);
    const [unidades, setUnidades] = useState([]);

    const [visibleEliminar, setvisibleEliminar] = useState(false);

    const [filterText, setFilterText] = useState('');
    const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
    const [unidadSeleccionadaEditar, setUnidadSeleccionadaEditar] = useState(null);
    const [editarContenido, setEditarContenido] = useState(1);

    const [idContenido, setIdContenido] = useState("");

    const [nombre, setNombre] = useState("");
	const [descripcion, setDescripcion] = useState("");

    useEffect(() => {
        obtenerUnidades();
    }, []);

    useEffect(() => {
        if (unidadSeleccionada) {
            obtenerContenidoByID(unidadSeleccionada.value);
        }
    }, [unidadSeleccionada]);

    const obtenerUnidades = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades/profesor`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                setUnidades(response.data.data);
                const unidadesFormateadas = response.data.data.map((unidades) => ({
					value: unidades.id,
					label: unidades.modulo,
				}));

                if (unidadesFormateadas.length > 0) {
                    setUnidadSeleccionada(unidadesFormateadas[0]);
                }

                setDataUnidades(unidadesFormateadas);
            } else {
                console.error(`// console.error('La respuesta de la API no contiene datos válidos.'); función: ${obtenerUnidades.name}`);
                setDataUnidades([]);
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
            setDataUnidades([]);
        }
    };

    const seleccionarUnidadPorId = (id_unidad) => {
        const unidadEncontrada = dataUnidades.find(unidad => unidad.value === id_unidad);
        if (unidadEncontrada) {
            setUnidadSeleccionadaEditar(unidadEncontrada);
        } else {
            console.warn(`No se encontró la unidad con id_unidad: ${id_unidad}`);
        }
    };

    const obtenerContenidoByID = async (id) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/contenido/${id}`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                setDataContenidos(response.data);
            } else {
                console.error(`// console.error('La respuesta de la API no contiene datos válidos.'); función: ${obtenerContenidoByID.name}`);
                setDataContenidos([]);
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
            setDataContenidos([]);
        }
    };

    const obtenerContenidoDetailsByID = async (id, id_unidad) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/contenido/contenidoDetalles/${id}`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                seleccionarUnidadPorId(id_unidad);
                setIdContenido(response.data.id);
                setNombre(response.data.nombre);
                setDescripcion(response.data.descripcion);
                setEditarContenido(null);
            } else {
                console.error(`// console.error('La respuesta de la API no contiene datos válidos.'); función: ${obtenerContenidoDetailsByID.name}`);
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
        }
    };

    const filteredData = dataContenidos.filter(
        (item) =>
            (item.nombre?.toLowerCase() || '').includes(filterText.toLowerCase())
    );

    const volverAlListado = () => {
        obtenerUnidades();
        setEditarContenido(1);
        setIdContenido('');
        setNombre('');
        setDescripcion('');
        setUnidadSeleccionadaEditar(null);
    };

    const editar_contenido = async () => {
        try {
        
            const url = `${process.env.NEXT_PUBLIC_API_URL}/contenido`;
            const response = await apiRest.fetchPut(url, {
                id: idContenido,
                nombre,
                descripcion: descripcion
            });
            if (response.status === 200) {
                toast.success(response.data.message);
                volverAlListado();
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.error("Error atrapado en catch:", error);
            toast.error("Error al editar una unidad.");
        }
    };
    
    
    const handleDeleteClick = async (id) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/contenido/${id}`
            const response = await apiRest.fetchDelete(url);
            console.log(response);
            if (response.status === 200) {
                toast.success(`Contenido actualizado`);
                setDataContenidos((prevData) =>
                    prevData.map((item) =>
                        item.id === id ? { ...item, status: !item.status } : item
                    )
                );
            } else {
                toast.error('Ocurrió un error');
            }
        } catch (err) {
            console.log(err);
            toast.error('Error al conectar con el servidor.');
        }
    };

    const soft_delete = async () => {
		try {
		setvisibleEliminar(false)
		const url = `${process.env.NEXT_PUBLIC_API_URL}/contenido/delete/${idContenido}`;
		const response = await apiRest.fetchDelete(url);
		if (response.status === 200) {
			toast.success(response.data.message);
			obtenerUnidades();
			volverAlListado();
		} else {
			console.error(response.data.message);
		}
		} catch (err) {
		console.error('Error al eliminar la unidad.');
		}
	};

    const exportToPDF = () => {
        const name = 'contenidos.pdf';
        const title = 'Listado de Contenidos';
        const head = [['Nombre', 'Estado']];
        const tableRows = filteredData.map((row) => [
            row.nombre,
            row.status ? 'Activo' : 'Inactivo'
        ]);
        export_file.exportToPDF(title, head, tableRows, name);
    };

    const exportToExcel = () => {
        const name = 'contenidos.xlsx';
        const title = 'Contenidos';
        export_file.exportToExcel(title, filteredData, name);
    };

    const columns = [
        {
            name: 'Unidad',
            selector: (row) => {
                const unidad = unidades.find(u => u.id === row.idUnidad);
                return unidad ? unidad.modulo : 'No disponible';
            },
            sortable: true,
            grow: 1
        },
        {   name: 'Nombre', 
            selector: (row) => row.nombre || 'No disponible', 
            sortable: true, 
            grow: 5 
        },
        {   name: 'Fecha Creación', 
            selector: (row) => utils.formatearFecha(row.createdAt) || 'No disponible', 
            sortable: true, 
            grow: 1.5 
        },
        {   name: 'Fecha Actualización', 
            selector: (row) => utils.formatearFecha(row.updateAt) || 'No disponible', 
            sortable: true, 
            grow: 1.5 
        },
        {
            name: 'Estado',
            selector: (row) => (
                <button
                    onClick={() => handleDeleteClick(row.id)}
                    className={`label-status-user ${row.status ? 'activo' : 'inactivo'}`}
                    style={{
                        backgroundColor: row.status ? '#0465ac' : '#ebebeb',
                    }}
                >
                    {row.status ? 'Activo' : 'Inactivo'}
                </button>
            ),            
            sortable: true,
            grow: 1.2,
        },
        {
            name: 'Acción',
            grow: 1.5,
            cell: (row) => (
                <>
                    <button onClick={() => obtenerContenidoDetailsByID(row.id, row.idUnidad)} style={{ color: '#0465ac' }}><TbEyeEdit  size={28}/></button>
                </>
            ),
        }   
    ];

    return (
        <Componente>
            <div style={{ padding: '1rem', fontFamily: 'Lexend Deca, sans-serif' }}>
                {editarContenido ? (
                    <>
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="botones-exportar">
                            <ButtonAccion onClick={exportToPDF}>Exportar a PDF</ButtonAccion> 
                            <ButtonAccion onClick={exportToExcel}>Exportar a Excel</ButtonAccion> 
                            <ButtonAccion onClick={obtenerUnidades} loading={true} ></ButtonAccion> 
                            <div>
                                <Select
                                    instanceId="unidad-select"
                                    options={dataUnidades}
                                    placeholder="Selecciona una unidad..."
                                    value={unidadSeleccionada}
                                    onChange={setUnidadSeleccionada}
                                    styles={customStyles}
                                    isClearable
                                />
                            </div>
                        </div>
                        <InputSearch filterText={filterText} setFilterText={setFilterText} />
                            
                            

    
                        </div>
                        <DataTableIndex columns={columns} data={filteredData} />
                    </>
                ) : (
                    <>

                    <div className="form-wrapper">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                            }}
                            className="space-y-4"
                        >   
                            <div className="header-edicion">
                                <div className='center-left'>
                                    <ButtonAccion onClick={volverAlListado}>Atrás</ButtonAccion>
                                    <button className="delete-button ml-10" onClick={() => setvisibleEliminar(true)}>
                                        Eliminar Contenido
                                    </button>
                                </div>
                            </div>
                            <div className="campo mt-20">
                                <label className="label">Unidad</label>
                                <Select
                                    instanceId="unidad-select"
                                    options={dataUnidades}
                                    placeholder="Selecciona una unidad..."
                                    value={unidadSeleccionadaEditar}
                                    onChange={setUnidadSeleccionadaEditar}
                                    styles={customStyles}
                                    isClearable
                                />
                                
                            </div>
                            <InputField label="Nombre" value={nombre} onChange={setNombre} placeholder="Nombre de la unidad" required />
                            <EditarContenido descripcion={descripcion} setDescripcion={setDescripcion}/>
                            <div className="center">
                                <ButtonSave onClick={() => editar_contenido()} className="mt-10" classFather="center" >
                                    Guardar
                                </ButtonSave>
                                <ButtonSave
                                    bgColor="#d5dbdb"
                                    hoverColor="#bfc9ca"
                                    className="mt-10 ml-10"
                                    onClick={() => volverAlListado()}
                                    >
                                    Regresar
                                </ButtonSave>
                            </div>
                        </form>
                    </div>
                    <ModalField 
                        visible={visibleEliminar} 
                        cerrarModal={() => setvisibleEliminar(false)}
                        onclick={() => soft_delete()}
                        width={"700"}
                        height={"100"}
                        title={"¿Estas seguro?"}
                        mensaje={
                            <>
                                ¿Estás seguro que deseas eliminar este contenido? <br /><br />
                            </>
                        }
                    />
                    </>
                )}
            </div>
        </Componente>
    );
}

const InputField = ({ label, type = "text", value, onChange, placeholder, required = false }) => (
	<div className="form-group">
		<label className="form-label mt-10">{label}</label>
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


InputField.propTypes = {
	label: PropTypes.string.isRequired,
	type: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	required: PropTypes.bool
};

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

TextAreaField.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	required: PropTypes.bool
};

const Componente = styled.div`

    .delete-button {
		background: linear-gradient(135deg, #0465ac, #039be5);
		color: #fff;
		padding: 10px 16px;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: background 0.3s;
		margin-right: 10px;
	}

    .delete-button {
		background: #e53935;
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
