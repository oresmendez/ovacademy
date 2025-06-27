'use client';
import { styled } from '@/app/components/utils/rutas';

export default function InputSearch({ filterText, setFilterText }) {
    return (
        <Component>
            <div className='search'>
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className='label-search p-05 ml-20'
                />
            </div>
        </Component>
    );
}

const Component = styled.div`

    .search{
        min-width:450px;
        margin-right:2rem;
    }

    .label-search {
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 0.5rem;
        width:100%;
    }
`;
