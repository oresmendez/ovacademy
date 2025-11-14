'use client'; import { useState, useEffect, ListarEvaluaciones, styled, PropTypes, utils, apiRest,ModalField , toast, ButtonLabelEstatus, export_file, DataTableIndex, ButtonSave, ButtonAccion, InputSearch } from '@/app/components/utils/rutas';
import { TbEyeEdit } from "react-icons/tb";

export default function ListarUnidades() {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(true);
  const [mostrarEvaluaciones, setMostrarEvaluaciones] = useState(false);

  const [visible, setVisible] = useState(false);
  const [visibleEliminar, setvisibleEliminar] = useState(false);
  const [formValues, setFormValues] = useState(null);

  const puntosTotales = data.reduce((total, unidad) => total + parseFloat(unidad.notaUnidad || 0), 0);


  const [unidad, setUnidad] = useState({
    id: '',
    modulo: '',
    nombre: '',
    nota_unidad: '',
    descripcion: ''
  });

  useEffect(() => {
    obtenerUnidades();
  }, []);

	const obtenerUnidades = async () => {
		try {
			const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades/profesor`;
			const response = await apiRest.fetchGet(url);
			if (response.status === 200) {
				setData(response.data.data);
			}
		
		} catch (err) {
			console.error('Error al conectar con el servidor.');
		}
	};

	const obtenerUnidadByID = async (id) => {
		try {
		const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades/${id}`;
		const response = await apiRest.fetchGet(url);
		if (response.status === 200) {
			const u = response.data.data;
			setUnidad({
			id: u.id,
			modulo: u.modulo,
			nombre: u.nombre,
			nota_unidad: u.notaUnidad,
			descripcion: u.descripcion
			});
			setUnidadSeleccionada(false);
		} else {
			console.error('No se pudo obtener la unidad.');
		}
		} catch (err) {
		console.error('Error de conexión al cargar unidad.');
		}
	};

	const editarUnidad = async () => {
		try {
		const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades`;
		const response = await apiRest.fetchPut(url, {
			id: unidad.id,
			modulo: unidad.modulo,
			nombre: unidad.nombre,
			nota_unidad: unidad.nota_unidad,
			descripcion: unidad.descripcion,
		});
		setVisible(false);
		if (response.status === 200) {
			toast.success(response.data.message);
			obtenerUnidades();
			volverAlListado();
		} else {
			console.error(response.data.message);
		}
		} catch (err) {
		console.error('Error al actualizar la unidad.');
		}
	};

	const soft_delete = async () => {
		try {
		setvisibleEliminar(false)
		const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades/delete/${unidad.id}`;
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

	const volverAlListado = () => {
		setUnidadSeleccionada(true);
		setUnidad({
		id: '',
		modulo: '',
		nombre: '',
		nota_unidad: '',
		descripcion: ''
		});
	};

	const handleDeleteClick = async (id, modulo) => {
		try {
		const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades/${id}`;
		const response = await apiRest.fetchDelete(url);
		if (response.status === 200) {
			toast.success(`${modulo} actualizada`);
			setData((prev) =>
			prev.map((item) => (item.id === id ? { ...item, status: !item.status } : item))
			);
		} else {
			console.error('No se pudo actualizar el estado.');
		}
		} catch (err) {
		console.error('Error de conexión al cambiar estado.');
		}
	};

	const exportToPDF = () => {
		const name = 'unidades.pdf';
		const title = 'Listado de Unidades';
		const head = [['Módulo', 'Nombre', 'Valor Evaluativo', 'Descripción']];
		const rows = data.map((row) => [row.modulo, row.nombre, row.notaUnidad, row.descripcion]);
		export_file.exportToPDF(title, head, rows, name);
	};

  const exportToExcel = () => {
    export_file.exportToExcel('Unidades', data, 'unidades.xlsx');
  };

  const filteredData = data.filter((item) =>
    [item.nombre, item.modulo, item.descripcion].some((val) =>
      (val || '').toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const columns = [
    { name: 'Módulo', grow: 1,selector: (row) => row.modulo, sortable: true },
    { name: 'Nombre', grow: 2, selector: (row) => row.nombre, sortable: true },
    {
      name: 'Nota Unidad',
      grow: 1,
      selector: (row) => {
        const n = parseFloat(row.notaUnidad);
        return n ? `${n} ${n === 1 ? 'punto' : 'puntos'}` : 'No disponible';
      },
      sortable: true,
    },
    { name: 'Fecha Creación', selector: (row) => utils.formatearFecha(row.createdAt), sortable: true },
    { name: 'Actualización', selector: (row) => utils.formatearFecha(row.updateAt), sortable: true },
    {
      name: 'Estado',
      grow: 0.5,
      selector: (row) => (
        <ButtonLabelEstatus
          status_logico={row.status}
          onClick={() => handleDeleteClick(row.id, row.modulo)}
        />
      ),
    },
    {
      name: 'Acción',
      grow: 0.1,
      cell: (row) => (
        <button onClick={() => obtenerUnidadByID(row.id)} style={{ color: '#0465ac' }}>
          <TbEyeEdit  size={28}/>
        </button>
      ),
    },
  ];


  return (
    <Componente>
      <div style={{ padding: '1rem' }}>
        {unidadSeleccionada ? (
          <>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="botones-exportar">
                        <ButtonAccion onClick={exportToPDF}>Exportar a PDF</ButtonAccion> 
                        <ButtonAccion onClick={exportToExcel}>Exportar a Excel</ButtonAccion> 
                        <ButtonAccion onClick={obtenerUnidades} loading={true}></ButtonAccion> 
                    </div>
                    <div className='center'>
                      <div className="total-puntos">
                        <strong>Total puntos:</strong> {puntosTotales}
                      </div>

                      <InputSearch filterText={filterText} setFilterText={setFilterText} />
                    </div>
                </div>
            <DataTableIndex columns={columns} data={filteredData} />
          </>
        ) : mostrarEvaluaciones ? (
          <ListarEvaluaciones
            idUnidad={unidad.id}
            modulo={unidad.modulo}
            setCerrandoEvaluaciones={() => {}}
            setMostrarEvaluaciones={setMostrarEvaluaciones}
          />
        ) : (
          <>
            <div className="header-edicion">
                <div className='center'>
                    <ButtonAccion onClick={volverAlListado}>Atrás</ButtonAccion>
                    <button className="delete-button ml-10" onClick={() => setvisibleEliminar(true)}>
                        Eliminar Unidad
                    </button>
                </div>
              <ButtonAccion onClick={() => setMostrarEvaluaciones(true)}>Evaluaciones</ButtonAccion>
            </div>
            <div className="form-wrapper">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormValues(unidad);
                  setVisible(true);
                }}
                className="space-y-4"
              >
                <div className="form-row">
                  <div className="form-item">
                    <InputField
                      label="Módulo"
                      value={unidad.modulo}
                      onChange={(val) => setUnidad({ ...unidad, modulo: val })}
                      placeholder="Módulo de la unidad"
                      required
                    />
                  </div>
                  <div className="form-item nombre">
                    <InputField
                      label="Nombre"
                      value={unidad.nombre}
                      onChange={(val) => setUnidad({ ...unidad, nombre: val })}
                      placeholder="Nombre de la unidad"
                      required
                    />
                  </div>
                  <div className="form-item evaluativo">
                    <InputFieldNumber
                      label="Valor Evaluativo"
                      value={unidad.nota_unidad}
                      onChange={(val) => setUnidad({ ...unidad, nota_unidad: val })}
                      placeholder="Valor evaluativo"
                      required
                    />
                  </div>
                </div>
                <TextAreaField
                  label="Descripción"
                  value={unidad.descripcion}
                  onChange={(val) => setUnidad({ ...unidad, descripcion: val })}
                  placeholder="Descripción"
                  required
                />
                <div className="center">
                  <ButtonSave className="mt-20 mr-10" onClick={() => setVisible(true)}>Guardar</ButtonSave>
                  <ButtonSave
                    className="mt-20"
                    bgColor="#d5dbdb"
                    hoverColor="#bfc9ca"
                    onClick={() => volverAlListado()}
                  >
                    Cancelar
                  </ButtonSave>
                </div>
              </form>
              <ModalField
                visible={visible}
                cerrarModal={() => setVisible(false)}
                onclick={() => editarUnidad()}
                width={"700"}
                height={"100"}
                title={"¿Estás seguro?"}
                mensaje={
                  <>
                    ¿Deseas editar esta unidad? <br /><br />
                  </>
                }
              />
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
                        ¿Estás seguro que deseas eliminar esta unidad? <br /><br />
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

  .total-puntos {
    background-color: #0465ac;
    color: white;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    margin: 0px 20px;
    white-space: nowrap;
  }


    .delete-button {
      background: linear-gradient(135deg, #0465ac, #039be5);
      color: #fff;
      padding: 0.4rem 1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s;
      margin-right: 10px;
    }

    .delete-button {
		background: #e53935;
	}

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
