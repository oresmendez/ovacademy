'use client'; import { useContext, useState, createContext, PropTypes } from '@/app/components/utils/rutas';

// Crear el contexto
const HeaderContext = createContext();

// Hook para usar el contexto
export const textBarHeader = () => useContext(HeaderContext);

// Proveedor del contexto
export const HeaderProvider = ({ children }) => {
    const [headerText, setHeaderText] = useState(null); // Cambiar el estado inicial

    return (
        <HeaderContext.Provider value={{ headerText, setHeaderText }}>
            {children}
        </HeaderContext.Provider>
    );
};

HeaderProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

