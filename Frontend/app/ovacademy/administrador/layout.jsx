'use client'; import {PropTypes} from '@/app/components/utils/rutas';

export default function LayoutSecundario ({ children }) {
    
    return (
        
        <div>
            {children}
        </div>
        
    );
};

LayoutSecundario.propTypes = {
    children: PropTypes.node.isRequired,
};

