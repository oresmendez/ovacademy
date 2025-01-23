'use client'; import { useState, useEffect, styled, apiRest, toast, gestorCookie, Link, textBarHeader, useParams } from '@/app/utils/hooks';

export default function DashboardPage() {
    
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});

    const { setHeaderText } = textBarHeader();

    const params = useParams();
    const { id } = params;
    console.log(id);

    useEffect(() => {

        const breadcrumbHTML = (
            <>
                <Link href={`/ovacademy/teacher/dashboard`}>
                    Dashboard
                </Link>{" "}
                <span className='separator'>
                    &gt;{" "}
                </span>
                
                <Link href={`/ovacademy/teacher/`}>
                    Gestor Profesores - Estudiantes
                </Link>{" "}
                <span className='separator'>
                    &gt;{" "}
                </span>
                usuario
            </>
        );

        setHeaderText(breadcrumbHTML);

        const fetchData = async () => {
            try {
                const response = await apiRest.fetchGet(`http://localhost:3333/ovacademy/user/${id}`);
                if (response.status != 200) {
                    return toast.error(response.data.message);
                }
                const userData = response.data;
                const sanitizedData = {
                    name: userData.nombre || "Nombre",
                    surname: userData.apellido || "Apellido",
                    phone: userData.telefono || "",
                    email: userData.correo || "Correo no disponible",
                };
    
                setUserData(sanitizedData);
                setEditedData(sanitizedData);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
    
        fetchData();
    }, []);

    const handleInputChange = (field, value) => {
        setEditedData((prevData) => ({ ...prevData, [field]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const loadingToastId = toast.loading('Guardando datos...');

        try {
            console.log(editedData);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = await apiRest.fetchPut('http://localhost:3333/ovacademy/user', editedData);

            if (response.status === 200) {
                setUserData({ ...editedData });
                setIsEditing(false);
                toast.success('Datos guardados correctamente');
                gestorCookie.update_cookie({
                    nombre: editedData.name,
                    apellido: editedData.surname,
                });
            } else {
                toast.error(response.data.message || 'Error al guardar los datos');
            }
        } catch (err) {
            console.error('Error al guardar los datos:', err);
            toast.error('Error al conectar con el servidor');
        } finally {
            toast.dismiss(loadingToastId);
        }
    };

    function changeImage() {
        alert("Mensaje: Cambiar imagen");
    }

    return (
        <ProfileContainer>
            <div className="layout-body">
                <div className="container-body">
                    <div className="profile-header">
                        <div className="profile-image">
                            <img
                                src="/profile-img.jpg"
                                alt="Usuario"
                            />
                        </div>
                        <div className="profile-info">
                            <h1>{userData ? `${userData.name} ${userData.surname}` : 'Nombre y Apellido'}</h1>
                            <p>{userData?.email || 'Correo electrónico no disponible'}</p>
                        </div>
                    </div>
                    <div className="profile-content">
                        <div className="tab-content personal-info">
                            <div className="header-section">
                                <h2>Información Personal</h2>
                                <button
                                    className={`edit-button ${isEditing ? 'cancel' : ''}`}
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {isEditing ? 'Cancelar' : 'Editar'}
                                </button>
                            </div>
                            <form className="info-form" onSubmit={handleSave}>
                                {['name', 'surname', 'phone', 'direccion', 'fechaNacimiento'].map((field) => (
                                    <div className="info-row" key={field}>
                                        <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                                        <input
                                            type={field === 'fechaNacimiento' ? 'date' : 'text'}
                                            id={field}
                                            value={editedData[field] || ''}
                                            onChange={(e) => handleInputChange(field, e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                ))}
                                {isEditing && (
                                    <div className="button-row">
                                        <button type="submit" className="save-button">
                                            Guardar
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </ProfileContainer>
    );
}

const ProfileContainer = styled.div`
    .layout-body {
        font-family: var(--font-lexend);
        padding: 20px;
    }

    .profile-header {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 20px;
        background: #f9f9f9;
        border-radius: 10px;
        margin-bottom: 20px;
    }

    .profile-image {
        position: relative;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        overflow: hidden;
        border: 1px solid #0466ac29;
        cursor: pointer;
    }

    .profile-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .profile-image:hover{
        
    }

    .change-photo-btn {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #0465ac;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 12px;
        cursor: pointer;
    }

    .profile-info {
        flex: 1;
    }

    .profile-info h1 {
        font-size: 1.8rem;
        margin: 0;
    }

    .profile-info p {
        font-size: 1.2rem;
        margin: 10px 0;
    }

    .profile-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }

    .tab-button {
        padding: 10px 20px;
        border: none;
        background-color: #ebebeb;
        cursor: pointer;
        border-radius: 5px;
        transition: background-color 0.3s;
    }

    .tab-button.active {
        background-color: #0465ac;
        color: white;
    }

    .profile-content {
        background: white;
        padding: 20px;
        border-radius: 10px;
    }

    .header-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .edit-button {
        background-color: #0465ac;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .edit-button.cancel {
        background-color: #d9534f;
    }

    .info-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .info-row {
        display: flex;
        flex-direction: column;
    }

    .info-row label {
        font-weight: bold;
        margin-bottom: 5px;
    }

    .info-row input {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .info-row input:disabled {
        background-color: #f5f5f5;
    }

    .button-row {
        margin-top: 20px;
        text-align: center;
    }

    .save-button {
        background-color: #28a745;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }
`;
