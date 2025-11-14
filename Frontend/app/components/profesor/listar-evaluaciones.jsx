"use client";

import { styled, apiRest, useState, useEffect, DataTableIndex, utils, CrearSopaDeLetras, CrearCuestionario, CrearPreguntasAbiertas, ButtonLabelEstatus, ModalField, toast, PropTypes, ButtonAccion } from '@/app/components/utils/rutas';
import { TbEyeEdit } from "react-icons/tb";
import { FaRegTrashAlt } from "react-icons/fa";

export default function ListarEvaluaciones({ idUnidad, modulo, setCerrandoEvaluaciones, setMostrarEvaluaciones }) {

    ListarEvaluaciones.propTypes = {
        idUnidad: PropTypes.string,
        modulo: PropTypes.string,
        setCerrandoEvaluaciones: PropTypes.string,
        setMostrarEvaluaciones: PropTypes.string,
    };

    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [typesEvaluaciones, setTypesEvaluaciones] = useState([]);
    const puntosTotales = data.reduce((total, evaluacion) => total + parseFloat(evaluacion.notaEvaluacion || 0), 0);
    const puntosTotalesRedondeado = Math.round(puntosTotales * 10) / 10;

    const [visibleEliminar, setvisibleEliminar] = useState(false);

    const [idEvaluacionSeleccionada, setIdEvaluacionSeleccionada] = useState(null);
    const [idEvaluacionAEliminar, setIdEvaluacionAEliminar] = useState(null);
    const [cerrandoEvaluaciones, setCerrandoEvaluacionesLocal] = useState(false);
    const [typeEvaluacionSeleccionada, setTypeEvaluacionSeleccionada] = useState(null);

    useEffect(() => {
        recargar();
    }, []);

    const recargar = async () => {
        obtener_evaluaciones();
        obtenerTypeEvaluaciones();
    };

    const obtener_evaluaciones = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/${idUnidad}/false`
            const response = await apiRest.fetchGet(url);
            console.log(response)
            if (response.status === 200) {
                setData(response.data);
            } else {
                // console.error('La respuesta de la API no contiene datos válidos.');
                setData([]);
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
            setData([]);
        }
    };

    const obtenerTypeEvaluaciones = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/TypeEvaluaciones`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                setTypesEvaluaciones(response.data.data);
            } else {
                // console.error('La respuesta de la API no contiene datos válidos.');
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
        }
    };

    const soft_delete = async () => {
		try {
		setvisibleEliminar(false)
		const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/delete/${idEvaluacionAEliminar}`;
		const response = await apiRest.fetchDelete(url);
		if (response.status === 200) {
			toast.success(response.data.message);
            recargar();
		} else {
			console.error(response.data.message);
		}
		} catch (err) {
		    console.error('Error al eliminar la evaluacion.');
		}
	};

    const handleDeleteClick = async (id) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones`
            const response = await apiRest.fetchDelete(url, { id });

            if (response.status === 200) {
                toast.success(`Evaluación actualizada`);
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

    const filteredData = data.filter(
        (item) =>
            (item.id?.toString().toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.idUnidad?.toString().toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.typeId?.toString().toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.notaEvaluacion?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.status?.toString().toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.createdAt?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.updateAt?.toLowerCase() || '').includes(filterText.toLowerCase())
    );

    const handleCerrar = () => {
        setCerrandoEvaluaciones(true);
        setCerrandoEvaluacionesLocal(true);
        setTimeout(() => {
            setMostrarEvaluaciones(false);
            setCerrandoEvaluaciones(false);
            setCerrandoEvaluacionesLocal(false);
        }, 400);
    };

    // Función para editar una evaluación
    const obtener_details_evaluaciones = (id, typeId) => {
        setIdEvaluacionSeleccionada(id);
        setTypeEvaluacionSeleccionada(typeId); // Almacenar el tipo de evaluación
    };

    // Función para volver atrás
    const handleVolver = () => {
        setIdEvaluacionSeleccionada(null);
        setTypeEvaluacionSeleccionada(null); // Limpiar el tipo de evaluación cuando se vuelve
    };

    const columns = [
        {
            name: 'Módulo',
            selector: () => modulo || 'No disponible',
            sortable: true,
            grow: 1
        },
        {
            name: 'Evaluación',
            grow: 2.5,
            selector: (row) => {
                const tipo = typesEvaluaciones.find((t) => t.id === row.typeId);
                return tipo ? tipo.type : 'No disponible';
            },
            sortable: true,
        },
        {
            name: 'Nota Evaluación',
            selector: (row) => {
                if (row.notaEvaluacion == 0) return 'No disponible';
                const nota = parseFloat(row.notaEvaluacion);
                const texto = nota === 1 ? 'punto' : 'puntos';
                return `${nota} ${texto}`;
            },
            sortable: true,
            grow: 1.8
        },
        {
            name: 'Fecha Creación',
            selector: (row) => utils.formatearFecha(row.createdAt) || 'No disponible',
            sortable: true,
            grow: 2
        },
        {
            name: 'Fecha Actualización',
            selector: (row) => utils.formatearFecha(row.updateAt) || 'No disponible',
            sortable: true,
            grow: 2
        },
        {
            name: 'Estado',
            selector: (row) => (
                <ButtonLabelEstatus
                    status_logico={row.status}
                    onClick={() => handleDeleteClick(row.id)}
                />
            ),
            sortable: true,
            grow: 1.2,
        },    
        {
        name: 'Acción',
        grow: 1,
        cell: (row) => (
            <div style={{ display: 'flex', gap: '8px' }}>
            <button className='ml-02'
                onClick={() => obtener_details_evaluaciones(row.id, row.typeId)}
                style={{ color: '#0465ac', background: 'none', border: 'none', cursor: 'pointer' }}
                title="Ver/Editar"
            >
                <TbEyeEdit size={24} />
            </button>
            <button className='ml-05'
                onClick={() => {
                    setIdEvaluacionAEliminar(row.id); 
                    setvisibleEliminar(true);            
                }}
                style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                title="Eliminar Evaluación"
            >
                <FaRegTrashAlt size={22} />
            </button>
            </div>
        ),
}

    ];
    

    return (
        <Container>
            <div className={`slide-panel ${cerrandoEvaluaciones ? '' : ''}`}>
                {
                    idEvaluacionSeleccionada ? (
                        <>
                            <div className='center-left'>
                                <ButtonAccion onClick={handleVolver}>Atrás</ButtonAccion>
                            </div>
                            {typeEvaluacionSeleccionada === 1 ? (
                                <CrearSopaDeLetras idEvaluacion={idEvaluacionSeleccionada} handleVolver={handleVolver}/>
                            ) 
                            : typeEvaluacionSeleccionada === 2 ? (
                                <CrearCuestionario idEvaluacion={idEvaluacionSeleccionada} handleVolver={handleVolver}/>
                            ) 
                            :   typeEvaluacionSeleccionada === 3 ? (
                                <CrearPreguntasAbiertas idEvaluacion={idEvaluacionSeleccionada} handleVolver={handleVolver}/>
                            )
                            :
                            (
                                <p>Tipo de evaluación no soportado.</p>
                            )
                            }
                        </>
                    ) : (
                        <>
                        <div className='center-left'>
                            <ButtonAccion onClick={handleCerrar}>Atrás</ButtonAccion>
                            <ButtonAccion onClick={recargar} loading={true} className="ml-05"></ButtonAccion>
                            <div className="total-puntos ml-20">
                                <strong className=''>Total puntos: {puntosTotalesRedondeado}</strong>
                            </div>
                        </div>
                            <DataTableIndex columns={columns} data={filteredData} />
                        <ModalField 
                            visible={visibleEliminar} 
                            cerrarModal={() => setvisibleEliminar(false)}
                            onclick={() => soft_delete()}
                            width={"700"}
                            height={"100"}
                            title={"¿Estas seguro?"}
                            mensaje={
                                <>
                                    ¿Estás seguro que deseas eliminar esta evaluación? <br /><br />
                                </>
                            }
                        />
                        </>
                    )
                }
            </div>
        </Container>
    );
}

const Container = styled.div`
.total-puntos {
    background-color: #0465ac;
    color: white;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    margin-right: 20px;
    white-space: nowrap;
  }
`;


  