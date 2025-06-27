"use client"; import { useState, styled, HeaderSearchBar, Header, Nav } from '@/app/components/utils/rutas';

export default function HeaderPrincipal() {
    const [activarMenu, setActivarMenu] = useState(false);

    const handleActivarMenu = () => {
        setActivarMenu(!activarMenu);
    };
    
    return (
        <Componente>
            <div className="layout-header">
                <div className="container-header">
                    <Header status={activarMenu} handleClick={handleActivarMenu} />
                </div>
                <HeaderSearchBar/>
            </div>
            <Nav status={activarMenu} handleClick={handleActivarMenu} />
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

    @media (max-width: 480px) {
        .container-header {
             padding: 0;
        }
    }
`;
