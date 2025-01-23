'use client';

import Image from "next/image";
import {Toaster} from 'sonner'
import styled from 'styled-components';

export default function AdminTeacherLayout({ children }) {
    return (
       
        <Componente>
            <Image
                src="/bg.jpg"
                alt="Background Image"
                fill
                style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%"
                }}
                priority
            />
            <div className="auth-container-content">
                {children}
            </div>
        </Componente>
    );
}

const Componente = styled.div`

    .auth-container-content {
        width: 100%;
        height: 100%;
        overflow-y: auto; /* Permite el scroll solo en el contenido */
    }

`;
