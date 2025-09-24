import React, { useState } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportDropdownProps {
    data: any[]; // Data passed from PropertiesPage
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const exportAsCSV = () => {
        const csvContent =
            "data:text/csv;charset=utf-8," +
            [Object.keys(data[0]).join(","), ...data.map(row => Object.values(row).join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "exported_data.csv");
        document.body.appendChild(link);
        link.click();
    };

    const exportAsExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "exported_data.xlsx");
    };

    const exportAsPDF = (data: any[]) => {
        if (!data || data.length === 0) {
            console.warn("No data available to export.");
            return;
        }

        const doc = new jsPDF();
        doc.text("Exported Data", 10, 10);

        const tableColumn: string[] = Object.keys(data[0]);
        const tableRows: any[][] = data.map(row => Object.values(row) as any[]); // Explicitly cast to `any[]`

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
        });

        doc.save("exported_data.pdf");
    };

    return (
        <div className="relative inline-block text-left">
            <button
                className="bg-white border border-blue-600 text-blue-600 font-medium px-4 py-2 rounded-lg flex items-center gap-1 h-full hover:border-blue-800 hover:text-blue-800 transition"
                onClick={toggleDropdown}
            >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15V3M12 3L16 7M12 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 15V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Export
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg">
                    <ul className="py-2 text-sm text-gray-700">
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                exportAsCSV();
                                setIsOpen(false);
                            }}
                        >
                            Export as CSV
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                exportAsExcel();
                                setIsOpen(false);
                            }}
                        >
                            Export as Excel
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                exportAsPDF(data);
                                setIsOpen(false);
                            }}
                        >
                            Export as PDF
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ExportDropdown;
