"use client"; import { styled } from '@/app/components/utils/rutas';

import Modal from 'react-awesome-modal';

export default function ModalField({ visible, cerrarModal, onclick, width, height, title, mensaje }) {

    return (
        <Component>

            <Modal
                visible={visible}
                width={width}
                height={height}
                effect="fadeInUp"
                onClickAway={cerrarModal}
            >
                <div style={estilos.modal}>
                    <h2 style={estilos.titulo}>{title}</h2>
                    <p style={estilos.mensaje}>{mensaje}</p>
                <div style={estilos.botones}>
                    <button onClick={onclick} style={{ ...estilos.boton, ...estilos.confirmar }}>
                    Confirmar
                    </button>
                    <button onClick={cerrarModal} style={{ ...estilos.boton, ...estilos.cancelar }}>
                    Cancelar
                    </button>
                </div>
                </div>
            </Modal>

        </Component>
    );
}

const Component = styled.div`

`;

const estilos = {
    botonAbrir: {
      padding: '12px 24px',
      backgroundColor: '#1565c0',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '18px',
    },
    modal: {
      padding: '30px',
      textAlign: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      backgroundColor: '#fdfdfd',
      borderRadius: '12px',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
    },
    titulo: {
      fontSize: '28px',
      color: '#333',
      marginBottom: '25px',
      fontWeight: 'bold',
    },
    mensaje: {
      fontSize: '20px',
      color: '#444',
      marginBottom: '30px',
      lineHeight: '1.8',
    },
    botones: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
    },
    boton: {
      padding: '14px 28px',
      fontSize: '18px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    confirmar: {
      backgroundColor: '#e53935',
      color: '#fff',
    },
    cancelar: {
      backgroundColor: '#e0e0e0',
      color: '#333',
    },
  };