'use client'; import { HeaderPrincipal, PropTypes } from '@/app/components/utils/rutas';

export default function LayoutPrincipal ({ children }) {
    
    return (
        <main>
            <HeaderPrincipal />
            {children}
        </main>
    );
};

LayoutPrincipal.propTypes = {
    children: PropTypes.node.isRequired,
};



