'use client'; import { styled } from '@/app/utils/hooks';

import DataTable from 'react-data-table-component';

export default function DataTable_index({ columns, data }) {
    return (
        <Componente>
            <div className='mt-20'>
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    highlightOnHover
                    pointerOnHover
                    responsive
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
  
`;