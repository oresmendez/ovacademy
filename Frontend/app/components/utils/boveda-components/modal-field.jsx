"use client";
import { styled } from '@/app/components/utils/rutas';
import Modal from 'react-awesome-modal';
import {
  IoWarningOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline
} from "react-icons/io5";

export default function ModalField({ visible, cerrarModal, onclick, width, height, title, mensaje, PropTypes }) {
  return (
    <Wrapper>
      <Modal
        visible={visible}
        width={width}
        height={height}
        effect="fadeInUp"
        onClickAway={cerrarModal}
      >
        <ModalContainer>
          <IconWrapper>
            <IoWarningOutline size={48} color="#f59e0b" />
          </IconWrapper>

          <Title>{title}</Title>
          <Message>{mensaje}</Message>

          <ButtonGroup>
            <ConfirmButton onClick={onclick}>
              <IoCheckmarkCircleOutline size={20} style={{ marginRight: '8px' }} />
              Confirmar
            </ConfirmButton>

            <CancelButton onClick={cerrarModal}>
              <IoCloseCircleOutline size={20} style={{ marginRight: '8px' }} />
              Cancelar
            </CancelButton>
          </ButtonGroup>
        </ModalContainer>
      </Modal>
    </Wrapper>
  );
}

// Estilos
const Wrapper = styled.div``;

const ModalContainer = styled.div`
  margin-top: -160px; /* Esto sube el modal un poco */
  padding: 2.5rem;
  background-color: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  text-align: center;
  font-family: var(--font-lexend);
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #1f2937;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.5rem;
  color: #4b5563;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const BaseButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
`;

const ConfirmButton = styled(BaseButton)`
  background-color: #10b981;
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

  &:hover {
    background-color: #059669;
  }
`;

const CancelButton = styled(BaseButton)`
  background-color: #e5e7eb;
  color: #374151;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.1);

  &:hover {
    background-color: #d1d5db;
  }
`;
