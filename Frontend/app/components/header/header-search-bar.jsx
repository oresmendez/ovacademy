'use client'; import { styled, textBarHeader, PropTypes } from '@/app/components/utils/rutas';

export default function HeaderSearchBar({ bgcolor }) {
    const { headerText } = textBarHeader(); // Obtener el texto del contexto

    return (
        <Componente bgcolor={bgcolor}>
            <div className="container-search-bar center-left">
                <div className="search-bar-text-details">
                    {headerText} 
                    {/* TEXTO DE PRUEBA - TEXTO DE PRUEBA - TEXT */}
                </div>
            </div>
        </Componente>
    );
}

const Componente = styled.div`

    .container-search-bar {
        /* background-color: var(--bg-nivel-1); */
        font-family: var(--font-lexend);
        color: var(--color-blanco);
        padding: 0 1.4rem;
        font-weight: 300;
    }

    .search-bar-text-details {
        padding: 0 2rem;
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


    @media (min-width: 2560px) {
        .container-search-bar {
            background-color: darkgoldenrod;
            height: 2.35rem;
        }
        .search-bar-text-details {
            font-size: 1.1rem;
        }
    }

    /* 🖥️ Monitores grandes y pantallas Full HD (1441px - 2559px) */
    @media (min-width: 1441px) and (max-width: 2559px) {
        .container-search-bar {
            background-color: ${props => props.bgcolor || '#0465ac'};
            /* background-color: #0c2c46; */
            height: 2.35rem;
        }
        .search-bar-text-details {
            font-size: 1.1rem;
        }
    }
        /* 🖥️ Escritorios estándar (1025px - 1440px) */
    @media (min-width: 1025px) and (max-width: 1440px) {
        .container-search-bar {
            background-color: darkcyan;
            height: 2.35rem;
        }
        .search-bar-text-details {
            font-size: 1.1rem;
        }
    }

        /* 💻 Tablets y pantallas pequeñas (769px - 1024px) */
    @media (min-width: 769px) and (max-width: 1024px) {
        .container-search-bar {
            background-color: darkviolet;
            height: 2.28rem;
        }
        .search-bar-text-details {
            font-size: 1rem;
        }
    }

        /* 📱 Móviles grandes y pequeñas tablets (481px - 768px) */
    @media (min-width: 481px) and (max-width: 768px) {
        .container-search-bar {
            background-color: red;
            height: 2.15rem;
        }
        .search-bar-text-details {
            font-size: 1rem;
        }
    }

        /* 📱 Móviles estándar (321px - 480px) */
    @media (min-width: 321px) and (max-width: 480px) {
        .container-search-bar {
            background-color: gray;
        }
        .search-bar-text-details {
            font-size: 1rem;
        }
    }

        /* 📱 Móviles pequeños (hasta 320px) */
    @media (max-width: 320px) {
        .container-search-bar {
            background-color: gold;
        }
        .search-bar-text-details {
            font-size: 1rem;
        }
    }


`;

HeaderSearchBar.propTypes = {
    bgcolor: PropTypes.string.isRequired,
};