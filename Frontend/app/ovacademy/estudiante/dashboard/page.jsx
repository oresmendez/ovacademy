'use client'; import { useState, useEffect, styled, apiRest, textBarHeader, BannerMateria, CarrouselMain, Spinner, Footer, MessageError } from '@/app/components/utils/rutas';

export default function DashboardPage() {

    const [showSpinner, setShowSpinner] = useState(false);
	const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);

    const [unidades, setUnidades] = useState([]);
    const { setHeaderText } = textBarHeader();

    const [estudianteMatriculado, setEstudianteMatriculado] = useState(false);
    const [sinUnidades, setSinUnidades] = useState(false);

    useEffect(() => {
        setHeaderText((<> Inicio</>));
        obtenerEstudiantesInscritos();
        obtenerUnidades();
    }, []);

    const obtenerEstudiantesInscritos = async () => {
		let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
			
			const url = `${process.env.NEXT_PUBLIC_API_URL}/aula/estudianteMatriculado`
			const response = await apiRest.fetchGet(url);
			if (response.status === 200) {
				setEstudianteMatriculado(true);
			} else {
				// console.error('La respuesta de la API no contiene datos válidos.');
			}
		} catch (err) {
			console.error('Error al conectar con el servidor:', err);
		}finally { clearTimeout(timeout); setShowSpinner(false);setIsLoadingRespuestas(false);}
	};

    const obtenerUnidades = async () => {
        let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades/estudiante`
            const response = await apiRest.fetchGet(url);
            
            if (response.status === 200) {
                setUnidades(response.data.data);
                setSinUnidades(true);
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
                <div className="container-body">
                <BannerMateria />
                {estudianteMatriculado ? (
                    sinUnidades ? (
                        <CarrouselMain
                            boxes={unidades}
                            tittle="Unidades Disponibles"
                            description="Descubre una amplia selección de unidades diseñadas para ampliar tus conocimientos y fortalecer tus habilidades en áreas clave"
                        />
                    ) : (
                        <MessageError message={"Estás matriculado, pero aún no se te han asignado unidades. Vuelve a revisar más tarde o contacta a tu profesor."}/>
                    )
                ) : (
                    <MessageError message={"Usted no se encuentra aún matriculado. Por favor, contacte a un profesor de la materia para que actualice su estado."}/>
                )}
            </div>
            </div>
        );
    }

    return <Component>{contenido}<Footer /></Component>;

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