"use client";

import React from "react";
import styled from "styled-components";
import { IoSearch, IoTrophy, IoNotifications } from "react-icons/io5";
import { PiSignOutBold } from "react-icons/pi";
import Link from 'next/link'; // Importa el componente Link
import '@/app/globals.css';

export default function IconGroup() {
    const icons = [
        // { id: 1, icon: <IoSearch size={20} />, label: "Buscar", href: "/" },
        // { id: 2, icon: <IoTrophy size={20} />, label: "Trofeo", href: "/" },
        // { id: 3, icon: <IoNotifications size={20} />, label: "Notificaciones", href: "/" },
        { id: 4, icon: <PiSignOutBold size={20} />, label: "Salir", href: "/" },
    ];

    return (
        <Componente>
            <div className="contenedor">
                {icons.map((item) => (
                    <Link key={item.id} href={item.href} title={item.label} className="icono">
                        {item.icon}
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
        font-size: var(--ui-size-icon-sm);
        color: var(--ui-color-icon-neutral);
        transition: color 0.3s ease;
        text-decoration: none; /* Elimina subrayado del link */

        &:hover {
            color: var(--ui-color-icon-hover); 
        }
    }
`;
