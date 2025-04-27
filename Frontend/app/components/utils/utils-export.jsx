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

// --------------------------------------------------------------------------
export const pdf_table_profesores = (filteredData) => {
    const name = 'profesores.pdf';
    const title = 'Listado de Profesores';
    const head = [['Correo Electrónico', 'Nombre', 'Apellido', 'Teléfono', 'Estado', 'Colegiado']];
    const tableRows = filteredData.map((row) => [
        row.email,
        row.name,
        row.surname,
        row.phone,
        row.status_logico ? 'Activo' : 'Inactivo',
        row.colegiado
    ]);
    exportToPDF(title, head, tableRows, name);
};

export const excel_table_profesores = (filteredData) => {
    const name = 'profesores.xlsx';
    const title = 'Profesores';
    exportToExcel(title, filteredData, name);
};

