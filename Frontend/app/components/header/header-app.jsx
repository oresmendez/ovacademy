"use client";
import { styled, LogoName, BurguerButton, IconGroup } from '@/app/components/utils/rutas';

export default function Header({ handleClick, status }) {
    return (
        <Componente>
            <div className='container-header-welcome'>
                <div className='header-menu-logo'>
                    <div className='menu-options center'>
                        <BurguerButton status={status} handleClick={handleClick} />
                    </div>
                    <div className='header-main-elements center'>
                        <div className='header-logo'>
                            <LogoName size_logo={40} size_name={1.5} />
                        </div>
                    </div>
                </div>
                <nav className='header-navigation'>
                    <div className='header-navigation-group'>
                        <div className='header-navigation-group center'>
                            <IconGroup />
                        </div>
                    </div>
                </nav>
            </div>
        </Componente>
    );
}

const Componente = styled.div`

    /* 🔹 Estilos base para escritorio y tablets */
    .container-header-welcome {
        height: var(--size--header);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .header-menu-logo {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .menu-options {
        position: relative;
    }

    .header-main-elements {
        width: 450px;
        display: flex;
        justify-content: center;
    }

    .header-logo {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .header-navigation {
        display: flex;
        justify-content: flex-end; /* 👈 Centrado */
        align-items: center;
        width: 100%;             /* ✅ Usar todo el ancho disponible */
        overflow: hidden;        /* ✅ Evita desbordes visuales */
    }

    .header-navigation-group {
        display: flex;
        flex-wrap: wrap;         /* ✅ Permite que los íconos bajen si no caben */
        justify-content: center; /* ✅ Centrado horizontal */
        align-items: center;
        max-width: 100%;         /* ✅ Nunca sobrepasa el ancho del header */
        gap: 0.5rem;             /* 👌 Separación entre íconos si aplica */
        padding: 0.4rem 0;
    }


    .group-signIn-button {
        color: var(--ui-color-button-label-negative);
        padding: 0.5rem 1rem;
        background-color: var(--color-azul-vibrante);
        border-radius: 2px;
    }

    /* 🔸 Estilos generales para móviles (≤ 480px) */
    /* 📱 Móviles pequeños (hasta 480px) */
    @media (max-width: 480px) {
        .container-header-welcome {
            flex-direction: row;
            align-items: center;
            height: auto;
            padding: 0rem 0rem 0.5rem 0rem;
        }

        .header-menu-logo {
            flex-direction: column;
            align-items: center;
            width: 100%;
            position: relative;
        }

        .header-main-elements {
            width: 100%;
            justify-content: flex-end;
        }

        .header-logo {
            justify-content: center;
            width: auto;
            
        }

        .header-navigation {
            width: auto;
            margin-top: 0.5rem;
        }

        .header-navigation-group {
            justify-content: center;
        }

        .header-logo .logo-name {
            font-size: 1rem !important;
            margin-right: 0.5rem;
        }

        .menu-options {
            display: flex;
            justify-content: center;
            position: absolute;
            left: 0; 
            top: 0;
            opacity: 0;
            pointer-events: none;
            transform: translateX(-20px); /* ✅ Empieza 20px más a la izquierda */
            transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .header-menu-logo:hover .menu-options {
            opacity: 1;
            pointer-events: auto;
            transform: translateX(0); /* ✅ Vuelve a su posición original */
        }

    }

    @media (max-width: 320px) {

        .header-logo .logo-name {
            font-size: 0.8rem !important;
            padding-top: 0.2rem;
            
        }

        .header-main-elements {
            margin-left: 0px;
        }

    }

`;

