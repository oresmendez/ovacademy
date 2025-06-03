'use client'; import { useState, styled, useParams, apiRest, SopaDeLetras, Cuestionario, PreguntasAbiertas, textBarHeader, useEffect, Link} from '@/app/components/utils/rutas';


export default function Administrador_Materia() {

	const params = useParams();
	const { idUnidad } = params;

	const [activeTab, setActiveTab] = useState(0);
	const { setHeaderText } = textBarHeader();

	const [nameUnidad, setNameUnidad] = useState('');
	const [evaluaciones, seEvaluaciones] = useState([]);

	useEffect(() => {
		obtenerUnidad();
		obtenerEvaluaciones();
	}, []);

	useEffect(() => {
        if (nameUnidad) {
            setHeaderText(
                <>
                    <Link href={`/ovacademy/estudiante/dashboard`}>Inicio</Link>
                    <span className="separator">&gt;</span>
                    <Link href={`/ovacademy/estudiante/unidad/${idUnidad}`}>{nameUnidad}</Link>
                    <span className="separator">&gt;</span>
                    Evaluaciones
                </>
            );
        }
    }, [nameUnidad]);
	
	const TabClick = (index) => {
		setActiveTab(index);
	};

	const obtenerUnidad = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades/${idUnidad}`
            const response = await apiRest.fetchGet(url);
            if (response.status === 200) {
                setNameUnidad(`${response.data.data.modulo} - ${response.data.data.nombre}`);
            }

        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
        }
    };

	const obtenerEvaluaciones = async () => {
		try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/evaluaciones/${idUnidad}`
			const response = await apiRest.fetchGet(url);
			if (response.status === 200) {
				seEvaluaciones(response.data);
			}

		} catch (err) {
			console.error('Error al conectar con el servidor:', err);
		}
	};
	
	const tipoComponente = {
		1: {
			nombre: "Sopa de letras",
			componente: ({ idEvaluacion, idUnidad, typeId, notaEvaluacion }) =>
				<SopaDeLetras idEvaluacion={idEvaluacion} idUnidad={idUnidad} typeId={typeId} notaEvaluacion={notaEvaluacion}/>
		},
		2: {
			nombre: "Cuestionario",
			componente: ({ idEvaluacion, idUnidad, typeId, notaEvaluacion }) =>
				<Cuestionario idEvaluacion={idEvaluacion} idUnidad={idUnidad} typeId={typeId} notaEvaluacion={notaEvaluacion}/>
		},
		3: {
			nombre: "Preguntas Abiertas",
			componente: ({ idEvaluacion, idUnidad, typeId, notaEvaluacion }) =>
				<PreguntasAbiertas idEvaluacion={idEvaluacion} idUnidad={idUnidad} typeId={typeId} notaEvaluacion={notaEvaluacion}/>
		}
	};
	    
	return (
	<Componente>
		<div className="layout-body">
		<div className="container-body">
			<div className="tabs-container mt-10 p-10">
			<div className="tab-menu">
				{evaluaciones.map((comp, index) => (
				<button
					key={comp.id}
					className={activeTab === index ? "active" : ""}
					onClick={() => TabClick(index)}
				>
					{tipoComponente[comp.typeId]?.nombre || "Sin nombre"}
				</button>
				))}
			</div>
			<div className="tab-content">
				{evaluaciones.map((comp, index) => (
					activeTab === index && (
						<div key={comp.id} className="tab-panel">
						{tipoComponente[comp.typeId]?.componente({
							idEvaluacion: comp.id,
							idUnidad: comp.idUnidad,
							typeId: comp.typeId,
							notaEvaluacion: comp.notaEvaluacion
						})}
						</div>
					)
				))}
			</div>
			</div>
		</div>
		</div>
	</Componente>
	);
}

const Componente = styled.div`
    
    .layout-body {
      max-width: 115rem !important;
    }

    .tabs-container {
      display: flex;
      flex-direction: row;
      gap: 2rem;
      font-family: var(--font-lexend);
    }

    .tab-menu {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 200px;
    }

    .tab-menu button {
      padding: 0.8rem;
      border: none;
      background-color: #e0e0e0;
      border-radius: 0.5rem;
      cursor: pointer;
      text-align: left;
      font-size: 1rem;
      font-family: var(--font-lexend);
      transition: background-color 0.3s;
    }

    .tab-menu button.active {
      background-color: #33b0e4;
      color: white;
    }

    .tab-content {
      flex: 1;
    }

    .tab-panel {
      font-size: 1.2rem;
    }

    .units-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .units-table th,
    .units-table td {
      border: 1px solid #ddd;
      padding: 0.8rem;
      text-align: left;
      font-family: var(--font-lexend);
    }

    .units-table th {
      background-color: #33b0e4;
      color: white;
    }

    .action-button {
      background-color: #33b0e4;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.3rem;
      cursor: pointer;
      margin-right: 0.5rem;
    }

    .action-button:hover {
      background-color: #0d213a;
    }

  
`;
