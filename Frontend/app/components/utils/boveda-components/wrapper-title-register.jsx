"use client";
import { styled } from '@/app/components/utils/rutas';

export default function WrapperTitleRegister({ tittle, subtittle, ContentComponent }) {
    return (
        <Component>
            <div className='form-wrapper-top'>
                <div className="tab-header">
                    <h2>{tittle}</h2>
                    <p>{subtittle}</p>
                </div>
            </div>
            <div className="form-wrapper">
                <ContentComponent />
            </div>
        </Component>
    );
}

const Component = styled.div`

    .form-wrapper-top{
        padding:1rem;
        margin: 0;
    }

    .form-wrapper{
        padding:1rem;
        margin: 0;
    }

    .tab-header {

        padding: 1.2rem 1.5rem;
        background-color: #e8f4fb;
        border-left: 5px solid #007acc;
        border-radius: 0.5rem;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    }

    .tab-header h2 {
        margin: 0;
        font-size: 1.5rem;
        color: #005f99;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .tab-header p {
        margin-top: 0.5rem;
        color: #444;
        font-size: 1rem;
    }

`;
