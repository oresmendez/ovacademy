'use client';
import { styled, Profile, textBarHeader, useEffect, Link} from '@/app/components/utils/rutas';


export default function Administrador_Materia() {

    const { setHeaderText } = textBarHeader();

    useEffect(() => {

        setHeaderText(<>
            <Link href={`/ovacademy/estudiante/dashboard`}>Dashboard</Link>{/*
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
    max-width: 110rem !important;
  }
  
`;
