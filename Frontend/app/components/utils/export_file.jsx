import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import * as XLSX from 'xlsx';

// ESTE COMPONENTE NO SE USA, SE PUEDE ELIMINAR ORESTES

export const exportToPDF = (tittle, head, tableRows, name) => {
    const doc = new jsPDF();
    doc.text(tittle, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    doc.setFontSize(16);
    doc.autoTable({
        head: head,
        body: tableRows,
        startY: 25,
        styles: { fontSize: 10 },
        headStyles: {
            fillColor: [22, 160, 133],
            textColor: 255,
            fontStyle: 'bold',
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240],
        },
        margin: { top: 10 },
    });
    doc.save(name);
}

export const exportToExcel = (tittle, filteredData, name) => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, tittle);
    XLSX.writeFile(workbook, name);
}



// const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(filteredData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Profesores');
//     XLSX.writeFile(workbook, 'profesores.xlsx');
// };