'use client'; import { styled, apiRest, toast, useState, useEffect, export_file, useRouter, PropTypes, ButtonSave,ButtonAccion,InputSearch, DataTableIndex, ModalField, MessageError, Spinner } from '@/app/components/utils/rutas';
import { TbEyeEdit } from "react-icons/tb";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import TextField from "@mui/material/TextField";

export default function ListarSemestre_() {

    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState('');

    const [semestreSeleccionado, setsemestreSeleccionado] = useState(false);

    const [idSemestre, setidSemestre] = useState("");
    const [nombre, setNombre] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");

    const [showSpinner, setShowSpinner] = useState(false);
	const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);

    const [visible, setVisible] = useState(false);
    const [visibleEditar, setvisibleEditar] = useState(false);
    const abrirModal = (idAula) => {
        setVisible(true);
    };

    useEffect(() => {
        ObtenerSemestres();
    }, []);

    const handleDeleteClick = async () => {
        setVisible(false)
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);

            const url = `${process.env.NEXT_PUBLIC_API_URL}/semestre`;
            const response = await apiRest.fetchPut(url);
            console.log(response)
            if (response.status === 200) {
                ObtenerSemestres();
                await new Promise(resolve => setTimeout(resolve, 1000));
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error('Error al conectar con el servidor.');
        }finally { clearTimeout(timeout); setShowSpinner(false);setIsLoadingRespuestas(false);}
    };

    const ObtenerSemestres = async () => {
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300)
            const url = `${process.env.NEXT_PUBLIC_API_URL}/semestre`;
            const response = await apiRest.fetchGet(url);
            
            if (response.status === 200) {
                setData(response.data.data);
            } else {
                console.error('La respuesta de la API no contiene datos válidos.');
                setData([]);
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
            setData([]);
        }finally { clearTimeout(timeout); setShowSpinner(false);setIsLoadingRespuestas(false);}
    };

    const obtenerSemestreId = async (id) => {
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/semestre/${id}`
            const response = await apiRest.fetchGet(url);
            console.log(response)
            if (response.status === 200) {
                setidSemestre(response.data.data.id);
                setNombre(response.data.data.nombre);
                const [year, month, day] = response.data.data.dateStart.split('-');
                setFechaInicio(new Date(year, month - 1, day));

                await new Promise(resolve => setTimeout(resolve, 800));
                setsemestreSeleccionado(true);
            } else {
                console.error('La respuesta de la API no contiene datos válidos.');
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
        }finally { clearTimeout(timeout); setShowSpinner(false);}
    };

    const editar_semestre = async () => {
        setvisibleEditar(false)
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/semestre/${idSemestre}`
            const response = await apiRest.fetchPut(url,
                { id: idSemestre, nombre: nombre, date_start:fechaInicio }
            );
            console.log(response)
            if (response.status === 200) {
                ObtenerSemestres()
                setsemestreSeleccionado(false)
            } else {
                console.error('Error al editar el semestre');
            }
        } catch (error) {
            console.error("Error al editar el semestre:", error);
        }finally { clearTimeout(timeout); setShowSpinner(false);}
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
        },
        {
            name: 'Acción',
            selector: (row) => (
                row.active && (
                    <button
                        onClick={() => obtenerSemestreId(row.id)}
                        style={{ color: '#0465ac' }}
                    >
                        <TbEyeEdit size={28} />
                    </button>
                )
            ),
            grow: 0.5,
        }

               
    ];

    let contenido;
        
    if (showSpinner || isLoadingRespuestas) {
        contenido = <Spinner show={showSpinner} />;
    } else if (semestreSeleccionado) {
        contenido = (
            <Componente>
                <div className="header-edicion center-left">
                    <ButtonAccion onClick={() => setsemestreSeleccionado(false)}>Atrás</ButtonAccion>
                    <ButtonSave bgColor="#e74c3c" hoverColor="#c0392b" className="ml-10" onClick={() => console.log('true')} animation={false}> Culminar semestre</ButtonSave>
                </div>

		
                <div className="form-wrapper">
                    <form
                    id="formSemestre"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                        className="space-y-4"
                        >
                        <InputField label="Nombre del Semestre" value={nombre} onChange={setNombre} placeholder="Nombre" required />
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <div className="form-group">
                            <label className="form-label">Fecha de Inicio</label>
                            <DatePicker
                                value={fechaInicio}
                                onChange={(newValue) => setFechaInicio(newValue)}
                                slots={{ textField: (params) => <TextField {...params} fullWidth /> }}
                            />
                            </div>
                        </LocalizationProvider>
                        <div className='center'>
                            <ButtonSave className="mt-10 mr-10" animation={false} onClick={() => setvisibleEditar(true)}>Guardar</ButtonSave>
                            <ButtonSave bgColor="#d5dbdb" hoverColor="#bfc9ca" className="mt-10" onClick={() => router.push('/ovacademy/administrador/dashboard')}>Regresar</ButtonSave>
                        </div>
                    </form>
                </div>
                <ModalField 
                    visible={visibleEditar} 
                    cerrarModal={() => setvisibleEditar(false)} 
                    onclick={() => editar_semestre()}
                    width={"700"}
                    height={"100"}
                    title={"¿Estas seguro?"}
                    mensaje={
                        <>
                            ¿Que deseas editar el semestre? <br /><br />
                        </>
                    }
                />
		
            </Componente>
        );
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
                                    <ButtonAccion onClick={ObtenerSemestres} loading={true} ></ButtonAccion> 
                                    <InputSearch filterText={filterText} setFilterText={setFilterText} />
                                </div>
                            </div>
                            <DataTableIndex columns={columns} data={filteredData} />
                        </div>
                    )
                }
                <ModalField 
                    visible={visible} 
                    cerrarModal={() => setVisible(false)} 
                    onclick={() => handleDeleteClick()}
                    width={"700"}
                    height={"200"}
                    title={"¿Estas seguro?"}
                    mensaje={
                        <>
                            ¿Que deseas culminar este semestre? <br /><br />
                            Recuerda que los profesores deben cerrar <span style={{ color: 'red', fontWeight: 'bold' }}>todas las secciones</span> para poder finalizar el semestre en curso
                        </>
                    }
                />
            </Componente>
        );
    }

    return contenido;

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

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string,             
    value: PropTypes.oneOfType([        
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool
};

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

    .form-wrapper {
    
    background: #fff;
    border-radius: 12px;
    width:100%;
  }

  .form-title {
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 20px;
    color: #333;
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

  .form-input {
    width: 100%;
    padding: 10px 14px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  .form-input:focus {
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
