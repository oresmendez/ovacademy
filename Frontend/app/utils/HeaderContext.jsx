import React, { createContext, useContext, useState } from "react";

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
