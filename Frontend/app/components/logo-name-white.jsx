'use client';

import React from 'react';
import styled from 'styled-components';
import Image from "next/image";
import '@/app/globals.css';
import Link from 'next/link';

export default function Logo_Name_White() {
    return (
    <Componente>
        <Link href="/" passHref>
            <div className='logo center'>             
                <Image
                    src="/logo-white.svg"
                    alt="Logo de la empresa"
                    width={45}
                    height={45}
                    priority
                />
                <div className='logo-name center'>OVACADEMY</div>
            </div>
        </Link>
        <div className='slogan center'>
            Academia Digital a tus manos
        </div>
    </Componente>
    );
}

const Componente = styled.div`

    .logo {
        margin-bottom: 1rem;
        cursor: pointer;
    }

    .logo-name {
        margin-left: 1rem;
        color: white;
        font-family: var(--font-lexend);
        font-weight: 600;
        font-size: 2rem;
    }

    .slogan {
        color: white;
        font-weight: 400;
        font-family: var(--font-lexend);
        margin-bottom: 1rem;
    }
  
`;