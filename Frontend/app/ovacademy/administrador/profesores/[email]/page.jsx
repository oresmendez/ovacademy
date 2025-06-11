'use client';
import { useState, useParams, useEffect, Link, textBarHeader, styled, Profile, Footer} from '@/app/components/utils/rutas';


export default function Administrador_Materia() {

    const params = useParams();
    const { email } = params;

    const { setHeaderText } = textBarHeader();

    useEffect(() => {

        setHeaderText(<>
            <Link href={`/ovacademy/administrador/dashboard`}>Inicio</Link>{/*
            */}<span className="separator">&gt;</span>{/*
            */}<Link href={`/ovacademy/administrador/profesores/`}>Profesores</Link>{/*
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
        <Footer />
    </Componente>
  );
}

const Componente = styled.div`
  
  .layout-body {
    max-width: 115rem !important;
  }
  
`;
