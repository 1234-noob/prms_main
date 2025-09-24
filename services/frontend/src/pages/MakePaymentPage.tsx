import React, { FC, useState } from 'react';
// import * as XLSX from 'xlsx';
// import 'jspdf-autotable';

const MakePaymentPage: FC = () => {
    const data: any[] = [
        {
            srNo: "1",
            unitName: "Unit A",
            dueDate: "Jun 01, 2025",
            rentAmount: "60,000",
            tdsAmount: "0",
            rentPayable: "60,000"
          }
    ]
    const [currentPage, setCurrentPage] = useState(1);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [propertyName, setPropertyName] = useState("");
    const [location, setLocation] = useState("");
    const [query, setQuery] = useState("");

    //Pagination logic
    const itemsPerPage = 10;

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const currentItems = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    return (
        <>
            <div className="min-h-screen w-full bg-gray-100 flex justify-center">
                <div className="w-full min-h-screen bg-white rounded-md shadow-md">
                    <h2 className="text-xl text-[#3248d6] font-semibold p-6">Make Payment</h2>
                    <div className='mb-3 px-6 flex justify-between'>
                        <div className="relative w-full max-w-xs">
                            {/* Search Icon (SVG) */}
                            <svg
                                className="absolute left-3 top-2.5 text-gray-500 w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                                ></path>
                            </svg>

                            {/* Search Input */}
                            <input
                                type="text"
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <button className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:border hover:border-blue-800 hover:text-blue-800 transition">
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 15V3M12 3L16 7M12 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M5 15V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Export
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className='bg-blue-50 shadow-inner '>
                                <tr className="text-left text-slate-600 text-[0.8rem] border-b border-slate-100 tracking-wide">
                                    <th className="ps-6 font-normal">UNIT</th>
                                    <th className="p-3 font-normal">RENT AMOUNT</th>
                                    <th className="p-3 font-normal">DUE DATE</th>
                                    <th className="p-3 font-normal">TDS PAYABLE(5%)</th>
                                    <th className="p-3 font-normal">RENT PAYABLE</th>
                                    {/* <th className="p-3 font-normal">UPLOAD TDS SUBMISSION</th> */}
                                    <th className="p-3 font-normal"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((data, index) => (
                                    <tr key={index} className="border-b border-slate-100 hover:bg-gray-50">
                                        <td className="p-6 font-medium text-slate-600">{data.unitName}</td>
                                        <td className="p-3 text-slate-600 font-light">₹{data.rentAmount}</td>
                                        <td className="p-3 text-slate-600 font-light">{data.dueDate}</td>
                                        <td className="p-3 text-slate-600 font-light">₹{data.tdsAmount}</td>
                                        <td className="p-3 text-slate-600 font-medium">₹{data.rentPayable}</td>
                                        {/* <td className="p-3 text-slate-600 font-light">
                                            <button className="text-purple-600 rounded-md flex items-center gap-2 hover:text-purple-700"
                                            onClick={() => setIsUploadModalOpen(true)}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4 12v8h16v-8M12 16V4m0 0l4 4m-4-4L8 8"
                                                />
                                            </svg>
                                            Upload
                                        </button></td> */}
                                        <td className="p-3">
                                            <a target='_blank'
                                                href='https://test.payplatter.in/quickpay?mcode=ARY242&txnid=TEST123&rurl=&phone=8554068494&name=Sagar+Wankhade&email=sagar@dexpertsystems.com&amount=45000&productinfo=Rent+amount&pg=&x=264&y=29'
                                                className='bg-blue-950 text-white font-normal px-1 py-1 rounded-md flex justify-center items-center'>
                                                Pay Now
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="flex justify-end items-center space-x-2 mt-4 mr-6 mb-2">
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
                    )}

                    {/* Modal */}
                    {isUploadModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
                                {/* Close Icon */}
                                <button
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                    onClick={() => setIsUploadModalOpen(false)}
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

                </div>
            </div>
        </>
    );
};


export default MakePaymentPage;
