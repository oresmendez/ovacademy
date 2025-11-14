'use client'; import { styled, apiRest, toast, useState, useEffect, export_file, useRouter, DataTableIndex, ButtonAccion, InputSearch, Spinner, MessageError } from '@/app/components/utils/rutas';
import { TbEyeEdit } from "react-icons/tb";

export default function ListarProfesores() {

    const [showSpinner, setShowSpinner] = useState(false);
	const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);

    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [editRowId, setEditRowId] = useState(null);
    const [editRowData, setEditRowData] = useState({});
    const router = useRouter();

    useEffect(() => {
        obtenerProfesores();
    }, []);

    const obtenerProfesores = async () => {
        
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/user?type_id=2`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                setData(response.data.data);
            } else {
                setData([]);
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
            setData([]);
        }finally { clearTimeout(timeout); setShowSpinner(false);setIsLoadingRespuestas(false);}
    };

    const filteredData = data.filter(
        (item) =>
            (item.email?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.name?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.surname?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.phone?.toLowerCase() || '').includes(filterText.toLowerCase())
    );

    const handleInputChange = (e, field) => {
        setEditRowData({
            ...editRowData,
            [field]: e.target.value,
        });
    };

    const handleVer = async (email) => {
        setShowSpinner(true)
        router.push(`/ovacademy/administrador/profesores/${email}`);
    };

    const handleDeleteClick = async (email) => {
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/user`;
            const response = await apiRest.fetchDelete(url, { email });
    
            if (response.status === 200) {
                let nuevoEstado;
                setData((prevData) =>
                    prevData.map((item) => {
                        if (item.email === email) {
                            nuevoEstado = !item.status_logico;
                            return { ...item, status_logico: nuevoEstado };
                        }
                        return item;
                    })
                );
    
                toast.info(
                    <span>
                      Profesor <strong>{email}</strong>{' '}
                      <span style={{ color: nuevoEstado ? 'blue' : 'red' }}>
                        {nuevoEstado ? 'habilitado' : 'inhabilitado'}
                      </span>
                    </span>
                  );
                  
            } else {
                toast.error('Ocurrió un error');
            }
        } catch (err) {
            console.log(err);
            toast.error('Error al conectar con el servidor.');
        }finally { clearTimeout(timeout); setShowSpinner(false);}
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
            row.status_logico ? 'Activo' : 'Inactivo',
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
            selector: (row) => row.email || 'No disponible', 
            sortable: true, 
            grow: 2.2 
        },
        {   name: 'Nombre', 
            selector: (row) => row.name || 'No disponible', 
            sortable: true, 
            grow: 2.2 
        },
        {   name: 'Apellido', 
            selector: (row) => row.surname || 'No disponible', 
            sortable: true, 
            grow: 2.2 
        },
        {
            name: 'Estado',
            selector: (row) => (
                <button
                    onClick={() => handleDeleteClick(row.email)}
                    className={`label-status-user ${row.status_logico ? 'activo' : 'inactivo'}`}
                    style={{
                        backgroundColor: row.status_logico ? '#0465ac' : '#ebebeb',
                    }}
                >
                    {row.status_logico ? 'Activo' : 'Inactivo'}
                </button>
            ),            
            sortable: true,
            grow: 1.2,
        },
        {
            name: '',
            grow: 0.5,
            cell: (row) => (
                <>
                    <button onClick={() => handleVer(row.email)} style={{ color: '#0465ac' }}><TbEyeEdit  size={28}/></button>
                </>
            ),
        }        
    ];

    let contenido;

    if (showSpinner || isLoadingRespuestas) {
        contenido = <Spinner show={showSpinner} />;
    } else {
        contenido = (
            <Componente>
                {
                    data.length === 0 ? (
                        <MessageError message={"No se encuentran profesores matriculados para esta materia"}/>
                    ) : (
                        <div style={{ padding: '1rem', fontFamily: 'Lexend Deca, sans-serif' }}>
                            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div className="botones-exportar">
                                    <ButtonAccion onClick={exportToPDF}>Exportar a PDF</ButtonAccion> 
                                    <ButtonAccion onClick={exportToExcel}>Exportar a Excel</ButtonAccion> 
                                    <ButtonAccion onClick={obtenerProfesores} loading={true} ></ButtonAccion> 
                                </div>
                                <InputSearch filterText={filterText} setFilterText={setFilterText} />
                            </div>
                            <DataTableIndex columns={columns} data={filteredData} />
                        </div>
                    )
                }
                
            </Componente>
        );
    }

	return contenido;
}

const Componente = styled.div`

    div[data-tag="allowRowEvents"] {
        width: 100%
    }
    
    .label-row{
        border-radius: 5px;
        width: 100%;
    }

    .label-status-user {
        border-radius: 5px;
        padding: 5px 10px;
    }

    .label-status-user.activo {
        color: white;
    }

    .label-status-user.inactivo {
        color: black;
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


`;
