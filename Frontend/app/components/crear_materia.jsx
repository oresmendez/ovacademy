'use client'; import { styled, apiRest, toast, useRouter, useState } from '@/app/utils/hooks';

export default function Crear_materia({ statusTab }) {

    const router = useRouter();

    const [datos, setDatos] = useState({
        unidades: [],
    });

    const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);

    const agregarUnidad = () => {
        setDatos({
        ...datos,
        unidades: [...datos.unidades, { nombre: "Nueva Unidad", descripcion: "", contenidos: [] }],
        });
    };

    const eliminarUnidad = (unidadIndex) => {
        const nuevasUnidades = datos.unidades.filter((_, index) => index !== unidadIndex);
        setDatos({ ...datos, unidades: nuevasUnidades });
        if (unidadSeleccionada === unidadIndex) setUnidadSeleccionada(null);
        else if (unidadSeleccionada > unidadIndex) setUnidadSeleccionada(unidadSeleccionada - 1);
    };

    const actualizarUnidad = (index, key, value) => {
        const nuevasUnidades = [...datos.unidades];
        nuevasUnidades[index][key] = value;
        setDatos({ ...datos, unidades: nuevasUnidades });
    };

    const agregarContenido = () => {
        if (unidadSeleccionada === null) return;
        const nuevasUnidades = [...datos.unidades];
        nuevasUnidades[unidadSeleccionada].contenidos.push({ nombre: "", descripcion: "" });
        setDatos({ ...datos, unidades: nuevasUnidades });
    };

    const eliminarContenido = (contenidoIndex) => {
        if (unidadSeleccionada === null) return;
        const nuevasUnidades = [...datos.unidades];
        nuevasUnidades[unidadSeleccionada].contenidos = nuevasUnidades[unidadSeleccionada].contenidos.filter(
        (_, index) => index !== contenidoIndex
        );
        setDatos({ ...datos, unidades: nuevasUnidades });
    };

    const actualizarContenido = (contenidoIndex, key, value) => {
        if (unidadSeleccionada === null) return;
        const nuevasUnidades = [...datos.unidades];
        nuevasUnidades[unidadSeleccionada].contenidos[contenidoIndex][key] = value;
        setDatos({ ...datos, unidades: nuevasUnidades });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        const response = await apiRest.fetchPost('http://localhost:3333/ovacademy/subject/store', datos);

        if (response.status === 201) {
                
            toast.success('Unidades Registradas Exitosamente');
            await new Promise((resolve) => setTimeout(resolve, 1000));
            statusTab(0);
            

        } else if (response.status === 400) {
            
            toast.error('No puedes agregar unidades vacias');

        }else{

            toast.error('Ocurre un error en el servidor');

        }
    };


    return (
     <Componente>
        <div className='tab-descripcion center'>
            <div className='tab-descripcion-tittle ml-20'>
                <h2>Añadir Unidad</h2>
                <p>A continuación, puede crear una unidad:</p>
            </div>
            <div className="guardar mr-20">
                <button type="button" className="boton guardar" onClick={manejarEnvio}>
                    Guardar
                </button>
            </div>
        </div>
       <div className="paneles">
            <div className="panel p-20">
                <div className='panel-content center mb-20'>
                    <h2 className='ml-10'>Unidades</h2>
                    <button type="button" className="mr-20 boton agregar" onClick={agregarUnidad}>
                        Agregar Unidad
                    </button>
                </div>

                {datos.unidades.map((unidad, index) => (
                    <div
                        key={index}
                        className={`unidad-item ${unidadSeleccionada === index ? "seleccionada" : ""}`}
                        onClick={() => setUnidadSeleccionada(index)}
                    >
                        <div className="input-con-boton">
                            <input
                                type="text"
                                value={unidad.nombre}
                                onChange={(e) => actualizarUnidad(index, "nombre", e.target.value)}
                                placeholder="Nombre de la Unidad"
                            />
                            <button
                                type="button"
                                className="boton eliminar"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    eliminarUnidad(index);
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                        <textarea
                            value={unidad.descripcion}
                            onChange={(e) => actualizarUnidad(index, "descripcion", e.target.value)}
                            placeholder="Descripción de la Unidad"
                        ></textarea>
                    </div>
                ))}

                
            </div>
            <div className="panel left p-20">
                <div className='panel-content center mb-20'>
                    <h2 className='ml-10'>Contenidos</h2>
                    <button type="button" className="boton agregar" onClick={agregarContenido}>
                        Agregar Contenido
                    </button>
                </div>
                {unidadSeleccionada !== null && (
                    <>
                        {datos.unidades[unidadSeleccionada].contenidos.map((contenido, index) => (
                            <div key={index} className="contenido-item">
                                <div className="input-con-boton">
                                    <input
                                        type="text"
                                        placeholder="Nombre del contenido"
                                        value={contenido.nombre}
                                        onChange={(e) => actualizarContenido(index, "nombre", e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="boton eliminar"
                                        onClick={() => eliminarContenido(index)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                                <textarea
                                    placeholder="Descripción del contenido"
                                    value={contenido.descripcion}
                                    onChange={(e) => actualizarContenido(index, "descripcion", e.target.value)}
                                ></textarea>
                            </div>
                        ))}
                    </>
                )}

            </div>
        </div>
     </Componente>
    );
}

const Componente = styled.div`

    .tab-descripcion{
        justify-content: space-between;
        font-family: var(--font-lexend);
    }

    .tab-descripcion-tittle{

    }

    .paneles {
        font-family: var(--font-lexend);
        display: flex;
        flex: 1;
        flex-direction: row;
        overflow: hidden;
    }

    .panel {
        flex: 1;
        background-color: #ffffff;
        border-right: 1px solid #e0e0e0;
        height: 30rem; /* Altura fija */
        overflow-y: auto; /* Muestra scrollbar si el contenido excede la altura */
    }

    .panel.left{
        border-right: none;
    }

    .panel-content{
        justify-content: space-between;
    }


    h2 {
        font-size: 1.5rem;
        color: #0052cc;
    }

    .unidad-item,
    .contenido-item {
        margin-bottom: 15px;
        padding: 15px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background-color: #f9f9f9;
        cursor: pointer;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 12px;
        overflow: hidden; /* Evita que los elementos se salgan del contenedor */
        box-sizing: border-box; /* Asegura que padding y borde estén dentro del tamaño */
        transition: box-shadow 0.3s;
    }

    .unidad-item:hover,
    .contenido-item:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .unidad-item.seleccionada {
        background-color: #e6f3ff;
        border-color: #0052cc;
    }

    .input-con-boton,
    .input-con-boton {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .input-con-boton input {
        flex: 1;
        padding: 10px;
        border: 1px solid #d0d0d0;
        border-radius: 6px;
        background: none;
        font-size: 1rem;
        box-sizing: border-box;
        transition: border-color 0.3s;
    }

    .input-con-boton input:focus {
        border-color: #0052cc;
        outline: none;
    }

    .input-con-boton .boton.eliminar {
        padding: 6px 12px;
        font-size: 0.9rem;
        background-color: #ff6b6b;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .input-con-boton .boton.eliminar:hover {
        background-color: #e63939;
    }

    .unidad-item textarea {
        min-height: 4rem;
        max-height: 8rem;
        max-width: 100%;
        min-width: 100%;
        padding: 10px;
        border: 1px solid #d0d0d0;
        border-radius: 6px;
        background: none;
        font-size: 0.9rem;
        resize: both; /* Permite redimensionar */
        box-sizing: border-box;
        transition: border-color 0.3s;
    }

    .unidad-item textarea:focus {
        border-color: #0052cc;
        outline: none;
    }

    .contenido-item textarea {
        width: 100%;
        min-height: 4rem;
        max-height: 12rem;
        padding: 10px;
        border: 1px solid #d0d0d0;
        border-radius: 6px;
        background: none;
        font-size: 0.9rem;
        resize: both; /* Permite redimensionar */
        box-sizing: border-box;
        transition: border-color 0.3s;
    }

    .contenido-item textarea:focus {
        border-color: #0052cc;
        outline: none;
    }


    .guardar {
        padding: 20px;
        text-align: center;
        font-family: var(--font-lexend);
    }

    .boton {
        background-color: #0052cc;
        color: #ffffff;
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .boton.agregar {
        background-color: #36b37e;
    }

    .boton.guardar {
        width: 100%;
        font-size: 1.2rem;
        margin-top: 10px;
        padding: 8px 30px;
    }
  
`;