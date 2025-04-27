'use client'; import { useState, useEffect, styled, apiRest, toast, Select, export_file, DataTableIndex, ButtonAccion, InputSearch, ModalField, Spinner } from '@/app/components/utils/rutas';

export default function ListarEstudiantes() {
    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [aulas, setAulas] = useState([]);
    const [detallesaula, setdetallesaula] = useState(true);
    const [aulaSeleccionada, setAulaSeleccionada] = useState(null);

    const [showSpinner, setShowSpinner] = useState(false);
	const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);

    useEffect(() => {
        obtenerAula();
    }, []);

    useEffect(() => {
        if (aulaSeleccionada) {
            obtenerEstudiantes(aulaSeleccionada.value);
        }
    }, [aulaSeleccionada]);
    
    const [visible, setVisible] = useState(false);
    const abrirModal = (idAula) => {
        setVisible(true);
    };
    const cerrarModal = () => setVisible(false);

    const obtenerAula = async () => {
		let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
			const url = 'http://localhost:3333/ovacademy/aula/profesor'
			const response = await apiRest.fetchGet(url);
            console.log(response)
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
		}finally { clearTimeout(timeout); setShowSpinner(false);}
	};

    const obtenerEstudiantes = async () => {
        
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `http://localhost:3333/ovacademy/aula/estudiantesByAula`
            const response = await apiRest.fetchPost(url, {
                aulaId :aulaSeleccionada.value
            }); 

            if (response.status === 200) {
                setData(response.data.data);
            } else {
                console.error('La respuesta de la API no contiene datos válidos.');
                setData([]);
            }

            obtener_detalles_aula(aulaSeleccionada.value)
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
            setData([]);
        }finally { clearTimeout(timeout); setShowSpinner(false);}
    };

    const obtener_detalles_aula = async (aula_id) => {
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `http://localhost:3333/ovacademy/aula/obtenerAulabyaulaID/${aula_id}`
            const response = await apiRest.fetchGet(url); 
            if (response.status === 200) {
                setdetallesaula(response.data.data.habilitado);
            } else {
                console.error('La respuesta de la API no contiene datos válidos.');
                
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
           
        }finally { clearTimeout(timeout); setShowSpinner(false);setIsLoadingRespuestas(false);}
    };

    const desmatricularEstudiante = async (id) => {
        try {
            const response = await apiRest.fetchDelete(`http://localhost:3333/ovacademy/aula/desmatricular/${id}`);
            
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
            const response = await apiRest.fetchDelete(`http://localhost:3333/ovacademy/semestre/aula/${aulaSeleccionada.value}`);
    
            if (response.status === 200) {
                toast.success(`Sección Habilitada`);
                cerrarModal();
                obtenerAula();
            } else {
                toast.error('Ocurrió un error');
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

    const columnasBase = [
        {   name: 'Correo Electrónico', 
            selector: (row) => row.email || 'No disponible', 
            sortable: true, 
            grow: 2.8 
        },
        {   name: 'Nombre', 
            selector: (row) => row.name || 'No disponible', 
            sortable: true, 
            grow: 2.2,
            center: true 
        },
        {   name: 'Apellido', 
            selector: (row) => row.surname || 'No disponible', 
            sortable: true, 
            grow: 2.2,
            center: true 
        },
        {
            name: 'Nota Final',
            selector: (row) => {
                if (row.nota_final === null || row.nota_final === undefined) {
                return 'pendiente'
                }
                return parseFloat(row.nota_final).toFixed(2)
            },
            sortable: true,
            grow: 1.6,
            center: true
        },
        {
            name: 'Nota Redondeada',
            selector: (row) => {
                if (row.nota_final === null || row.nota_final === undefined) {
                return 'pendiente'
                }
                return Math.round(parseFloat(row.nota_final))
            },
            sortable: true,
            grow: 2.5,
            center: true
        },
        {
            name: 'Estado académico',
            selector: (row) => {
              let status = '';
              let className = 'label ';
          
              if (row.nota_final === null || row.nota_final === undefined) {
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
            center: true
        }
           
    ];

    const columnaAccion = {
        name: 'Acción',
        grow: 1.4,
        cell: (row) => (
          (row.nota_final === null || row.nota_final === undefined) && (
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
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="botones-exportar">
                            <ButtonAccion onClick={exportToPDF}>Exportar a PDF</ButtonAccion> 
                            <ButtonAccion onClick={exportToExcel}>Exportar a Excel</ButtonAccion> 
                            <ButtonAccion onClick={obtenerAula} loading={true} ></ButtonAccion> 
                            <div>
                                <Select
                                    options={aulas}
                                    placeholder="Selecciona..."
                                    value={aulaSeleccionada}
                                    onChange={setAulaSeleccionada}
                                    styles={customStyles}
                                    isClearable
                                />
                            </div>
                        </div>
                        <InputSearch filterText={filterText} setFilterText={setFilterText} />
                        {detallesaula && (
                            <ButtonAccion color="#cb192a" onClick={abrirModal}>
                                Cerrar Sección
                            </ButtonAccion>
                        )}
                        
                    </div>
                    {
                        aulaSeleccionada && filteredData.length === 0 ? (
                            <p style={{ padding: '1rem', fontWeight: 'bold', color: '#c62828' }}>
                                No existen estudiantes matriculados para esta sección.
                            </p>
                        ) : (
                            <DataTableIndex
                            columns={detallesaula ? [...columnasBase, columnaAccion] : columnasBase}
                            data={filteredData}
                            />
                        )
                    }

                </div>
                <ModalField 
                    visible={visible} 
                    cerrarModal={cerrarModal} 
                    onclick={habilitar_desahbilitar_seccion}
                    width={"700"}
                    height={"300"}
                    title={"¿Estas seguro?"}
                    mensaje={
                        <>
                            ¿Estás seguro que deseas cerrar la {aulaSeleccionada?.label || 'seleccione un aula'} <br /><br />
                        </>
                    }
                />
        </Componente>
        );
    }

    return contenido;
}

const customStyles = {
	control: (styles) => ({
		...styles,
		backgroundColor: "white",
		borderColor: "#ccc",
		borderRadius: "4px",
		padding: "5px",
		fontSize: "16px",
	}),
	option: (styles, { isFocused, isSelected }) => ({
		...styles,
		backgroundColor: isSelected ? "#0465ac" : isFocused ? "#e0e0e0" : "white",
		color: isSelected ? "white" : "#333",
	}),
	multiValue: (styles) => ({
		...styles,
		backgroundColor: "#0465ac",
		color: "white",
	}),
	multiValueLabel: (styles) => ({
		...styles,
		color: "white",
	}),
	multiValueRemove: (styles) => ({
		...styles,
		color: "white",
		":hover": { backgroundColor: "red", color: "white" },
	}),
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

    .label.aprobado {
    background-color: #d1f7c4;
    color: #2e7d32;
    }

    .label.reprobado {
    background-color: #fddede;
    color: #c62828;
    }

    .label.pendiente {
    background-color: #fff3cd;
    color: #856404;
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


`;
