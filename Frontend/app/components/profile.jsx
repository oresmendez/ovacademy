"use client";
import { useState, useEffect, PropTypes, styled, apiRest, toast, gestorCookie } from '@/app/components/utils/rutas';

export default function Profile({ email = ''}) {
    
    const [name, setName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [surname, setSurname] = useState("");
    const [phone, setPhone] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // Estado para controlar la pestaña activa
    const [activeTab, setActiveTab] = useState("personal");

    // Estados para cambiar contraseña
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");

    useEffect(() => {
        fetchEmail();
    }, [email]);

    useEffect(() => {
        if (userEmail) {
        get_user();
        }
    }, [userEmail]);

    const fetchEmail = async () => {
        if (email) {
            setUserEmail(email);
        } else {
            setUserEmail(await gestorCookie.get_one_element_cookie("user-data", "correo"));
        }
    };

    const get_user = async () => {
        try {
            console.log(userEmail)
            const response = await apiRest.fetchGet(`http://localhost:3333/ovacademy/user/${userEmail}`);
            if (response.status !== 200) {
                return toast.error(response.data.message);
        }
        
            setName(response.data.nombre);
            setSurname(response.data.apellido);
            setPhone(response.data.telefono);
        } catch (error) {
            toast.error("Ocurrió un error al obtener el usuario");
        }
    };

    const editar_usuario = async () => {
        const response = await apiRest.fetchPut(
            "http://localhost:3333/ovacademy/user",
            { email: userEmail, name, surname, phone }
        );

        if (response.status === 200) {
            toast.success(response.data.message);
            get_user();
            setIsEditing(false);
        } else {
            toast.error(response.data.message);
        }
    };

    const cancelEditing = () => {
        get_user();
        setIsEditing(false);
    };

    const cambiarContraseña = async () => {
        if (password !== verifyPassword) {
            return toast.error("Las contraseñas no coinciden");
        }
        try {
            const response = await apiRest.fetchPut(
                "http://localhost:3333/ovacademy/auth/changePassword",
                { email: userEmail, password }
        );
        if (response.status === 200) {
            toast.success(response.data.message);
            setPassword("");
            setVerifyPassword("");
        } else {
            toast.error(response.data.message);
        }
        } catch (error) {
            toast.error("Ocurrió un error al cambiar la contraseña");
        }
    };

    return (
        <Component>
        <div className="profile-header">
            <div className="profile-image">
            <img src="/profile-img.jpg" alt="Usuario" />
            </div>
            <div className="profile-info">
            <h1>{(name || surname) ? `${name} ${surname}` : 'Nombre y Apellido'}</h1>
            <p>{userEmail || 'Correo electrónico no disponible'}</p>
            {activeTab === "personal" && !isEditing && (
                <button className="edit-button" onClick={() => setIsEditing(true)}>
                Editar
                </button>
            )}
            </div>
        </div>

        <div className="profile-tabs">
            <button
            className={`tab-button ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => setActiveTab("personal")}
            >
            Información Personal
            </button>
            <button
            className={`tab-button ${activeTab === "changePassword" ? "active" : ""}`}
            onClick={() => setActiveTab("changePassword")}
            >
            Cambiar Contraseña
            </button>
        </div>

        <div className="profile-content">
            {activeTab === "personal" && (
            <div className="tab-content personal-info">
                <div className="header-section">
                <h2>Información Personal</h2>
                </div>
                <form
                id="editar_usuario"
                onSubmit={(e) => {
                    e.preventDefault();
                    editar_usuario();
                }}
                >
                <div className="info-row">
                    <label htmlFor="name">Nombre:</label>
                    <input
                    type="text"
                    id="name"
                    disabled={!isEditing}
                    value={name || ''}
                    onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="info-row">
                    <label htmlFor="surname">Apellido:</label>
                    <input
                    type="text"
                    id="surname"
                    disabled={!isEditing}
                    value={surname || ''}
                    onChange={(e) => setSurname(e.target.value)}
                    />
                </div>
                <div className="info-row">
                    <label htmlFor="phone">Teléfono:</label>
                    <input
                    type="text"
                    id="phone"
                    disabled={!isEditing}
                    value={phone || ''}
                    onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                {isEditing && (
                    <div className="button-row">
                    <button type="submit" className="save-button">
                        Guardar
                    </button>
                    <button type="button" className="cancel-button" onClick={cancelEditing}>
                        Cancelar
                    </button>
                    </div>
                )}
                </form>
            </div>
            )}

            {activeTab === "changePassword" && (
            <div className="tab-content change-password">
                <div className="header-section">
                <h2>Cambiar Contraseña</h2>
                </div>
                <form
                id="cambiar_contrasena"
                onSubmit={(e) => {
                    e.preventDefault();
                    cambiarContraseña();
                }}
                >
                <div className="info-row">
                    <label htmlFor="password">Nueva Contraseña:</label>
                    <input
                    type="password"
                    id="password"
                    value={password || ''}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="info-row">
                    <label htmlFor="verifyPassword">Verificar Contraseña:</label>
                    <input
                    type="password"
                    id="verifyPassword"
                    value={verifyPassword || ''}
                    onChange={(e) => setVerifyPassword(e.target.value)}
                    />
                </div>
                <div className="button-row">
                    <button type="submit" className="save-button">
                    Guardar
                    </button>
                    <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                        setPassword("");
                        setVerifyPassword("");
                    }}
                    >
                    Cancelar
                    </button>
                </div>
                </form>
            </div>
            )}
        </div>
        </Component>
    );
}

Profile.propTypes = {
  email: PropTypes.string,
};


const Component = styled.div`
  .profile-header {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 10px;
    margin-bottom: 20px;
    font-family: var(--font-lexend);
  }

  .profile-image {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #0465ac;
    cursor: pointer;
  }

  .profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
    font-family: var(--font-lexend);
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
    font-family: var(--font-lexend);
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
    background-color: #ebebeb;
  }

  .info-row {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
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
    background-color: #0465ac;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-right: 10px;
  }

  .cancel-button {
    background-color: #ebebeb;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
`;
