'use client'; import { useState, useEffect, apiRest, toast, styled, export_file, Link, textBarHeader} from '@/app/utils/hooks';
import DataTable_index from '@/app/components/dataTable_index';


export default function ListarMaterias() {
    const [filterText, setFilterText] = useState('');
    const [data, setData] = useState([]);
    const { setHeaderText } = textBarHeader();

    useEffect(() => {

        const breadcrumbHTML = (
            <>
                <Link href={`/ovacademy/teacher/dashboard`}>Dashboard</Link>{" "}
                <span className='separator'>&gt; </span>
                Materia
            </>
        );

        setHeaderText(breadcrumbHTML);

        const fetchData = async () => {
            try {

                const [r_listadoMaterias] = await Promise.all([
                    apiRest.fetchPost('http://localhost:3333/ovacademy/subject/unidades/obtenerTodasLasUnidades', { id: 1 }),
                ]);

                setData(r_listadoMaterias.data);

            } catch (err) {
                console.error('Error al conectar con el servidor:', err);
            }
        };
        fetchData();
    
    }, []);
    
    const [editRowId, setEditRowId] = useState(null);
    const [editRowData, setEditRowData] = useState({});

    const filteredData = data.filter(
        (item) =>
            (item.nombre?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.descripcion?.toLowerCase() || '').includes(filterText.toLowerCase())
    );
    

    const handleEditClick = (row) => {
        setEditRowId(row.id);
        setEditRowData(row);
    };

    const handleSaveClick = async () => {
        setData((prevData) =>
            prevData.map((item) =>
                item.id === editRowId ? editRowData : item
            )
        );

        const response = await apiRest.fetchPut('http://localhost:3333/ovacademy/subject/unidades', editRowData);
        
        if (response.status === 200) {
            toast.success('Unidad Actualizada exitosamente');
        } else {
            toast.error(response.data.message || 'Error al guardar los datos');
        }
        setEditRowId(null);
    };

    const handleDeleteClick = (id) => {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
        console.log('Elemento eliminado con ID:', id);
    };

    const handleInputChange = (e, field) => {
        setEditRowData({
            ...editRowData,
            [field]: e.target.value,
        });
    };

    const exportToPDF = () => {
        const name = 'materias.pdf';
        const title = 'Listado de Materias';
        const head = [['ID', 'Nombre', 'Descripción']]
        const tableRows = filteredData.map((row) => [row.id, row.nombre, row.descripcion]);
        export_file.exportToPDF(title, head, tableRows, name);
    };

    const exportToExcel = () => {
        const name = 'materias.xlsx';
        const title = 'Materias';
        export_file.exportToExcel(title, filteredData, name);
    };

    const columns = [
        {
            name: 'Nombre de la Unidad',
            selector: (row) =>
                row.id === editRowId ? (
                    <input
                        type="text"
                        value={editRowData.nombre || ''}
                        onChange={(e) => handleInputChange(e, 'nombre')}
                        className='label-row p-05'
                    />
                    
                ) : (
                    <div
                        style={{
                            whiteSpace: 'normal',
                            wordWrap: 'break-word',
                            fontSize: '1rem',
                        }}
                    >
                        {row.nombre || 'N/A'}
                    </div>
                ),
            sortable: true,
            grow: 2, // Más espacio proporcional que otras columnas
            
        },
        {
            name: 'Descripción',
            grow: 5,
            selector: (row) =>
                row.id === editRowId ? (
                    <input
                        type="text"
                        value={editRowData.descripcion || ''}
                        onChange={(e) => handleInputChange(e, 'descripcion')}
                        className='label-row p-05'
                    />
                ) : (
                    <div
                        style={{
                            whiteSpace: 'normal',
                            wordWrap: 'break-word',
                            fontSize: '1rem',
                        }}
                    >
                        {row.descripcion}
                    </div>
                ),
        },
        {
            name: 'Acciones',
            grow: 1, // Más espacio proporcional que otras columnas
            cell: (row) =>
                row.id === editRowId ? (
                    <>
                        <button onClick={handleSaveClick} style={{ marginRight: '0.5rem', color: 'green' }}>
                            Guardar
                        </button>
                        <button onClick={() => setEditRowId(null)} style={{ color: 'red' }}>
                            Cancelar
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => handleEditClick(row)} style={{ marginRight: '0.5rem', color: 'blue' }}>
                            Editar
                        </button>
                        <button onClick={() => handleDeleteClick(row.id)} style={{ color: 'red' }}>
                            Eliminar
                        </button>
                    </>
                ),
        },
    ];
    
    

    return (
        <Componente>
        <div style={{ padding: '1rem', fontFamily: 'Lexend Deca, sans-serif' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className='label-search p-05'
                />
                <div>
                    <button className='btn-export btn-pdf mr-05' onClick={exportToPDF}>Exportar a PDF</button>
                    <button className='btn-export btn-excel' onClick={exportToExcel}>Exportar a Excel</button>
                </div>
            </div>
            <DataTable_index columns={columns} data={filteredData} />
        </div>
        </Componente>
    );
}

const Componente = styled.div`
    
    div[data-tag="allowRowEvents"] {
        width: 100%
    }

    .label-row{
        border-radius: 5px;
        width: 100%;
        box-sizing: border-box;
    }

    .label-search{
        border: 1px solid #ddd;
        border-radius: 5px;
        width: 40%;
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
        background-color: #e74c3c;
    }

    .btn-excel{
        background-color: #27ae60;
    }


`;