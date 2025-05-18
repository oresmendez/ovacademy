"use client"; import { styled } from '@/app/components/utils/rutas';

import { FaExclamationCircle } from 'react-icons/fa'; // Asegúrate de instalar react-icons

export default function MessageError({message}) { /* <ComponenteTest /> */




    return (
        

        <div style={containerStyle}>
            <FaExclamationCircle style={iconStyle} />
            <h2 style={titleStyle}>Información no disponible</h2>
            <p style={messageStyle}>
                {message}
            </p>
        </div>

       
    );
}



const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',

    borderRadius: '16px',
    padding: '40px',
    fontFamily: 'Segoe UI, Roboto, sans-serif',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '0 auto',
  };

  const iconStyle = {
    fontSize: '48px',
    color: '#ff6b6b',
    marginBottom: '20px',
  };

  const titleStyle = {
    fontSize: '22px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  };

  const messageStyle = {
    fontSize: '18px',
    color: '#666',
    lineHeight: '1.5',
  };