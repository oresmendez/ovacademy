'use client'; import {Link, styled, Image } from '@/app/components/utils/rutas';

export default function LogoNameWhite() {
    return (
    <Componente>
        <Link href="/" passHref>
            <div className='logo center'>             
                <Image
                    src="/logoUdo.png"
                    alt="Logo de la empresa"
                    width={100}
                    height={100}
                    priority
                />
                
            </div>
            <div className='logo-name center'>UNIVERSIDAD DE ORIENTE</div>
        </Link>
        <div className='slogan center'>
            Conocimiento digital, aprendizaje sin límites
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
        margin-left: 0.5rem;
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