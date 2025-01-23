import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import * as XLSX from 'xlsx';



export const exportToPDF = (tittle, head, tableRows, name) => {
    const doc = new jsPDF();
    doc.text(tittle, 10, 10);
    doc.autoTable({
        head: head,
        body: tableRows,
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