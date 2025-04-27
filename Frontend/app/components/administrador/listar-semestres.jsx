'use client'; import { styled, apiRest, toast, useState, useEffect, export_file, useRouter, DataTableIndex, ModalField } from '@/app/components/utils/rutas';


export default function ListarSemestre_() {

    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState('');

    const [visible, setVisible] = useState(false);
    const abrirModal = (idAula) => {
        setVisible(true);
    };
    const cerrarModal = () => setVisible(false);

    useEffect(() => {
        ObtenerSemestres();
    }, []);

    const ObtenerSemestres = async () => {
        try {
            const response = await apiRest.fetchGet('http://localhost:3333/ovacademy/semestre');
            
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

    const filteredData = data.filter(
        (item) =>
            (item.id?.toString() || '').includes(filterText.toLowerCase()) ||
            (item.nombre?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.dateStart?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.dateEnd?.toLowerCase() || '').includes(filterText.toLowerCase())
    );
    
    const columns = [
        {   name: 'Semestre', 
            selector: (row) => row.nombre || 'No disponible', 
            sortable: true, 
            grow: 2.2 
        },
        {   name: 'Fecha Inicio', 
            selector: (row) => row.dateStart || 'No disponible', 
            sortable: true, 
            grow: 2.2 
        },
        {   name: 'Fecha Fin', 
            selector: (row) => row.dateEnd || 'No disponible', 
            sortable: true, 
            grow: 2.2 
        },
        {
            name: 'Estatus',
            selector: (row) => (
                row.active ? (
                    <button
                        onClick={() => {
                            abrirModal(row.id);
                        }}
                        className={`label-status-user activo`}
                        style={{
                            backgroundColor: 'darkred',
                        }}
                    >
                        Culminar semestre
                    </button>
                ) : (
                    <span className="label-status-user inactivo" style={{ backgroundColor: '#0465ac' }}>
                        Culminado
                    </span>
                )
            ),            
            sortable: true,
            grow: 1.2,
        }
               
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
                    {/* <div>
                        <button className='btn-export btn-pdf mr-05' onClick={exportToPDF}>Exportar a PDF</button>
                        <button className='btn-export btn-excel' onClick={exportToExcel}>Exportar a Excel</button>
                    </div> */}
                </div>
                <DataTableIndex columns={columns} data={filteredData} />
            </div>
            <ModalField 
                visible={visible} 
                cerrarModal={cerrarModal} 
                onclick={ObtenerSemestres}
                width={"700"}
                height={"300"}
                title={"¿Estas seguro?"}
                mensaje={
                    <>
                        ¿Estás seguro que deseas terminar este semestre?  <br /><br />
                    </>
                }
            />
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
    .label-status-user {
        border-radius: 5px;
        padding: 5px 10px;
        display: inline-block;
        text-align: center;
    }

    .label-status-user.activo {
        color: white;
        background-color: #ebebeb;
        border: none;
    }

    .label-status-user.inactivo {
        color: white;
        background-color: #0465ac;
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
