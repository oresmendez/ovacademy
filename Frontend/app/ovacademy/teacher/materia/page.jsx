'use client';
import { styled } from '@/app/utils/hooks';
import { useState } from 'react';
import Crear_materia from '@/app/components/crear_materia';
import Listar_materias from '@/app/components/listar_materias';



export default function FormularioUnidadesContenidos() {
    const [activeTab, setActiveTab] = useState(0);
    

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    return (
        <Componente>
            <div className="layout-body">
                <div className="container-body">
                    <div className="banner-dashboard center">
                        <span className="banner-dashboard-text">
                            Formulación y Evaluación de Proyectos
                        </span>
                    </div>
                    <div className="description-subjects-general mt-10 p-10">

                    </div>
                    <div className="tabs-container">
                        <div className="tab-menu">
                            <button
                                className={activeTab === 0 ? 'active' : ''}
                                onClick={() => handleTabClick(0)}
                            >
                                Unidades
                            </button>
                            <button
                                className={activeTab === 1 ? 'active' : ''}
                                onClick={() => handleTabClick(1)}
                            >
                                Nueva Unidad
                            </button>
                            <button
                                className={activeTab === 2 ? 'active' : ''}
                                onClick={() => handleTabClick(2)}
                            >
                                Estadísticas
                            </button>
                        </div>
                        <div className="tab-content">
                            {activeTab === 0 && (
                                <div className="tab-panel">
                                    <h2>Unidades Disponibles</h2>
                                    <p>A continuación, se listan las unidades disponibles:</p>
                                    <Listar_materias />
                                </div>
                            )}
                            {activeTab === 1 && (
                                <div className="tab-panel">
                                    <Crear_materia statusTab={setActiveTab}/>
                                </div>
                            )}
                            {activeTab === 2 && (
                                <div className="tab-panel">
                                    <h2>Estadísticas</h2>
                                    <p>Aquí puedes ver las estadísticas de las unidades.</p>
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
        max-width: 110rem !important;
    }

    .banner-dashboard {
        width: 100%;
        height: 5rem;
        background: linear-gradient(to right, #33b0e4, #0d213a);
        border-radius: 0.5rem;
        flex-direction: column;
        color: white;
        font-family: var(--font-lexend);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .banner-dashboard-text {
        font-weight: 600;
        font-size: 2rem;
    }

    .description-subjects-general {
        width: 100%;
        font-family: var(--font-lexend);
        color: black;
        font-weight: 400;
        font-size: 1.3rem;
        text-align: justify;
        margin-bottom: 2rem;
    }

    .tabs-container {
        display: flex;
        flex-direction: row;
        gap: 2rem;
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

    .units-table th, .units-table td {
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
