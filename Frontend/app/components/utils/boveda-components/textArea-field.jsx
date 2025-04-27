"use client";
import { styled, PropTypes } from '@/app/components/utils/rutas';
import { RiErrorWarningLine } from "react-icons/ri";

export default function TextAreaField({ label, placeholder, required = false, field, form }) {
    const error = form.touched[field.name] && form.errors[field.name];

    return (
        <Component>
            <div className="form-group">
                {label && <label className="form-label" htmlFor={field.name}>{label}</label>}
                <textarea
                    {...field}
                    className={`form-textarea ${error ? 'has-error' : ''}`}
                    placeholder={placeholder}
                    required={required}
                    rows="4"
                />
                {error && 
                    <div className="error center-left">
                        <RiErrorWarningLine  color="red" size={20} className='icon-warning'/>
                            <div className='error-text'>
                                {form.errors[field.name]}
                            </div>
                    </div>
                }

            </div>
        </Component>
    );
}

const Component = styled.div`

    .form-textarea {
        width: 100%;
        padding: 10px 14px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s, box-shadow 0.3s;
        resize: none;
        overflow-y: auto;
        height: 150px;
    }

    .form-textarea:focus {
        border-color: #0465ac;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
        outline: none;
    }

    .form-textarea.has-error {
        border-color: red;
    }

    .error {
        color: red;
        font-size: 16px;
        margin-top: 5px;
    }

    .error-text {
        padding-top:1rem;
    }

    .icon-warning {
        margin-top: 16.5px;
        margin-right: 7px;
    }
`;

TextAreaField.propTypes = {
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    field: PropTypes.object.isRequired, // proporcionado por Formik
    form: PropTypes.object.isRequired   // proporcionado por Formik
};
