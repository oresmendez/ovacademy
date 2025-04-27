'use client';
import { usePathname, styled, PropTypes, Link, FaStar, NavHeader, NavUser, MenuElements, NavFooter } from '@/app/components/utils/rutas';
import { PiStudentFill } from "react-icons/pi";
import { RiBookShelfLine } from "react-icons/ri";
import { IoBookSharp } from "react-icons/io5";
import { PiPencilLineFill } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { FaHome } from "react-icons/fa";
import { BiAward } from "react-icons/bi";
import { SiGoogleclassroom } from "react-icons/si";
import { GiFloorHatch } from "react-icons/gi";

export default function Nav({ handleClick, status }) {

    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(segment => segment !== "");
    const userAuth = pathSegments.length > 1 ? pathSegments[1] : null;

    const handleInnerClick = (event) => {
        event.stopPropagation();
    };

    return (
        <Componente>
            <div
                onClick={handleClick}
                className={`wrapper-menu ${status ? 'active' : ''}`}
                role="button"
                aria-label="Abrir menú de usuario"
            >
                <div className="user-menu-wrapper" onClick={handleInnerClick}>
                    <NavHeader status={status} handleClick={handleClick} />
                    <div className="user-menu-container">
                        <NavUser handleClick={handleClick} userAuth={userAuth} />
                        <nav className="user-menu-navigation">
                            <ul>
                                {userAuth === 'administrador' && (
                                    <>  
                                        <Link href="/ovacademy/administrador/dashboard" passHref>
                                            <MenuElements title="Home" icon={<FaHome size={25} />} />
                                        </Link>
                                        <Link href="/ovacademy/administrador/materia" passHref>
                                            <MenuElements title="Materia" icon={<BiAward size={25} />} />
                                        </Link>
                                        <Link href="/ovacademy/administrador/profesores" passHref>
                                            <MenuElements title="Profesores" icon={<GiTeacher size={25} />} />
                                        </Link>
                                        <Link href="/ovacademy/administrador/semestre" passHref>
                                            <MenuElements title="Semestres" icon={<GiFloorHatch size={25} />} />
                                        </Link>
                                        <Link href="/ovacademy/administrador/aula" passHref>
                                            <MenuElements title="Secciones" icon={<SiGoogleclassroom size={25} />} />
                                        </Link>
                                    </>
                                )}

                                {userAuth === 'profesor' && (
                                    <>
                                        <Link href="/ovacademy/profesor/dashboard" passHref>
                                            <MenuElements title="Home" icon={<FaHome size={25} />} />
                                        </Link>
                                        <Link href="/ovacademy/profesor/estudiantes" passHref>
                                            <MenuElements title="Estudiantes" icon={<PiStudentFill size={25}/>} />
                                        </Link>
                                        <Link href="/ovacademy/profesor/unidades" passHref>
                                            <MenuElements title="Unidades" icon={<RiBookShelfLine size={25} />} />
                                        </Link>
                                        <Link href="/ovacademy/profesor/contenidos" passHref>
                                            <MenuElements title="Contenidos" icon={<IoBookSharp size={25} />} />
                                        </Link>
                                        <Link href="/ovacademy/profesor/evaluaciones" passHref>
                                            <MenuElements title="Evaluaciones" icon={<PiPencilLineFill size={25} />} />
                                        </Link>
                                    </>
                                )}

                                {userAuth === 'estudiante' && (
                                    <>
                                        <Link href="/ovacademy/estudiante/dashboard" passHref>
                                            <MenuElements title="Home" icon={<FaHome size={25} />} />
                                        </Link>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </div>
                    <NavFooter />
                </div>
            </div>
        </Componente>
    );
}

Nav.propTypes = {
    handleClick: PropTypes.func.isRequired,
    status: PropTypes.bool.isRequired,
};

const Componente = styled.div`

    .wrapper-menu {
        position: absolute;
        background: rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s linear 500ms, opacity 500ms ease;
        z-index: 10; /* Trae el encabezado y botones al frente */
        font-family: var(--font-lexend);
    }

    .wrapper-menu.active {
        visibility: visible;
        opacity: 1;
        transition: opacity 500ms ease;
    }

    .user-menu-wrapper {
        max-width: 24.3rem;
        width: 100%;
        background: var(--color-blanco);
        height: 100vh;
        position: relative;
        transform: translateX(-100%); /* Oculto fuera de la ventana */
        transition: transform 500ms ease; /* Transición para el movimiento */
    }

    .wrapper-menu.active .user-menu-wrapper {
        transform: translateX(0); /* Desplazamiento suave hacia dentro */
    }

    .user-menu-container {
        display: flex;
        flex-direction: column;
    }

    .user-menu-navigation {
        padding: 0.5rem 0;
        height: 24.5rem;
        overflow-y: auto; /* Activa la barra de desplazamiento vertical */
    }

    .user-menu-navigation::-webkit-scrollbar {
        width: 3px; /* Grosor del scroll */
    }

    .user-menu-navigation::-webkit-scrollbar-thumb {
        background-color: #666666; /* Color del scroll */
        border-radius: 4px; /* Redondear bordes */
    }

    .user-menu-navigation::-webkit-scrollbar-track {
        background: transparent; /* Fondo del track del scroll */
    }
`;
