'use client';
import { styled } from '@/app/components/utils/rutas';

export default function ButtonLabelEstatus({ status_logico, onClick }) {
    return (
        <Component>
            <button
                onClick={onClick}
                className={`label-status-user ${status_logico ? 'activo' : 'inactivo'}`}
                style={{
                    backgroundColor: status_logico ? '#0465ac' : '#ebebeb',
                }}
            >
                {status_logico ? 'Activo' : 'Inactivo'}
            </button>
        </Component>
    );
}

const Component = styled.div`

    .label-status-user {
        border: none;
        border-radius: 5px;
        color: #fff;
        padding: 0.4rem 0.8rem;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.3s ease;
    }

    .label-status-user.inactivo {
        color: #444;
    }
`;
