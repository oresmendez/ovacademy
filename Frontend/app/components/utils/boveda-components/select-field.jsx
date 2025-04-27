"use client"; import { styled, Select } from '@/app/components/utils/rutas';
import { RiErrorWarningLine } from "react-icons/ri";

export default function SelectField({
    label,
    options,
    value,
    onChange,
    placeholder = "Selecciona una opcion...",
    isClearable = true,
    field,
    form,
    ...rest
  }) { 

    const error = form.touched[field.name] && form.errors[field.name];

    return (
        <Component>
            <div className="form-group">
                <label className="form-label">{label}</label>
                <Select
                    options={options}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    styles={customStyles}
                    className={`form-input ${error ? 'has-error' : ''}`}
                    isClearable={isClearable}
                    {...rest}
                />
                {error && (
                    <div className="error center-left">
                        <RiErrorWarningLine color="red" size={20} className='icon-warning' />
                        <div className='error-text'>{form.errors[field.name]}</div>
                    </div>
                )}
            </div>
        </Component>
    );
}



const Component = styled.div`
    .error {
        color: red;
        font-size: 16px;
    }

    .error-text {
        padding-top: 1rem;
    }

    .icon-warning {
        margin-top: 16.5px;
        margin-right: 7px;
    }

    .form-input.has-error {
        border-color: red;
    }

    .form-input:focus {
        border-color: #0465ac;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
        outline: none;
    }

    
`;

const customStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      borderColor: "#ccc",
      borderRadius: "4px",
      padding: "5px",
      fontSize: "16px",
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected ? "#0465ac" : isFocused ? "#e0e0e0" : "white",
      color: isSelected ? "white" : "#333",
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: "#0465ac",
      color: "white",
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: "white",
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: "white",
      ":hover": { backgroundColor: "red", color: "white" },
    }),
};
  