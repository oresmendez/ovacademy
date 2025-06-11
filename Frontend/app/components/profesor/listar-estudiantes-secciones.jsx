'use client';
import { useState, useEffect, styled, apiRest, toast, Select, export_file, DataTableIndex, ButtonAccion, InputSearch, ModalField, Spinner, MessageError } from '@/app/components/utils/rutas';

export default function ListarEstudiantes() {
    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [aulas, setAulas] = useState([]);
    const [detallesaula, setdetallesaula] = useState(true);
    const [aulaSeleccionada, setAulaSeleccionada] = useState(null);
    const [showSpinner, setShowSpinner] = useState(false);
    const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        obtenerAula();
    }, []);

    useEffect(() => {
        if (aulaSeleccionada) {
            obtenerEstudiantes(aulaSeleccionada.value);
        }
    }, [aulaSeleccionada]);

    const abrirModal = () => setVisible(true);
    const cerrarModal = () => setVisible(false);

    const recargarAulaSeleccionada = () => {
        if (aulaSeleccionada) {
            obtenerEstudiantes(aulaSeleccionada.value);
        }
    };

    const obtenerAula = async () => {
        let timeout;
        try {
            timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/aula/profesor`;
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                const aulasFormateadas = response.data.data.map((aulas) => ({
                    value: aulas.aulaId,
                    label: aulas.nombreAula
                }));
                if (aulasFormateadas.length > 0) {
                    const primeraAula = aulasFormateadas[0];
                    setAulaSeleccionada(primeraAula);
                }
                setAulas(aulasFormateadas);
            } else {
                console.error('La respuesta de la API no contiene datos válidos.');
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
        } finally {
            clearTimeout(timeout);
            setShowSpinner(false);
        }
    };

    const obtenerEstudiantes = async () => {
        let timeout;
        try {
            timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/aula/estudiantesByAula`;
            const response = await apiRest.fetchPost(url, {
                aulaId: aulaSeleccionada.value
            });
            if (response.status === 200) {
                const estudiantes = response.data.data;
                setData(estudiantes);
                console.log("Estudiantes obtenidos:", estudiantes);
                if (estudiantes.length === 0) {
                    toast.warn("No hay estudiantes matriculados para esta sección");
                }
            } else {
                setData([]);
            }
            obtener_detalles_aula(aulaSeleccionada.value);
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
            setData([]);
        } finally {
            clearTimeout(timeout);
            setShowSpinner(false);
        }
    };

    const obtener_detalles_aula = async (aula_id) => {
        let timeout;
        try {
            timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/aula/obtenerAulabyaulaID/${aula_id}`;
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                setdetallesaula(response.data.data.habilitado);
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
        } finally {
            clearTimeout(timeout);
            setShowSpinner(false);
            setIsLoadingRespuestas(false);
        }
    };

    const desmatricularEstudiante = async (id) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/aula/desmatricular/${id}`;
            const response = await apiRest.fetchDelete(url);
            if (response.status === 200) {
                obtenerEstudiantes(aulaSeleccionada.value);
                toast.success(`Estudiante Desmatriculado`);
            } else {
                toast.error('Ocurrió un error');
            }
        } catch (err) {
            console.log(err);
            toast.error('Error al conectar con el servidor.');
        }
    };

    const habilitar_desahbilitar_seccion = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/semestre/aula/${aulaSeleccionada.value}`;
            const response = await apiRest.fetchDelete(url);
            if (response.status === 200) {
                toast.success(`Sección Cerrada`);
                cerrarModal();
                obtenerAula();
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error('Error al conectar con el servidor.');
        }
    };

    const filteredData = (data || []).filter(
        (item) =>
            (item.email?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.name?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (item.surname?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
            (String(item.nota_final ?? '')).toLowerCase().includes(filterText.toLowerCase())
    );

    const exportToPDF = () => {
        const name = 'estudiantes.pdf';
        const title = 'Listado de estudiantes';
        const head = [['Correo Electrónico', 'Nombre', 'Apellido', 'Acceso', 'Estado']];
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

    const columnasBase = [
        { name: 'Correo Electrónico', selector: (row) => row.email || 'No disponible', sortable: true, grow: 2.8 },
        { name: 'Nombre', selector: (row) => row.name || 'No disponible', sortable: true, grow: 2.2, $center: true },
        { name: 'Apellido', selector: (row) => row.surname || 'No disponible', sortable: true, grow: 2.2, $center: true },
        {
            name: 'Nota Final',
            selector: (row) => row.nota_final == null ? 'pendiente' : parseFloat(row.nota_final).toFixed(2),
            sortable: true,
            grow: 1.6,
            $center: true
        },
        {
            name: 'Nota Redondeada',
            selector: (row) => row.nota_final == null ? 'pendiente' : Math.round(parseFloat(row.nota_final)),
            sortable: true,
            grow: 2.5,
            $center: true
        },
        {
            name: 'Estado académico',
            selector: (row) => {
                let status = '';
                let className = 'label ';
                if (row.nota_final == null) {
                    status = 'pendiente';
                } else if (row.nota_final < 5) {
                    status = 'reprobado';
                } else {
                    status = 'aprobado';
                }
                return <span className={className + status}>{status}</span>;
            },
            sortable: true,
            grow: 2.5,
            $center: true
        }
    ];

    const columnaAccion = {
        name: 'Acción',
        grow: 1.4,
        cell: (row) => (
            (row.nota_final == null) && (
                <button onClick={() => desmatricularEstudiante(row.id)} style={{ color: '#e02908' }}>
                    Desmatricular
                </button>
            )
        ),
    };

    let contenido;

    if (showSpinner || isLoadingRespuestas) {
        contenido = <Spinner show={showSpinner} />;
    } else {
        contenido = (
            <Componente>
                <div style={{ padding: '1rem', fontFamily: 'Lexend Deca, sans-serif' }}>
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ flexGrow: 1, minWidth: '200px' }}>
                                <Select
                                    options={aulas}
                                    placeholder="Selecciona..."
                                    value={aulaSeleccionada}
                                    onChange={setAulaSeleccionada}
                                    styles={customStyles}
                                    isClearable
                                />
                            </div>

                            {filteredData.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                    <ButtonAccion onClick={exportToPDF}>Exportar a PDF</ButtonAccion>
                                    <ButtonAccion onClick={exportToExcel}>Exportar a Excel</ButtonAccion>
                                    <ButtonAccion onClick={recargarAulaSeleccionada} loading={true} />
                                    <InputSearch filterText={filterText} setFilterText={setFilterText} />
                                </div>
                            )}

                            {detallesaula && (
                                <ButtonAccion color="#cb192a" onClick={abrirModal}>
                                    Cerrar Sección
                                </ButtonAccion>
                            )}
                        </div>
                    </div>

                    {aulaSeleccionada && data.length === 0 ? (
                        <div style={{ color: 'red', fontSize: '1.2rem', textAlign: 'center', padding: '2rem' }}>
                            No se encuentran estudiantes matriculados para esta sección.
                        </div>
                    ) : (
                        <DataTableIndex
                            columns={detallesaula ? [...columnasBase, columnaAccion] : columnasBase}
                            data={filteredData}
                        />
                    )}

                </div>

                <ModalField
                    visible={visible}
                    cerrarModal={cerrarModal}
                    onclick={habilitar_desahbilitar_seccion}
                    width={"700"}
                    height={"100"}
                    title={"¿Estas seguro?"}
                    mensaje={
                        <>
                            ¿Estás seguro que deseas cerrar la {aulaSeleccionada?.label || 'aula desconocida'}? <br /><br />
                        </>
                    }
                />
            </Componente>
        );
    }

    return contenido;
}

const customStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white", borderColor: "#ccc", borderRadius: "4px", padding: "5px", fontSize: "16px" }),
    option: (styles, { isFocused, isSelected }) => ({
        ...styles,
        backgroundColor: isSelected ? "#0465ac" : isFocused ? "#e0e0e0" : "white",
        color: isSelected ? "white" : "#333"
    }),
    multiValue: (styles) => ({ ...styles, backgroundColor: "#0465ac", color: "white" }),
    multiValueLabel: (styles) => ({ ...styles, color: "white" }),
    multiValueRemove: (styles) => ({ ...styles, color: "white", ":hover": { backgroundColor: "red", color: "white" } }),
};

const Componente = styled.div`
    .label {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: bold;
        text-transform: capitalize;
    }
    .label.aprobado { background-color: #d1f7c4; color: #2e7d32; }
    .label.reprobado { background-color: #fddede; color: #c62828; }
    .label.pendiente { background-color: #fff3cd; color: #856404; }
`;
