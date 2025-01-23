'use client';

import React, { useState } from "react";
import styled from 'styled-components';
import '@/app/globals.css';

import Header from '@/app/components/header/header-app';
import Header_search_bar from '@/app/components/header/header-search-bar';
import Nav from '@home/components/nav/main';

export default function Header_app() {
    const [ActivarMenu, setActivarMenu] = useState(false);

    const handleActivarMenu = () => {
        setActivarMenu(!ActivarMenu);
    };
    
    return (
        <Componente>
            <div className="layout-header">
                <div className="container-header">
                    <Header status={ActivarMenu} handleClick={handleActivarMenu} />
                </div>
                <Header_search_bar/>
            </div>
            <Nav status={ActivarMenu} handleClick={handleActivarMenu} />
        </Componente>
    );
}

const Componente = styled.div`
    .layout-header {
        position: fixed; 
        top: 0;
        left: 0;
        width: 100%;
        height: var(--size--header);
        max-height: var(--size--header);
        z-index: 10;
    }

    .container-header {
        height: inherit;
        background-color: var(--color-blanco);
        padding: 0 2.3rem;
    }
`;
