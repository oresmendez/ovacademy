"use client";

import { styled, apiRest, useState, useEffect, DataTableIndex, utils, CrearSopaDeLetras, CrearCuestionario, PropTypes } from '@/app/components/utils/rutas';

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
    
    const [idEvaluacionSeleccionada, setIdEvaluacionSeleccionada] = useState(null);
    const [cerrandoEvaluaciones, setCerrandoEvaluacionesLocal] = useState(false);
    const [typeEvaluacionSeleccionada, setTypeEvaluacionSeleccionada] = useState(null);

    useEffect(() => {
        obtener_evaluaciones();
        obtenerTypeEvaluaciones();
    }, []);

    const obtener_evaluaciones = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/${idUnidad}`
            const response = await apiRest.fetchGet(url);
            console.log(response)
            if (response.status === 200) {
                setData(response.data);
            } else {
                console.error('La respuesta de la API no contiene datos válidos.');
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
                console.error('La respuesta de la API no contiene datos válidos.');
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
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
            name: '',
            grow: 1,
            cell: (row) => (
                <button onClick={() => obtener_details_evaluaciones(row.id, row.typeId)} style={{ color: '#0465ac' }}>
                    editar
                </button>
            ),
        }
    ];
    

    return (
        <Container>
            <div className={`slide-panel ${cerrandoEvaluaciones ? 'slideOut' : 'slideIn'}`}>
                <div className="slide-header">
                    <h3>Evaluaciones de la unidad</h3>
                    <button onClick={handleCerrar} className="btn-cerrar">
                        Cerrar ✕
                    </button>
                </div>
                {
                    idEvaluacionSeleccionada ? (
                        <>
                            <button onClick={handleVolver} className="btn-volver" style={{ marginBottom: '10px' }}>
                                ← Volver a lista
                            </button>
                            {typeEvaluacionSeleccionada === 1 ? (
                                <CrearSopaDeLetras idEvaluacion={idEvaluacionSeleccionada} handleVolver={handleVolver}/>
                            ) 
                            : typeEvaluacionSeleccionada === 2 ? (
                                <CrearCuestionario idEvaluacion={idEvaluacionSeleccionada} handleVolver={handleVolver}/>
                            ) 
                            : (
                                <p>Tipo de evaluación no soportado.</p>
                            )}
                        </>
                    ) : (
                        <>
                            <p>Evaluaciones correspondientes a la unidad seleccionada.</p>
                            <DataTableIndex columns={columns} data={filteredData} />
                        </>
                    )
                }
            </div>
        </Container>
    );
}

const Container = styled.div`
  /* Aquí puedes aplicar estilos globales si los necesitas */
`;


  