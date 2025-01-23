import { useEffect, useState, Link, styled, gestorCookie  } from '@/app/utils/hooks';

import { IoMdLogOut } from "react-icons/io";
import { MdEdit } from "react-icons/md";


export default function Nav_user({ handleClick }) {

    const [userData, setUserData] = useState(null);
    useEffect(() => {
        gestorCookie.get_cookie(setUserData);
    }, [handleClick]);

    return (
        <Componente>
            <div className="user-menu-details">
                <div className="user-menu-details-top-wrapper center">
                    <div className="avatar">
                        {userData
                            ? `${userData.nombre?.[0] || 'N'}${userData.apellido?.[0] || 'A'}` // Iniciales con valores predeterminados
                            : "NA"}
                    </div>
                    <div>
                    <Link href="/auth/login" passHref>
                        <button className="icon icon-logout">
                            Sign out
                            <IoMdLogOut className="ml-05" />
                        </button>
                    </Link>
                    </div>
                </div>
                <div className="user-menu-details-bottom-wrapper center">
                    <div>
                        <div>
                            {userData
                            ? `${userData.nombre ? userData.nombre : "Nombre"} ${userData.apellido ? userData.apellido : "Apellido"}`
                            : "Nombre y Apellido??"}
                        </div>
                        <div>
                            {userData
                                ? userData.correo
                                : "correo??"}
                        </div>
                    </div>
                    <div className="pt-05 pr-05">
                        <Link href="/ovacademy/user" passHref>
                            <button className="icon icon-edit">
                                <MdEdit />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </Componente>
    );
}

const Componente = styled.div`

    .user-menu-details {
        background-color: var(--color-azul-oscuro-profundo);
        font-family: var(--font-lexend);
    }

    .user-menu-details-top-wrapper {
        color: white;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 6.5rem;
        background-color: var(--color-azul-oscuro-profundo);
        padding: 24px 24px 12px;

    }

    .avatar {
        width: 4rem;
        height: 4rem;
        background-color: #e4e6e5;
        color: #116daf;
        font-size: 18px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        border: 2px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .icon {
        border: 0;
        background-color: inherit;
        color: inherit;
        cursor: pointer;
    }

    .icon-edit {
        border: 0;
        width: 36px;
        height: 36px;
        border-radius: 25px;
        font-size: 1.2rem;
    }

    .icon-edit:hover {
        background-color: rgb(71 84 103);
    }

    .user-menu-details-bottom-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0 12px 24px 24px;
        color: white;
        height: 4.4rem;
        background-color: var(--color-azul-oscuro-profundo);
    }
`;
