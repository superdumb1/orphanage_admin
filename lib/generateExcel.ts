import * as XLSX from 'xlsx';

export const generateExcelReport = (data: any[], headers: string[], filename: string) => {
    // 1. Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    // 2. Set the headers manually to match your requested names
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

    // 3. Append the sheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    // 4. Trigger the download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
};