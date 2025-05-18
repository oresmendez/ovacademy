'use client'; import { useState, useEffect, ListarEvaluaciones, styled, PropTypes, utils, apiRest, toast, ButtonLabelEstatus, export_file, DataTableIndex, ButtonSave, ButtonAccion, InputSearch } from '@/app/components/utils/rutas';

export default function ListarUnidades() {
    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [unidadSeleccionada, setUnidadSeleccionada] = useState(1);

    const [mostrarEvaluaciones, setMostrarEvaluaciones] = useState(false);
    const [cerrandoEvaluaciones, setCerrandoEvaluaciones] = useState(false);

    const [idUnidad, setidUnidad] = useState("");
    const [modulo, setModulo] = useState("");
    const [nombre, setNombre] = useState("");
    const [nota_unidad, setNota_unidad] = useState("");
	const [descripcion, setDescripcion] = useState("");

    useEffect(() => {
        obtenerUnidades();
    }, []);

    const obtenerUnidades = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades/profesor`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                console.log(response.data.data)
                setData(response.data.data);
            } else {
                console.error('La respuesta de la API no contiene datos válidos.');
                setData([]);
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
            setData([]);
        }
    };

    const obtenerUnidadByID = async (id) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades/${id}`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                setidUnidad(response.data.data.id);
                setModulo(response.data.data.modulo);
                setNombre(response.data.data.nombre);
                setNota_unidad(response.data.data.notaUnidad);
                setDescripcion(response.data.data.descripcion);
                setUnidadSeleccionada(null);
            } else {
                console.error('La respuesta de la API no contiene datos válidos.');
                setData([]);
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
            setData([]);
        }
    };

    const filteredData = data.filter(
        (item) =>
            (item.nombre?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.modulo?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.descripcion?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.createdAt?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.updateAt?.toLowerCase() || '').includes(filterText.toLowerCase()) 
    );

    const volverAlListado = () => {
        setUnidadSeleccionada(1);
        setNombre('');
        setDescripcion('');
    };
    
    const editar_unidad = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades`
            const response = await apiRest.fetchPut(url, {
                id: idUnidad, 
                modulo,
                nombre,
                nota_unidad, 
                descripcion
            });

            if (response.status === 200) {
                obtenerUnidades();
                toast.success(response.data.message);
                volverAlListado();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error al editar una unidad.");
        }
    };
    
    const handleDeleteClick = async (id, modulo) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades/${id}`
            const response = await apiRest.fetchDelete(url);
            console.log(response);
            if (response.status === 200) {
                toast.success(`${modulo} actualizada`);
                setData((prevData) =>
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

    const exportToPDF = () => {
        const name = 'estudiantes.pdf';
        const title = 'Listado de Profesores';
        const head = [['Correo Electrónico', 'Nombre', 'Apellido' ,'Acceso', 'Estado']];
        const tableRows = filteredData.map((row) => [
            row.email,
            row.name,
            row.surname,
            row.habilitado ? 'Activo' : 'Inactivo',
            row.statusLogico ? 'Activo' : 'Inactivo',
        ]);
        export_file.exportToPDF(title, head, tableRows, name);
    };

    const exportToExcel = () => {
        const name = 'profesores.xlsx';
        const title = 'Profesores';
        export_file.exportToExcel(title, filteredData, name);
    };  

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
                if (row.notaUnidad == 0) return 'No disponible';
              
                const nota = parseFloat(row.notaUnidad);
                const texto = nota === 1 ? 'punto' : 'puntos';
                return `${nota} ${texto}`;
            },              
            sortable: true, 
            grow: 1.8 
        },
        {   name: 'Fecha Creación', 
            selector: (row) => utils.formatearFecha(row.createdAt) || 'No disponible', 
            sortable: true, 
            grow: 2 
        },
        {   name: 'Fecha Actualización', 
            selector: (row) => utils.formatearFecha(row.updateAt) || 'No disponible', 
            sortable: true, 
            grow: 2 
        },
        {
            name: 'Estado',
            selector: (row) => (
                <ButtonLabelEstatus
                    status_logico={row.status}
                    onClick={() => handleDeleteClick(row.id, row.modulo)}
                />
            ),
            sortable: true,
            grow: 1.2,
        },
        {
            name: 'Acción',
            grow: 1.5,
            cell: (row) => (
                <button onClick={() => obtenerUnidadByID(row.id)} style={{ color: '#0465ac' }}>Editar</button>
            ),
        }   
    ];

    let contenido;
    if (unidadSeleccionada) {
        contenido = (
            <>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="botones-exportar">
                        <ButtonAccion onClick={exportToPDF}>Exportar a PDF</ButtonAccion> 
                        <ButtonAccion onClick={exportToExcel}>Exportar a Excel</ButtonAccion> 
                        <ButtonAccion onClick={obtenerUnidades} loading={true}></ButtonAccion> 
                    </div>
                    <InputSearch filterText={filterText} setFilterText={setFilterText} />
                </div>
                <DataTableIndex columns={columns} data={filteredData} />
            </>
        );
    } else if (mostrarEvaluaciones) {
        contenido = (
            <ListarEvaluaciones
                idUnidad={idUnidad}
                modulo={modulo}
                setCerrandoEvaluaciones={setCerrandoEvaluaciones}
                setMostrarEvaluaciones={setMostrarEvaluaciones}
            />
        );
    } else {
        contenido = (
            <>
                <div className="header-edicion">
                    <ButtonAccion onClick={volverAlListado}>Atrás</ButtonAccion> 
                    <ButtonAccion onClick={() => setMostrarEvaluaciones(true)}>Evaluaciones</ButtonAccion> 
                </div>

                <div className="form-wrapper">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            editar_unidad();
                        }}
                        className="space-y-4"
                    >
                        <div className="form-row">
                            <div className="form-item">
                                <InputField
                                    label="Módulo"
                                    value={modulo}
                                    onChange={setModulo}
                                    placeholder="Módulo de la unidad"
                                    required
                                />
                            </div>
                            <div className="form-item nombre">
                                <InputField
                                    label="Nombre"
                                    value={nombre}
                                    onChange={setNombre}
                                    placeholder="Nombre de la unidad"
                                    required
                                />
                            </div>
                            <div className="form-item evaluativo">
                                <InputFieldNumber
                                    label="Valor Evaluativo"
                                    value={nota_unidad}
                                    onChange={setNota_unidad}
                                    placeholder="Valor evaluativo"
                                    required
                                />
                            </div>
                        </div>

                        <TextAreaField
                            label="Descripción"
                            value={descripcion}
                            onChange={setDescripcion}
                            placeholder="Descripción"
                            required
                        />
                        <ButtonSave type="submit" className="mt-20" classFather="center">
                            Guardar
                        </ButtonSave>

                    </form>
                </div>
            </>
        );
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
        margin-top: 1rem;
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

    @keyframes slideOut {
        from {
            transform: translateX(0%);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .slideIn {
        animation-name: slideIn;
    }

    .slideOut {
        animation-name: slideOut;
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
