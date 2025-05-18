'use client';

import { useEffect, useState } from 'react';
import { Spinner, PropTypes } from '@/app/components/utils/rutas';

export default function ClientWrapper({ children }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsClient(true);
        }, 500);

        return () => clearTimeout(timeout);
    }, []);

    if (!isClient) return <Spinner show={true} />;

    return <>{children}</>;
}

ClientWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};
