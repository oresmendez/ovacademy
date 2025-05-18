"use client";
import { styled } from '@/app/components/utils/rutas';
import PropTypes from 'prop-types';
import { useState } from 'react';

export default function ButtonSave({ 
    children, 
    type = "button", 
    onClick, 
    className = "", 
    disabled = false, 
    bgColor, 
    hoverColor,
    animation = true
}) {
    const [loading, setLoading] = useState(false);

    const handleClick = async (e) => {
        setLoading(true);

        const clickPromise = onClick ? onClick(e) : Promise.resolve();
        const delay = new Promise(res => setTimeout(res, 1000));

        await Promise.all([clickPromise, delay]);

        setLoading(false);
    };

    return (
        <StyledButton
            type={type}
            onClick={handleClick}
            className={className}
            disabled={disabled || loading}
            $bgColor={bgColor}
            $hoverColor={hoverColor}
        >
            {(loading && animation) && <Spinner />}
            {children}
        </StyledButton>
    );
}

const StyledButton = styled.button`
  width: 15%;
  padding: 12px;
  background: ${({ $bgColor }) => $bgColor || '#0465ac'};
  color: white;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: ${({ $hoverColor }) => $hoverColor || '#0056b3'};
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  border: 3px solid white;
  border-top: 3px solid transparent;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

ButtonSave.propTypes = {
    children: PropTypes.node,
    type: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    bgColor: PropTypes.string,
    hoverColor: PropTypes.string,
    animation: PropTypes.bool
};
