"use client"; 
import { useState, useEffect } from 'react';
import { styled, PropTypes } from '@/app/components/utils/rutas';
import { IoReload } from "react-icons/io5";

export default function ButtonAccion({ 
    children, 
    type = "button", 
    onClick, 
    loading = false, 
    duration = 1500,
    color = "#0465ac",
    padding = "0.5rem 1rem" 
}) { 
    const [isLoading, setIsLoading] = useState(loading);

    // Maneja el tiempo de recarga (animación)
    useEffect(() => {
        let timeout;
        if (isLoading) {
            timeout = setTimeout(() => {
                setIsLoading(false); // Detiene la animación después del tiempo definido
            }, duration); // 'duration' es el tiempo en milisegundos
        }
        return () => clearTimeout(timeout); // Limpiar timeout si el componente se desmonta
    }, [isLoading, duration]);

    const handleClick = () => {
        setIsLoading(true); // Activa la animación
        if (onClick) onClick(); // Ejecuta la función onClick
    };

    return (
        <Component $color={color} $padding={padding}>
            <button
                type={type}
                onClick={handleClick}
                className="btn-accion"
            >
                {!children && <IoReload size={20} className={`btn-reload ${isLoading ? 'rotating' : ''}`} />}
                {children}
            </button>
        </Component>
    );
}

const Component = styled.div`

    .btn-accion {
        padding: 0.5rem 1rem; /* Espacio interno, suficiente sin exagerar */
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        background-color: #0465ac;
        display: inline-flex;               /* clave: inline-flex para que se ajuste al contenido */
        align-items: center;
        justify-content: center;
        gap: 0.5rem;                        /* espacio entre ícono y texto */
        white-space: nowrap;               /* evita que se corte el texto en varias líneas */
    }

    .btn-reload {
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); /* Curva de Bézier */
    }

    .btn-reload.rotating {
        animation: spin 1s infinite cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

`;


ButtonAccion.propTypes = {
    children: PropTypes.node,
    type: PropTypes.string,
    onClick: PropTypes.func,
    loading: PropTypes.bool,
    duration: PropTypes.number, // Añadido para definir la duración del efecto
};
