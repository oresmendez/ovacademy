// app/layout.tsx (NO LLEVA 'use client')
import { Toaster, HeaderProvider, PropTypes } from '@/app/components/utils/rutas';
import ClientWrapper from '@/app/ClientWrapper';


export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body style={{ fontFamily: 'var(--font-lexend)' }}>
                <Toaster
                    position="top-right"
                    expand={true}
                    richColors
                    toastOptions={{
                        style: {
                            fontSize: '1rem',
                            fontFamily: 'var(--font-lexend)',
                        },
                    }}
                />
                <HeaderProvider>
                    <ClientWrapper>
                        {children}
                    </ClientWrapper>
                </HeaderProvider>
            </body>
        </html>
    );
}

RootLayout.propTypes = {
    children: PropTypes.node,
};

