'use client'; import { styled } from '@/app/components/utils/rutas';

import DataTable from 'react-data-table-component';

export default function DataTableIndex({ columns, data }) {
    return (
        <Componente>
            <div className='mt-20 index-datatable'>
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    highlightOnHover
                    pointerOnHover
                    responsive
                    noDataComponent={
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#6c757d',
                            fontSize: '18px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <div style={{ fontSize: '55px' }}>📉</div>
                            <div>No hay datos disponibles</div>
                            <div style={{ fontSize: '18px' }}>Por favor, intenta con otros filtros o revisa más tarde.</div>
                        </div>
                    }
                    
                    customStyles={{
                        rows: {
                            style: {
                                
                                fontSize: '16px', // Cambia el tamaño de la fuente de las filas
                            },
                        },
                        headCells: {
                            style: {
                                fontSize: '18px', // Cambia el tamaño de la fuente de las cabeceras
                                fontWeight: 'bold', // Opcional, para resaltar las cabeceras
                                backgroundColor: '#3498db24',
                            },
                        },
                        cells: {
                            style: {
                                fontSize: '16px', // Cambia el tamaño de la fuente de las celdas
                            },
                        },
                    }}
                />
            </div>
        </Componente>
    );
}

const Componente = styled.div`

    .index-datatable {
        font-family: var(--font-lexend);
    }
  
`;