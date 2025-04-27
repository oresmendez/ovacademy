// await new Promise((resolve) => setTimeout(resolve, 1000));

// const loadingToastId = toast.loading('Cargando datos...');
// toast.dismiss(loadingToastId);

// if (!isAuthChecked || !isAuthenticated) {
//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//             <div className="spinner"></div>
//         </div>
//     );
// }

// router.reload(); // Recarga la página


// if (!isAuthChecked || !isAuthenticated) {
//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//             <div className="spinner"></div>
//         </div>
//     );
// }


export const formatearFecha = (fechaIso) => {
    if (!fechaIso) return 'No disponible';

    const fecha = new Date(fechaIso);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');

    return `${dia}/${mes}/${anio} - ${horas}:${minutos}`;
};