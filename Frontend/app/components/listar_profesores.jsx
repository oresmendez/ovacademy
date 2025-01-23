'use client';
import { apiRest, toast, useState, useEffect, export_file, useRouter } from '@/app/utils/hooks';
import { styled } from '@/app/utils/hooks';
import DataTable_index from '@/app/components/dataTable_index';
import Registrar_profesor from '@/app/components/registrar_profesor';

export default function ListarProfesores() {
    const [data, setData] = useState([]);
    const [deleteTrigger, setDeleteTrigger] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [editRowId, setEditRowId] = useState(null);
    const [editRowData, setEditRowData] = useState({});
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiRest.fetchGet('http://localhost:3333/ovacademy/user?type_id=2');
                if (response.status === 200) {
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
        fetchData();
    }, [deleteTrigger]);

    const filteredData = data.filter(
        (item) =>
            (item.email?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.name?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.surname?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.phone?.toLowerCase() || '').includes(filterText.toLowerCase())
    );

    // Handlers
    const handleEditClick = (row) => {
        setEditRowId(row.email);
        setEditRowData(row);
    };

    const handleInputChange = (e, field) => {
        setEditRowData({
            ...editRowData,
            [field]: e.target.value,
        });
    };

    const handleVer = async (id) => {
    
        router.push(`/ovacademy/teacher/user/${id}`);
    };

    const handleDeleteClick = async (email) => {
        try {
            const response = await apiRest.fetchDelete('http://localhost:3333/ovacademy/user', { email });
            console.log(response);
            if (response.status === 200) {
                toast.success('Usuario Actualizado Exitosamente');
                setDeleteTrigger((prev) => !prev); // Trigger re-fetch
            } else {
                toast.error('Ocurrió un error');
            }
        } catch (err) {
            console.log(err);
            toast.error('Error al conectar con el servidor.');
        }
    };

    const handleSaveClick = async () => {
        try {
            const response = await apiRest.fetchPut(`http://localhost:3333/ovacademy/user`, editRowData);
            if (response.status === 200) {
                toast.success('Los datos se actualizaron correctamente.');
                setEditRowId(null);
                setDeleteTrigger((prev) => !prev); // Trigger re-fetch
            } else {
                toast.error('Error al actualizar los datos.');
                console.error('Error en la respuesta del servidor:', response);
            }
        } catch (err) {
            toast.error('Hubo un error al guardar los datos.');
            console.error('Error al guardar los datos:', err);
        }
    };

    const exportToPDF = () => {
        const name = 'profesores.pdf';
        const title = 'Listado de Profesores';
        const head = [['Correo Electrónico', 'Nombre', 'Apellido', 'Teléfono', 'Estado']];
        const tableRows = filteredData.map((row) => [
            row.email,
            row.name,
            row.surname,
            row.phone,
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
        {   name: 'Correo Electrónico', 
            selector: (row) => row.email || 'N/A', 
            sortable: true, 
            grow: 2.2 
        },
        {
            name: 'Nombre',
            selector: (row) =>
                row.email === editRowId ? (
                    <input
                        type="text"
                        value={editRowData.name || ''}
                        onChange={(e) => handleInputChange(e, 'name')}
                        className='label-row p-05'
                    />
                ) : (
                    row.name || 'N/A'
                ),
            sortable: true,
            grow: 2
        },
        {
            name: 'Apellido',
            selector: (row) =>
                row.email === editRowId ? (
                    <input
                        type="text"
                        value={editRowData.surname || ''}
                        onChange={(e) => handleInputChange(e, 'surname')}
                        className='label-row p-05'
                    />
                ) : (
                    row.surname || 'N/A'
                ),
            sortable: true,
            grow: 2
        },
        {
            name: 'Teléfono',
            selector: (row) =>
                row.email === editRowId ? (
                    <input
                        type="text"
                        value={editRowData.phone || ''}
                        onChange={(e) => handleInputChange(e, 'phone')}
                        className='label-row p-05'
                    />
                ) : (
                    row.phone || 'N/A'
                ),
            sortable: true,
        },
        {
            name: 'Estado',
            selector: (row) => (
                <button
                    onClick={() => handleDeleteClick(row.email)}
                    className='label-status-user'
                    style={{
                        backgroundColor: row.statusLogico ? '#ff717f' : '#28a745',
                    }}
                >
                    {row.statusLogico ? 'Deshabilitar' : 'Habilitar'}
                </button>
            ),
            sortable: true,
            grow: 1,
        },
        {
            name: '',
            grow: 2,
            cell: (row) =>
                row.email === editRowId ? (
                    <>
                        <button onClick={handleSaveClick} style={{ marginRight: '0.5rem', color: 'green' }}>Guardar</button>
                        <button onClick={() => setEditRowId(null)} style={{ color: 'red' }}>Cancelar</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => handleEditClick(row)} style={{ marginRight: '0.5rem', color: 'blue' }}>Editar</button>
                        <button onClick={() => handleVer(row.id)} style={{ color: 'green' }}>Ver</button>
                    </>
                ),
        },
    ];

    const [visible, setVisible] = useState(false);
    const openModal_teacher = () => setVisible(true);
    const closeModal_teacher = () => {
        setVisible(false);
        setDeleteTrigger((prev) => !prev); // Actualizar el trigger al cerrar el modal
    };

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
                    <button className='btn-export btn-register-teacher mr-05' onClick={openModal_teacher}>Crear Profesor</button>
                    <button className='btn-export btn-pdf mr-05' onClick={exportToPDF}>Exportar a PDF</button>
                    <button className='btn-export btn-excel' onClick={exportToExcel}>Exportar a Excel</button>
                </div>
            </div>
            <DataTable_index columns={columns} data={filteredData} />
        </div>
        <Registrar_profesor modal_teacher={visible} closeModal_teacher={closeModal_teacher} />
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
    }

    .label-search{
        border: 1px solid #ddd;
        border-radius: 5px;
        width: 40%;
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
        background-color: #e74c3c;
    }

    .btn-excel{
        background-color: #27ae60;
    }


`;
