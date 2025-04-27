"use client";
import { useEffect, useState } from 'react';
import { styled } from '@/app/components/utils/rutas';

export default function Spinner({ show = false }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [show]);

  return visible ? (
    <Overlay>
      <DotsContainer>
        <Dot style={{ animationDelay: '0s' }} />
        <Dot style={{ animationDelay: '0.2s' }} />
        <Dot style={{ animationDelay: '0.4s' }} />
      </DotsContainer>
    </Overlay>
  ) : null;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(189, 181, 181, 0.116);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const DotsContainer = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: center;
`;

const Dot = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #3498db;
  animation: pulse 1.4s infinite ease-in-out;

  @keyframes pulse {
    0%, 80%, 100% {
      transform: scale(0.75);
      opacity: 0.5;
    }
    40% {
      transform: scale(1.2);
      opacity: 1;
    }
  }
`;
