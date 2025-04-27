"use client"; import { styled, PropTypes } from '@/app/components/utils/rutas';
import { RiErrorWarningLine } from "react-icons/ri";

/*<InputField label="Módulo de la unidad" value={modulo} onChange={setModulo} placeholder="Módulo de la unidad" required /> */

export default function InputField({ label, type = "text", placeholder, required = false, field, form }) {

    const error = form.touched[field.name] && form.errors[field.name];

    return (
        <Component>
            <div className="form-group">
                <label className="form-label">{label}</label>
                <input
                    {...field}
                    type={type}
                    className={`form-input ${error ? 'has-error' : ''}`}
                    placeholder={placeholder}
                    required={required}
                />
                {form.touched[field.name] && form.errors[field.name] && (
                    <div className="error center-left">
                        <RiErrorWarningLine  color="red" size={20} className='icon-warning'/>
                        <div className='error-text'>

                            {form.errors[field.name]}
                        </div>
                    </div>
                )}
            </div>
        </Component>
    );
}

const Component = styled.div`

    .form-input {
        width: 100%;
        padding: 10px 14px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s, box-shadow 0.3s;
    }

    .form-input:focus {
        border-color: #0465ac;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
        outline: none;
    }

    .form-input.has-error {
        border-color: red;
    }

    .error {
        color: red;
        font-size: 16px;
    }

    .error-text {
        padding-top:1rem;
    }

    .icon-warning {
        margin-top: 16.5px;
        margin-right: 7px;
    }
`;

InputField.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    field: PropTypes.object.isRequired,  
    form: PropTypes.object.isRequired    
};
