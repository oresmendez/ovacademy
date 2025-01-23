'use client'; import { styled, textBarHeader } from '@/app/utils/hooks';

export default function Header_search_bar() {
    const { headerText } = textBarHeader(); // Obtener el texto del contexto

    return (
        <>
            <Componente>
                <div className="container-search-bar center-left">
                    <div className="search-bar-text-details">
                        {headerText} 
                    </div>
                </div>
            </Componente>
        </>
    );
}

const Componente = styled.div`

    .container-search-bar {
        background-color: var(--bg-nivel-1);
        height: 2.35rem;
        color: var(--color-blanco);
        padding: 0 1.4rem;

        font-family: var(--font-lexend);
        font-weight: 300;
        font-size: 1rem;
    }

    .search-bar-text-details {
        padding: 0 2rem;
        font-size: 1.1rem;  
    }

    .search-bar-text-details a {
        color: var(--color-blanco);
        text-decoration: none;
        cursor: pointer;
    }

    .search-bar-text-details a:hover {
        text-decoration: underline;
    }

    .separator{
        margin: 0 0.5rem;
    }
`;
