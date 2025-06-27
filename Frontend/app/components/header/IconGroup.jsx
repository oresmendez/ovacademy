'use client'; import { styled , Link} from '@/app/components/utils/rutas';

import { PiSignOutBold } from "react-icons/pi";


export default function IconGroup() {
    const icons = [
        // { id: 1, icon: <IoSearch size={20} />, label: "Buscar", href: "/" },
        // { id: 2, icon: <IoTrophy size={20} />, label: "Trofeo", href: "/" },
        // { id: 3, icon: <IoNotifications size={20} />, label: "Notificaciones", href: "/" },
        { id: 4, icon: <PiSignOutBold />, label: "Salir", href: "/" },
    ];

    return (
        <Componente>
            <div className="contenedor">
                {icons.map((item) => (
                    <Link key={item.id} href={item.href} title={item.label} className="icono">
                        <span className="icon-wrapper">{item.icon}</span>
                    </Link>
                ))}

            </div>
        </Componente>
    );
}

const Componente = styled.div`
    .contenedor {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 1rem;
        gap: 1.5rem;
    }

    .icono {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        text-decoration: none;

        .icon-wrapper {
            font-size: 20px;
            color: var(--ui-color-icon-neutral);
            transition: color 0.3s ease;
        }

        &:hover .icon-wrapper {
            color: var(--ui-color-icon-hover);
        }
    }

    @media (max-width: 480px) {

        .icono .icon-wrapper {
            font-size: 18px;
        }

    }

    @media (max-width: 320px) {
        .icono .icon-wrapper {
            font-size: 14px;
        }
    }
`;

