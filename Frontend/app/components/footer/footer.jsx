"use client"; import { styled } from '@/app/components/utils/rutas';

export default function FooterDiv() { /* <ComponenteTest /> */

    return (
        <Footer>
            <div className="footer-content">
                <span>© 2025 Universidad de Oriente - Núcleo de Sucre</span>
                <span className="footer-link">Impulsando el aprendizaje en los OVAS</span>
            </div>
        </Footer>
    );
}

const Footer = styled.div`
    color: #0465ac;
    padding: 1.5rem 2rem;
    font-size: 0.95rem;
    font-family: var(--font-lexend);
    border-top: 1px solid #d1d5db;
    display: flex;
    justify-content: center;

    .footer-content {
        max-width: 1200px;
        width: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    .footer-link {
        font-size: 0.85rem;
        color: #777;
    }

    @media (max-width: 480px) {
        font-size: 0.8rem;
         .footer-link  {
            font-size: 0.7rem;
        }
        
    }

    @media (max-width: 320px) {

        font-size: 0.6rem;
         .footer-link  {
            font-size: 0.5rem;
        }
        
    }
`;