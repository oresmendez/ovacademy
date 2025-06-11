'use client'; import { useState, useEffect, useRouter, styled, apiRest, toast,gestorCookie, export_file, DataTableIndex, ButtonAccion, InputSearch, ButtonLabelEstatus } from '@/app/components/utils/rutas';
import { TbEyeEdit } from "react-icons/tb";

export default function ListarEstudiantes() {

    const router = useRouter();
    
    const [typeUser, setTypeUser] = useState(0);
    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        obtenerEstudiantes();
    }, []);

    const obtenerEstudiantes = async () => {
        setTypeUser(await gestorCookie.get_one_element_cookie("user-data", "type"));
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/user?type_id=1`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                setData(response.data.data);
            } else {
                setData([]);
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
            setData([]);
        }
    };

    const handleVer = async (email) => {
        if (typeUser === 3) {
            router.push(`/ovacademy/administrador/estudiantes/${email}`);
        } else {
            router.push(`/ovacademy/profesor/estudiantes/${email}`);
        }
    };

    
    const handleDeleteClick = async (email) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/user`
            const response = await apiRest.fetchDelete(url, { email });
            if (response.status === 200) {
                toast.success(`Usuario ${email} actualizado`);
                setData((prevData) =>
                    prevData.map((item) =>
                        item.email === email ? { ...item, status_logico: !item.status_logico } : item
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
        const title = 'Listado de Estudiantes';
        const head = [['Correo Electrónico', 'Nombre', 'Apellido' ,'Acceso', 'Estado']];
        const tableRows = filteredData.map((row) => [
            row.email,
            row.name,
            row.surname,
            row.habilitado ? 'Activo' : 'Inactivo',
            row.status_logico ? 'Activo' : 'Inactivo',
        ]);
        export_file.exportToPDF(title, head, tableRows, name);
    };

    const exportToExcel = () => {
        const name = 'estudiantes.xlsx';
        const title = 'Estudiantes';
        export_file.exportToExcel(title, filteredData, name);
    };

    const filteredData = data.filter((item) => {
        const texto = filterText.toLowerCase();
    
        const email = item.email?.toLowerCase() || '';
        const name = item.name?.toLowerCase() || '';
        const surname = item.surname?.toLowerCase() || '';
        const estadoTexto = item.status_logico ? 'activo' : 'inactivo';
    
        return (
            email.includes(texto) ||
            name.includes(texto) ||
            surname.includes(texto) ||
            estadoTexto.includes(texto)
        );
    });
    

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
                <ButtonLabelEstatus
                    status_logico={row.status_logico}
                    onClick={() => handleDeleteClick(row.email)}
                />
            ),
            sortable: true,
            grow: 1.2,
        },        
        {
            name: 'Acción',
            grow: 1.5,
            cell: (row) => (
                <button onClick={() => handleVer(row.email)} style={{ color: '#0465ac' }}><TbEyeEdit  size={28}/></button>
            ),
        }
           
    ];

    return (
        <Componente>
        <div style={{ padding: '1rem', fontFamily: 'Lexend Deca, sans-serif' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="botones-exportar">
                <ButtonAccion onClick={exportToPDF}>Exportar a PDF</ButtonAccion> 
                <ButtonAccion onClick={exportToExcel}>Exportar a Excel</ButtonAccion> 
                <ButtonAccion onClick={obtenerEstudiantes} loading={true} ></ButtonAccion> 
            </div>
                <InputSearch filterText={filterText} setFilterText={setFilterText} />
            </div>
            <DataTableIndex columns={columns} data={filteredData} />
        </div>
        </Componente>
    );
}

const Componente = styled.div`
    
    .label-status-user{
        color: white;
        border-radius: 5px;
        padding: 5px 10px;  
    }

    

`;
