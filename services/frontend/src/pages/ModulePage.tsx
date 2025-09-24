import React, { FC, useState } from 'react';
// import * as XLSX from 'xlsx';
// import 'jspdf-autotable';

type Permission = {
    canView: boolean;
    canAdd: boolean;
    canEdit: boolean;
    canDelete: boolean;
};

type SubModule = {
    name: string;
    count: number;
    permissions: Permission;
    
};

type Module = {
    name: string;
    subModules: SubModule[];
};
const initialModules: Record<string, Module[]> = {
    Admin: [
        {
            name: "Dashboard",
            subModules: [
                { name: "Organization Summary", count: 4, permissions: { canView: true, canAdd: true, canEdit: true, canDelete: true } },
                { name: "Revenue & Collection Summary", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
                { name: "Pending & Overdue Invoices", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
            ],
        },
        {
            name: "Property Management",
            subModules: [
                { name: "Add/Edit/Delete Properties", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
                { name: "Dynamic Hierarchy Configuration", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
                { name: "Property Splitting", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
            ],
        },
        {
            name: "Tenant Management",
            subModules: [
                { name: "Add/View/Edit Tenants", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
                { name: "Contract Management", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
                { name: "Payment History", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
            ],
        },
        {
            name: "Contract & Rent Management",
            subModules: [
                { name: "Rental Agreements", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
                { name: "Invoices", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
                { name: "Rent Adjustments & Renewals", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
                
            ],
        },
        {
            name: "Payment Tracking & TDS Management",
            subModules: [
                { name: "Payment Status", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
                { name: "TDS Deductions & Reports", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
            ],
        },

{
    name: "Settings",
    subModules: [
        { 
            name: "Templates", 
            count: 0, 
            permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false }
        }
    ]
},

        {
            name: "Notification Center",
            subModules: [
                { name: "Rent Due Reminders", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
                { name: "System Announcements", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
            ],
        },
        {
            name: "Reports & Analytics",
            subModules: [
                { name: "Financial Statements", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
                { name: "Property Occupancy Rates", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
                { name: "Payment History Reports", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
            ],
        },
    ],
    Tenant: [
        {
            name: "Dashboard",
            subModules: [
                { name: "Contract Summary", count: 2, permissions: { canView: true, canAdd: false, canEdit: false, canDelete: false } },
                { name: "Rent Due Dates", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
                { name: "Payment History", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
            ],
        },
        {
            name: "Rent Payment",
            subModules: [
                { name: "Payment Methods", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
                { name: "TDS Deduction", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
                { name: "Payment Receipts", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
            ],
        },
        {
            name: "Contract Details",
            subModules: [
                { name: "Lease Agreement Terms", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
                { name: "Contract Renewal Status", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
            ],
        },
        {
            name: "Help & Support",
            subModules: [
                { name: "Raise Payment Disputes", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
                { name: "Maintenance Requests", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
                { name: "Contact Management", count: 0, permissions: { canView: false, canAdd: false, canEdit: false, canDelete: false } },
            ],
        },
    ],
};

const ModulePage: FC = () => {
    // Hardcoded settlement data

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;
    // const totalPages = Math.ceil(data.length / itemsPerPage);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [propertyName, setPropertyName] = useState("");
    const [location, setLocation] = useState("");
    const [query, setQuery] = useState("");
    // const [selectedOrganizationUpdate, setSelectedOrganizationUpdate] = useState<Organizations | null>(null); // Track the selected block for editing


    // const handleEditClick = (organization: Organizations) => {
    //     setShowEditAppModal(true);
    //     setSelectedOrganizationUpdate(organization); // Set the selected organization when the Edit button is clicked
    // };

    // const handleCloseModal = () => {
    //     setShowEditAppModal(false);
    //     setSelectedOrganizationUpdate(null); // Close the modal
    // };

    // const handleSaveUpdatedOrganization = (updatedOrganization: Organizations) => {
    //     // setInvoices((prevInvoices) =>
    //     //   prevInvoices.map((block) =>
    //     //     block.blockName === updatedBlock.blockName ? { ...invoice, ...updatedInvoice } : invoice
    //     //   )
    //     // );
    //     // setFilteredInvoices((prevInvoices) =>
    //     //   prevInvoices.map((invoice) =>
    //     //     invoice.srNo === updatedInvoice.srNo ? { ...invoice, ...updatedInvoice } : invoice
    //     //   )
    //     // );
    //     setSelectedOrganizationUpdate(null); // Close the modal after saving
    // };


    //   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const query = e.target.value;
    //     setSearchQuery(query);
    //     filterData(query, statusFilter);
    //   };

    //   const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const type = e.target.value;
    //     setStatusFilter(type);
    //     filterData(searchQuery, type);
    //   };

    //   const filterData = (search: string, type: string) => {
    //     let filtered = invoices;

    //     if (search) {
    //       filtered = filtered.filter((item: any) => {
    //         let fieldValue = '';


    //         fieldValue = item[searchBy as keyof Invoice]?.toString().toLowerCase() || '';


    //         return fieldValue.includes(search.toLowerCase());
    //       });
    //     }

    //     // Filter by payment type (only for Summary view)
    //     if (type !== 'all') {
    //       filtered = filtered.filter((invoice: any) => invoice.paymentType === type);
    //     }

    //     // Date filtering
    //     if (startDate && endDate) {
    //       const start = new Date(startDate);
    //       const end = new Date(endDate);
    //       filtered = filtered.filter((item: any) => {
    //         const date = new Date(item.dateCreated); // For "Summary"
    //         return date >= start && date <= end;
    //       });
    //     }


    //     setFilteredInvoices(filtered);
    //   };

    // Export Invoices to Clipboard
    // const handleCopyToClipboard = () => {
    //     const dataToCopy = filteredInvoices;
    //     const text = dataToCopy
    //         .map((item) =>
    //             `Sr. No: ${item.srNo}, Settlement Id: ${item.organizationId}`
    //         )
    //         .join('\n');

    //     navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
    // };

    // Export functionality
    // Export to Excel
    const handleExportToExcel = () => {
        // const dataToExport =  filteredInvoices;
        // const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        // const workbook = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');
        // XLSX.writeFile(workbook,  'Invoices.xlsx');
    };


    // Export to CSV
    const handleExportToCSV = () => {
        // const dataToExport = filteredInvoices;
        // const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        // const csvData = XLSX.utils.sheet_to_csv(worksheet);
        // const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        // const url = URL.createObjectURL(blob);
        // const link = document.createElement('a');
        // link.setAttribute('href', url);
        // link.setAttribute('download', 'Invoices.csv');
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
    };

    // Export to PDF
    // const handleExportToPDF = () => {
    //     const dataToExport = filteredInvoices;
    //     // const doc = new jsPDF();
    //     doc.text('Invoices', 10, 10);

    //     (doc as any).autoTable({
    //         head: [['Sr. No', 'Invoice No.', 'Payer Name', 'Registration No.', 'Date Created', 'Due Date', 'Invoice Amount', 'Amount Paid', 'Status', 'paymentType', 'email', 'invoiceCycle', 'mobileNo']],
    //         body: dataToExport.map((item) =>
    //             [item.srNo, item.organizationId]
    //         ),
    //     });

    //     doc.save('Settlements.pdf');
    // };

    // Share functionality
    // const handleShareReport = () => {
    //     const dataToShare = filteredInvoices;
    //     const reportText = dataToShare
    //         .map(
    //             (item) =>
    //                 `Sr. No: ${item.srNo}, ${`Settlement Id: ${item.organizationId}`
    //                 }`
    //         )
    //         .join('\n');

    //     if (navigator.share) {
    //         navigator
    //             .share({
    //                 title: 'Invoice Report',
    //                 text: reportText,
    //             })
    //             .catch((error) => console.error('Error sharing:', error));
    //     } else {
    //         alert('Share API not supported. Please copy the text manually.');
    //     }
    // };


    // // Calculate paginated data
    // const indexOfLastItem = currentPage * itemsPerPage;
    // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentItems = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    // const totalPages = Math.ceil(
    //     (filteredInvoices.length) / itemsPerPage
    // );

    // // Change page
    // const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

    // // Handle items per page change
    // const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     setItemsPerPage(Number(e.target.value));
    //     setCurrentPage(1); // Reset to first page on items per page change
    // };

    // // Handle opening and closing the date range modal
    // const handleShowDateRangeModal = () => setShowDateRangeModal(true);
    // const handleCloseDateRangeModal = () => setShowDateRangeModal(false);

    // // Handle date change for start and end dates
    // const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setStartDate(e.target.value);
    // };

    // const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setEndDate(e.target.value);
    // };

    const openStatusModal = (status: string, id: number) => {
        setSelectedStatus(status);
        // setSelectedId(id);
        setIsStatusModalOpen(true);
    };

    const paymentIcons: Record<string, JSX.Element> = {
        CreditCard: (
            <svg className="w-5 h-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
        ),
        PayPal: (
            <svg className="w-5 h-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.8 19.7L8 14h6.8c2 0 3.8-1.4 4.2-3.3l.7-3.2C20.2 5 18.8 3.5 16.8 3.5H5.3L3.7 10h8.2c.6 0 1.2.4 1.1 1l-.3 1.3c-.3 1.3-1.5 2.2-2.9 2.2H6.8z" />
            </svg>
        ),
        BankTransfer: (
            <svg className="w-5 h-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10l9-7 9 7" />
                <path d="M4 10v10h16V10" />
                <line x1="10" y1="14" x2="14" y2="14" />
            </svg>
        ),
        Cash: (
            <svg className="w-5 h-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        ),
    };

    const saveStatus = (id: number, newStatus: string) => {
        console.log(`Updating ID ${id} to status: ${newStatus}`);

        // Make an API call to update status in the backend if needed
        // Example:
        // fetch('/updateStatus', { method: 'POST', body: JSON.stringify({ id, status: newStatus }) });

        setIsStatusModalOpen(false);
    };

    const closeModal = () => {
        setIsStatusModalOpen(false);
    };

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    }

    const confirmDelete = () => {
        setIsDeleteModalOpen(false);
        // Perform the delete operation here
        console.log("Item deleted");
    };

    const [activeRole, setActiveRole] = useState<"Admin" | "Tenant">("Admin");
    const [modules, setModules] = useState(initialModules);

    const handlePermissionChange = (role: "Admin" | "Tenant", moduleIndex: number, subModuleIndex: number, permissionType: keyof Permission) => {
        const updatedModules = { ...modules };
        updatedModules[role][moduleIndex].subModules[subModuleIndex].permissions[permissionType] =
            !updatedModules[role][moduleIndex].subModules[subModuleIndex].permissions[permissionType];
        setModules(updatedModules);
    };
    return (
        <>
            <div className="min-h-screen w-full bg-gray-100 flex justify-center">
                <div className="w-full min-h-screen bg-white rounded-md shadow-md">
                    <h2 className="text-xl text-[#3248d6] font-semibold p-6">Assign Permissions</h2>
                    <div className="overflow-x-auto">
                        <div className="flex border-b mb-4 px-6">
                            {Object.keys(initialModules).map((role) => (
                                <button
                                    key={role}
                                    className={`p-2 ${activeRole === role ? "border-b-2 border-blue-600" : "text-gray-500"}`}
                                    onClick={() => setActiveRole(role as "Admin" | "Tenant")}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                        <table className="w-full border-collapse border border-gray-200 px-6">
                            <thead>
                                <tr className="bg-teal-600 text-white">
                                    <th className="border px-6 ">Sr.No</th>
                                    <th className="border p-3">Module Name</th>
                                    <th className="border p-3">Sub Module / Menu Name</th>
                                    <th className="border p-3">Permissions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modules[activeRole].map((module, moduleIndex) => (
                                    <>
                                        <tr key={moduleIndex} className="bg-gray-100">
                                            <td className="border p-2 text-center" rowSpan={module.subModules.length + 1}>{moduleIndex + 1}</td>
                                            <td className="border p-2 font-medium" rowSpan={module.subModules.length + 1}>{module.name}</td>
                                        </tr>
                                        {module.subModules.map((subModule, subModuleIndex) => (
                                            <tr key={subModuleIndex}>
                                                <td className="border p-2">{subModule.name} ({subModule.count})</td>
                                                <td className="border p-2 flex space-x-2">
                                                    {Object.keys(subModule.permissions).map((perm) => (
                                                        <label key={perm} className="flex items-center space-x-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={subModule.permissions[perm as keyof Permission]}
                                                                onChange={() => handlePermissionChange(activeRole, moduleIndex, subModuleIndex, perm as keyof Permission)}
                                                            />
                                                            <span>{perm.replace("can", "Can ")}</span>
                                                        </label>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                ))}
                            </tbody>
                        </table>
                        <div className='px-6 py-6 flex justify-end'>
                            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                        </div>
                    </div>

                    {/* Pagination */}
                    {/* {totalPages > 1 && (
                        <div className="flex justify-end items-center space-x-2 mt-4 mr-6">
                            <button
                                className="px-3 py-1 border rounded-full disabled:opacity-50"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    className={`px-3 py-1 border rounded-full ${currentPage === index + 1 ? "bg-blue-500 text-white" : ""}`}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                className="px-3 py-1 border rounded-full disabled:opacity-50"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    )} */}

                    {/* Modal */}
                    {isAddModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
                                {/* Close Icon */}
                                <button
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                    onClick={() => setIsAddModalOpen(false)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Add Property</h2>
                                <label className='text-slate-900 text-md block mb-1'>Property Name</label>
                                <input
                                    type="text"
                                    // placeholder="Property Name"
                                    value={propertyName}
                                    onChange={(e) => setPropertyName(e.target.value)}
                                    className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                                />
                                <label className='text-slate-900 text-md block mb-1'>Unit Name</label>
                                <input
                                    type="text"
                                    // placeholder="Unit Name"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                                />
                                <label className='text-slate-700 block mb-2'>Status of the unit</label>
                                {/* Radio Buttons */}
                                <label className="mr-2 mb-5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="Available"
                                        checked={selectedStatus === "Available"}
                                        onChange={() => setSelectedStatus("Available")}
                                        className="hidden"
                                    />
                                    <span
                                        className={`px-4 py-1 text-sm rounded-full ${selectedStatus === "Available"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {selectedStatus === "Available" && "✔ "} Available
                                    </span>
                                </label>

                                <label className="mt-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="Rented"
                                        checked={selectedStatus === "Rented"}
                                        onChange={() => setSelectedStatus("Rented")}
                                        className="hidden"
                                    />
                                    <span
                                        className={`px-4 py-1 text-sm rounded-full ${selectedStatus === "Rented"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {selectedStatus === "Rented" && "✔ "} Rented
                                    </span>
                                </label>
                                <div className="flex justify-end mt-2">
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal */}
                    {isEditModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
                                {/* Close Icon */}
                                <button
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Edit Property</h2>
                                <label className='text-slate-900 text-md block mb-1'>Property Name</label>
                                <input
                                    type="text"
                                    // placeholder="Property Name"
                                    value={propertyName}
                                    onChange={(e) => setPropertyName(e.target.value)}
                                    className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                                />
                                <label className='text-slate-900 text-md block mb-1'>Unit Name</label>
                                <input
                                    type="text"
                                    // placeholder="Location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                                />
                                <label className='text-slate-700 block mb-2'>Status of the Unit</label>
                                {/* Radio Buttons */}
                                <label className="mr-2 mb-5">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="Available"
                                        checked={selectedStatus === "Available"}
                                        onChange={() => setSelectedStatus("Available")}
                                        className="hidden"
                                    />
                                    <span
                                        className={`px-4 py-1 text-sm rounded-full ${selectedStatus === "Available"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {selectedStatus === "Available" && "✔ "} Available
                                    </span>
                                </label>

                                <label className="mt-2">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="Rented"
                                        checked={selectedStatus === "Rented"}
                                        onChange={() => setSelectedStatus("Rented")}
                                        className="hidden"
                                    />
                                    <span
                                        className={`px-4 py-1 text-sm rounded-full ${selectedStatus === "Rented"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {selectedStatus === "Rented" && "✔ "} Rented
                                    </span>
                                </label>
                                <div className="flex justify-end mt-2">
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isStatusModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                            <div className="bg-white p-5 rounded-md shadow-md px-10 relative w-96">
                                {/* Close Icon */}
                                <button
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                    onClick={() => setIsStatusModalOpen(false)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <h3 className="text-lg text-slate-800 font-bold mb-5">Change Status</h3>

                                {/* Radio Buttons */}
                                <label className="block mb-5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="Available"
                                        checked={selectedStatus === "Available"}
                                        onChange={() => setSelectedStatus("Available")}
                                        className="hidden"
                                    />
                                    <span
                                        className={`px-4 py-1 text-sm rounded-full ${selectedStatus === "Available"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {selectedStatus === "Available" && "✔ "} Available
                                    </span>
                                </label>

                                <label className="block mt-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="Rented"
                                        checked={selectedStatus === "Rented"}
                                        onChange={() => setSelectedStatus("Rented")}
                                        className="hidden"
                                    />
                                    <span
                                        className={`px-4 py-1 text-sm rounded-full ${selectedStatus === "Rented"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {selectedStatus === "Rented" && "✔ "} Rented
                                    </span>
                                </label>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                        onClick={() => selectedId !== null && saveStatus(selectedId, selectedStatus)}
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Delete Confirmation Modal */}
                    {isDeleteModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg relative">
                                {/* Close Icon */}
                                <button
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                                <p className="mt-2">Are you sure you want to delete this item?</p>
                                <div className="flex justify-end mt-4 space-x-4">
                                    <button
                                        onClick={confirmDelete}
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>


            {/* <CreateOrganizationModal show={showCreateAppModal} handleClose={() => setShowCreateAppModal(false)} />
            {selectedOrganizationUpdate && (
                    <EditOrganizationModal
                     organizations={selectedOrganizationUpdate}
                     show = {showEditAppModal}
                    onClose={handleCloseModal}
                    onSave={handleSaveUpdatedOrganization} />
                )}
             */}

        </>
    );
};


export default ModulePage;
