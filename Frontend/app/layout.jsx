'use client'; import { Toaster, HeaderProvider } from '@/app/components/utils/rutas';

export default function RootLayout({ children }) {

    return (
        <html lang="en">
            <body>
                <Toaster
                    position="top-right"
                    expand={true}
                    richColors
                    toastOptions={{
                        style: {
                            fontSize: '1rem',
                            fontFamily: 'var(--font-lexend)'
                        },
                    }}
                />
                <HeaderProvider>
                   
                    <div>{children}</div>

                </HeaderProvider>
            </body>
        </html>
    );
}