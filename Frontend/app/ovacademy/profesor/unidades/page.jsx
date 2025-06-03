'use client'; import { useState, styled, CrearUnidades, ListarUnidades, textBarHeader, useEffect, AsociarEstudianteSemestre, Link, WrapperTitleRegister} from '@/app/components/utils/rutas';


export default function Administrador_Materia() {
  const [activeTab, setActiveTab] = useState(1);

  const { setHeaderText } = textBarHeader();

  useEffect(() => {

      setHeaderText(<>
          <Link href={`/ovacademy/profesor/dashboard`}>Inicio</Link>{/*
          */}<span className="separator">&gt;</span>{/*
          */}Unidades
      </>);

  }, []);
  
  const TabClick = (index) => {
    setActiveTab(index);
  };

  
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
                    <WrapperTitleRegister tittle={"📘 Registro de Unidades"} 
					subtittle={"Organiza y estructura tus contenidos creando nuevas unidades temáticas"} 
					ContentComponent={() => <CrearUnidades TabClick={TabClick} />} />
                </div>
              )}

              {activeTab === 1 && (
                <div className="tab-panel">
                  <ListarUnidades />
                </div>
              )}

              {activeTab === 2 && (
                <div className="tab-panel">
                  <AsociarEstudianteSemestre />
                </div>
              )}
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
