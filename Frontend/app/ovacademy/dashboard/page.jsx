'use client';
import { useState, useEffect, styled, apiRest, textBarHeader, gestorCookie, useRouter } from '@/app/utils/hooks';
import CarrouselMain from '@/app/components/carrousel-main';

export default function DashboardPage() {
    const [unidades, setUnidades] = useState([]);
    const [materia, setMateria] = useState(null);

    const { setHeaderText } = textBarHeader();
    const router = useRouter();

    const validateUser = async () => {
        await gestorCookie.validateTypeId(router, 1);
    };

    useEffect(() => {
        setHeaderText((<> Dashboard</>));
        // validateUser();

        const fetchData = async () => {
            try {
                
                const Materia_ = await apiRest.fetchGet('http://localhost:1337/api/materias');

                if (Materia_?.data?.data?.length > 0) {
                    setMateria(Materia_.data.data[0]);

                    const Unidades_ = await apiRest.fetchGet(`http://localhost:1337/api/unidads?filters[materia][id][$eq]=${Materia_.data.data[0].id}&sort=unidad:asc`);
                    setUnidades(Unidades_.data.data);

                } else {
                    console.error("La respuesta de materias no contiene datos:", Materia_);
                }

                

            } catch (err) {
                console.error('Error al conectar con el servidor:', err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (materia) {
            console.log("✅ Nuevo valor de unidades:", materia);
        }
    }, [materia]); // Se ejecutará cuando nameMateria cambie

    return (
        <Componente>
            <div className='layout-body'>
                <div className='container-body'>
                    <div className='banner-dashboard center'>
                        <span className='banner-dashboard-text'>{materia?.nombre || 'Nombre de la materia'}</span>
                        <p className='banner-dashboard-description'>
                            Convierte ideas en proyectos, y proyectos en éxito. Tu ova para diseñar proyectos sostenibles y rentables.
                        </p>
                    </div>
                    <div className='description-subjects-general mt-10 p-10'>
                        <p>
                            {materia?.descripcion?.[0]?.children?.[0]?.text?.trim() || "Sin descripción disponible."}
                        </p>
                    </div>
                    <CarrouselMain boxes={unidades} tittle={"Unidades Disponibles"} description={"Descubre una amplia selección de unidades diseñadas para ampliar tus conocimientos y fortalecer tus habilidades en áreas clave"}/>
                </div>
            </div>
        </Componente>
    );
}

const Componente = styled.div`
    .banner-dashboard {
        width: 100%;
        height: 10rem;
        background: linear-gradient(to right, #33b0e4, #0d213a);
        border-radius: 0.5rem;
        flex-direction: column;
        color: white;
        font-family: var(--font-lexend);
    }

    .description-subjects-general {
        width: 100%;
        font-family: var(--font-lexend);
        color: black;
        font-weight: 400;
        font-size: 1.3rem;
        text-align: justify;
    }

    .banner-dashboard-text {
        font-weight: 600;
        font-size: 2rem;
    }

    .banner-dashboard-slogan {
        font-size: 1.5rem;
        font-weight: 100;
        margin: 5px 0;
    }

    .banner-dashboard-description {
        font-size: 1.2rem;
        font-weight: 300;
        margin-top: 0.5rem;
        line-height: 1.5;
    }
`;
