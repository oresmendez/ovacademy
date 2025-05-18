'use client';
import { useState, useParams, useEffect, Link, textBarHeader, styled, Profile} from '@/app/components/utils/rutas';


export default function Administrador_Materia() {

    const params = useParams();
    const { email } = params;

    const { setHeaderText } = textBarHeader();

    useEffect(() => {

        setHeaderText(<>
            <Link href={`/ovacademy/profesor/dashboard`}>Dashboard</Link>{/*
            */}<span className="separator">&gt;</span>{/*
            */}<Link href={`/ovacademy/profesor/estudiantes/`}>Estudiantes</Link>{/*
            */}<span className="separator">&gt;</span>{/*
            */}{decodeURIComponent(email)}
        </>);

    }, []);
  
  return (
    <Componente>
        <div className="layout-body">
            <div className="container-body">
				<Profile email = {decodeURIComponent(email)}/>
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
