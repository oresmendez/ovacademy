'use client'; import { useState, useEffect, styled, apiRest, textBarHeader, BannerMateria, CarrouselMain, Spinner, Footer } from '@/app/components/utils/rutas';
import { FaExclamationCircle } from 'react-icons/fa'; // Asegúrate de instalar react-icons

export default function DashboardPage() {

    const [showSpinner, setShowSpinner] = useState(false);
	const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);

    const [unidades, setUnidades] = useState([]);
    const { setHeaderText } = textBarHeader();

    const [estudianteMatriculado, setEstudianteMatriculado] = useState(null);

    useEffect(() => {
        setHeaderText((<> Inicio</>));
        obtenerUnidades();
    }, []);

    const obtenerUnidades = async () => {
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades/estudiante`
            const response = await apiRest.fetchGet(url);
            console.log(response)
            if (response.status === 200) {
                setUnidades(response.data.data);
                setEstudianteMatriculado(1);
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
        }finally { clearTimeout(timeout); setShowSpinner(false);setIsLoadingRespuestas(false);}
    };

    let contenido;

    if (showSpinner || isLoadingRespuestas) {
        contenido = <Spinner show={showSpinner} />;
    } else {
        contenido = (
            <div className='layout-body'>
                <div className='container-body'>
                    <BannerMateria />
                    {estudianteMatriculado ? (
                        <>
                            <CarrouselMain boxes={unidades} tittle={"Unidades Disponibles"} description={"Descubre una amplia selección de unidades diseñadas para ampliar tus conocimientos y fortalecer tus habilidades en áreas clave"}/>
                        </>
                    ) : (
                        <>
                            <div style={containerStyle}>
                                <FaExclamationCircle style={iconStyle} />
                                <h2 style={titleStyle}>No estás matriculado</h2>
                                <p style={messageStyle}>Usted no se encuentra aún matriculado. Por favor, contacte a su profesor para que actualice su estado.</p>
                            </div>
                            
                            <Footer />
                        </>
                    )}
                </div>
            </div>
        );
    }

    return <Component>{contenido}</Component>;

}

const Component = styled.div``;

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',

    borderRadius: '16px',
    padding: '40px',
    fontFamily: 'Segoe UI, Roboto, sans-serif',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '0 auto',
  };

  const iconStyle = {
    fontSize: '48px',
    color: '#ff6b6b',
    marginBottom: '20px',
  };

  const titleStyle = {
    fontSize: '22px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  };

  const messageStyle = {
    fontSize: '18px',
    color: '#666',
    lineHeight: '1.5',
  };