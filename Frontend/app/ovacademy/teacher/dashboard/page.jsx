'use client';
import { useState, useEffect, styled, apiRest, textBarHeader, toast, Link ,Image} from '@/app/utils/hooks';
import { MdEdit } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';

export default function DashboardPage() {
    
    const [nameMateria, setNameMateria] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editableName, setEditableName] = useState('');
    const [editableDescription, setEditableDescription] = useState('');
    const { setHeaderText } = textBarHeader();

    useEffect(() => {
        setHeaderText((<> Dashboard</>));

        const fetchData = async () => {
            try {
                const [responseNameMateria] = await Promise.all([
                    apiRest.fetchPost('http://localhost:3333/ovacademy/subject/obtenerUnaMateria', { id: 1 })
                ]);

                setNameMateria(responseNameMateria.data);
                setEditableName(responseNameMateria.data.nombre); // Sincroniza con el estado editable
                setEditableDescription(responseNameMateria.data.descripcion || '');
            } catch (err) {
                console.error('Error al conectar con el servidor:', err);
            }
        };
        fetchData();
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        
        try {
            const response = await apiRest.fetchPut('http://localhost:3333/ovacademy/subject', {
                id: 1,
                nombre: editableName,
                descripcion: editableDescription
            });
            setNameMateria((prev) => ({
                ...prev,
                nombre: editableName,
                descripcion: editableDescription
            }));

            setIsEditing(false);

            if (response.status === 200) {
                
                toast.success('Materia Actualizada');
    
            }else{
    
                toast.error('Ocurre un error en el servidor');
                await new Promise((resolve) => setTimeout(resolve, 1500));
                router.reload(); // Recarga la página
    
            }

        } catch (err) {
            console.error('Error al guardar los cambios:', err);
        }
    };

    const handleCancelClick = () => {
        setEditableName(nameMateria.nombre); // Restablece el valor inicial
        setIsEditing(false); // Sal del modo de edición
    };

    const handleChange = (e) => {
        setEditableName(e.target.value); // Actualiza el texto en tiempo real
    };

    const handleChangeDescription = (e) => {
        setEditableDescription(e.target.value);
    };

    return (
        <Componente>
            <div className='layout-body'>
                <div className='container-body'>
                    <div className='banner-dashboard center'>
                        <div className="editable-container center-column">
                            {isEditing ? (
                                <>
                                    <div className=''>
                                        <input
                                            type="text"
                                            value={editableName}
                                            onChange={handleChange}
                                            className="editable-input editable-input-tittle mr-10"
                                        />
                                        <FaCheck onClick={handleSaveClick} className="save-icon" />
                                        <FaTimes onClick={handleCancelClick} className="cancel-icon" />
                                    </div>
                                    <div className=''>
                                        <input
                                            type="text"
                                            value={editableDescription}
                                            onChange={handleChangeDescription}
                                            className="editable-input editable-input-descripcion mr-10"
                                        />
                                    </div>
                                    
                                </>
                                
                            ) : (
                                <div className="text-container">
                                    <div className='center banner-dashboard-text-tittle'>                                    
                                        <span className='banner-dashboard-text mr-10'>
                                            {nameMateria?.nombre || 'Nombre de la materia'}
                                        </span>
                                        <MdEdit onClick={handleEditClick} className="icon edit-icon" />
                                    </div>
                                    <p className='banner-dashboard-description'>
                                        {nameMateria?.descripcion || 'Descripción de la materia'}
                                    </p>
                                </div>
                                
                            )}
                        </div>
                        
                    </div>
                    <div className='center mt-20'>
                            <div className='container-element m-10 center-column'>
                                <span className='container-element-tittle mt-10'>Materia</span>
                                <Link href="/ovacademy/teacher/materia" passHref>
                                    <button>entrar</button>
                                </Link>
                            </div>
                            <div className='container-element m-10 center-column'>
                                <span className='container-element-tittle mt-10'>Gestor de estudiantes y profesores</span>
                                <Link href="/ovacademy/teacher" passHref>
                                    <button>entrar</button>
                                </Link>
                            </div>
                            <div className='container-element m-10 center-column'>
                                <span className='container-element-tittle mt-10'>test</span>
                                <button>entrar</button>
                            </div>
                    </div>
                    <div className='center mt-20'>
                        <div className='container-element m-10 center-column profesor1'>
                            <Image
                                src="/profesor1.png"
                                alt="banner-home"
                                width={500} // Ajusta el tamaño de la imagen según sea necesario
                                height={500} // Puedes personalizar estas dimensiones
                                style={{ borderRadius: '0.3rem', objectFit: 'cover' }}
                                priority
                            />
                        </div>
                        <div className='container-element m-10 center-column profesor1'>
                            <Image
                                src="/profesor2.png"
                                alt="banner-home"
                                width={500}
                                height={500}
                                style={{ borderRadius: '0.3rem', objectFit: 'cover' }}
                                priority
                            />
                        </div>
                        <div className='container-element m-10 center-column profesor1'>
                            <Image
                                src="/profesor3.png"
                                alt="banner-home"
                                width={500}
                                height={500}
                                style={{ borderRadius: '0.3rem', objectFit: 'cover' }}
                                priority
                            />
                        </div>
                    </div>
                    

                </div>
            </div>
        </Componente>
    );
}

const Componente = styled.div`

    .banner-dashboard {
        width: 100%;
        height: 10rem;
        background: linear-gradient(to right, #33b0e4, #0d213a);
        border-radius: 0.5rem;
        flex-direction: column;
        color: white;
        font-family: var(--font-lexend);
    }

    .editable-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .text-container {
        position: relative;
        display: inline-block;
    }

    .banner-dashboard-text {
        font-weight: 600;
        font-size: 2rem;
        cursor: pointer;
        
    }

    .banner-dashboard-text-tittle{

        justify-content: center
    }

    .icon {
        font-size: 1.5rem;
        cursor: pointer;
        transition: opacity 0.2s, transform 0.2s;
        opacity: 0;
        position: absolute;
        right: -2rem;
        top: 0;
        margin-top: 0.6rem;
    }

    .text-container:hover .icon {
        opacity: 1; /* Visible en hover */
    }

    .editable-input{
        padding: 0.3rem;
        border-radius: 0.3rem;
        border: none;
        max-width: 63rem;
        min-width: 38rem;
        background: rgba(255, 255, 255, 0.509); /* Semi-transparente */
        color: black;
        font-family: var(--font-lexend);
    }

    .editable-input-tittle {
        font-size: 1.8rem;
        
        width: auto;
        
    }

    .editable-input-descripcion{
        font-size: 1.2rem;
        width: 60rem;
    }

    .save-icon {
        color: #ffffffa5;
        cursor: pointer;
        font-size: 1.5rem;
        transition: transform 0.2s;
    }

    .save-icon:hover {
        transform: scale(1.1);
    }

    .cancel-icon {
        color: #ffffffa5;
        cursor: pointer;
        font-size: 1.5rem;
        transition: transform 0.2s;
    }

    .cancel-icon:hover {
        transform: scale(1.1);
    }

    .banner-dashboard-description {
        font-size: 1.2rem;
        font-weight: 300;
        margin-top: 0.5rem;
        line-height: 1.5;
    }

    .container-element{
        background-color:#c7ddec;
        border-radius: 0.3rem;
        font-family: var(--font-lexend);
        font-size: 1.5rem;
        cursor: pointer;
        overflow: hidden;
        height: auto;
        width: 100%
    }

    .container-element-tittle{

    }

    .container-element button{
        color: white;
        background-color:#0c2944;
        border-radius: 0.3rem;
        padding: 0.2rem 1rem;
        margin: 2rem 0;
    }

    
`;
