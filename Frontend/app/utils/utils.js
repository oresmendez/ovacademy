await new Promise((resolve) => setTimeout(resolve, 1000));

const loadingToastId = toast.loading('Cargando datos...');
toast.dismiss(loadingToastId);

if (!isAuthChecked || !isAuthenticated) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="spinner"></div>
        </div>
    );
}

router.reload(); // Recarga la página