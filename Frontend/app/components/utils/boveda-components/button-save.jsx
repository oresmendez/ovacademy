"use client";
import { styled, PropTypes } from '@/app/components/utils/rutas';

/* <ButtonSave type="submit" className="mt-20" classFather="center" onClick={() => alert("¡Haz hecho clic!")}>Guardar</ButtonSave> */

export default function ButtonSave({ children, type = "button", onClick, className = "", classFather = "", disabled = false }) {
    return (
        <Component>
            <div className={`${classFather}`}>
                <button
                    type={type}
                    onClick={onClick}
                    className={`btn-primary ${className}`}
                    disabled={disabled}
                >
                    {children}
                </button>
            </div>
        </Component>
    );
}

const Component = styled.div`
    .btn-primary {
        width: 20%;
        padding: 12px;
        background: #0465ac;
        color: white;
        font-size: 1.1rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.3s;
    }

    .btn-primary:hover {
        background: #0056b3;
    }

    .btn-primary:disabled {
        background: #cccccc;
        cursor: not-allowed;
    }
`;

ButtonSave.propTypes = {
    children: PropTypes.node,
    type: PropTypes.string,
    className: PropTypes.string,
    classFather: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
};