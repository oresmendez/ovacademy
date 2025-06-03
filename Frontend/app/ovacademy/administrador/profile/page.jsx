'use client'; import { styled, Profile, textBarHeader, useEffect, Link} from '@/app/components/utils/rutas';

export default function MiProfile() {

    const { setHeaderText } = textBarHeader();

    useEffect(() => {

        setHeaderText(<>
            <Link href={`/ovacademy/administrador/dashboard`}>Inicio</Link>{/*
            */}<span className="separator">&gt;</span>{/*
            */}Mi Perfil
        </>);

    }, []);
  
    return (
        <Componente>
            <div className="layout-body">
                <div className="container-body">
                    <Profile />
                </div>
            </div>
        </Componente>
    );
}

const Componente = styled.div`
  
  .layout-body {
    max-width: 115rem !important;
  }
  
`;
