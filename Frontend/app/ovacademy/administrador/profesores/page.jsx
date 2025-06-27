'use client'; import { useState, useEffect, styled, CrearProfesor, ListarProfesores, textBarHeader, Link, WrapperTitleRegister, Footer, Spinner} from '@/app/components/utils/rutas';


export default function Administrador_Materia() {

	const [isClient, setIsClient] = useState(false);
	const [activeTab, TabClick] = useState(1);
	const { setHeaderText } = textBarHeader();

	useEffect(() => {
		setHeaderText(<>
			<Link href={`/ovacademy/administrador/dashboard`}>Inicio</Link>{/*
			*/}<span className="separator">&gt;</span>{/*
			*/}Profesores
		</>);
		const timeout = setTimeout(() => {
            setIsClient(true);
        }, 500);
        return () => clearTimeout(timeout);
	}, []);

	if (!isClient) {
        return <Spinner show={true} />;
    }
 
	return (
		<Componente>
		<div className="layout-body">
			<div className="container-body">
			<div className="tabs-container mt-10 p-10">
				<div className="tab-menu">
				<button
					className={activeTab === 0 ? "active" : ""}
					onClick={() => TabClick(0)}
				>
					Registrar
				</button>
				<button
					className={activeTab === 1 ? "active" : ""}
					onClick={() => TabClick(1)}
				>
					Listado
				</button>
				</div>
				<div className="tab-content">
				{activeTab === 0 && (
					<div className="tab-panel">
						<WrapperTitleRegister tittle={"📘 Registrar Profesor"} 
						subtittle={" Por favor, complete la información para registrar al profesor"} 
						ContentComponent={() => <CrearProfesor TabClick={TabClick} />} />
					</div>
				)}

				{activeTab === 1 && (
					<div className="tab-panel">
						<ListarProfesores />
					</div>
				)}
				</div>
			</div>
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

`;
