import React, { FC, useState } from 'react';

const TDSDeductionsPage: FC = () => {
    const data: any[] = [
        {
            srNo: '1',
            unitName: "Unit B",
            propertyName: "Green Valley Residency",
            tenant: [
                { name: "Vikram Shetty", email: "vikram.shetty@gmail.com" },
                { name: "Vikrant Sharma", email: "vikrant.sharma@gmail.com" }
            ],
            tenantEmail: "rahul.devray@gmail.com",
            date: "Apr 19,2024",
            tdsAmount: "33,000",
            challanNumber: "0510001/2025-01-19/01234",
            tdsReferenceNo: "T9A87B3KLMN456Q",
            paymentStatus: "Paid"
        },
        // {
        //     srNo: '2',
        //     unitName: "Unit A",
        //     propertyName: "Green Valley Residency",
        //     tenant: [
        //         { name: "Vikram Shetty", email: "vikram.shetty@gmail.com" },
        //         { name: "Vikrant Sharma", email: "vikrant.sharma@gmail.com" }
        //     ],
        //     tenantEmail: "rahul.devray@gmail.com",
        //     date: "Apr 12,2025",
        //     tdsAmount: "36,000",
        //     challanNumber: "0510001/2025-01-19/01234",
        //     tdsReferenceNo: "T9A87B3KLMN456Q",
        //     paymentStatus: "Pending"
        // },
    ];

    const [currentPage, setCurrentPage] = useState(1);
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
                    <h2 className="text-xl text-[#3248d6] font-semibold p-6">TDS Deductions</h2>
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
                                    <th className="p-3 font-normal">TENANT</th>
                                    <th className="p-3 font-normal">TDS AMOUNT</th>
                                    <th className="p-3 font-normal">SUBMITTED DATE</th>
                                    <th className="p-3 font-normal">CHALLAN NUMBER</th>
                                    <th className="p-3 font-normal">TDS REFERENCE NUMBER</th>
                                    <th className="p-3 font-normal"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((data, index) => (
                                    <tr key={index} className="border-b border-slate-100 hover:bg-gray-50">
                                        <td className="p-6 font-medium text-slate-600">{data.unitName}<div className='text-sm font-light'>{data.propertyName}</div></td>
                                        <td className="p-3 text-slate-600 font-normal">
                                            {data.tenant?.map((tenant: any) => (
                                                <div key={tenant.id} className='mb-1'>
                                                    <div>{tenant.name}</div>
                                                    <div className="text-sm text-slate-500">{tenant.email}</div>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="p-3 text-slate-600 font-light">₹{data.tdsAmount}</td>
                                        <td className="p-3 text-slate-600 font-light">{data.date}</td>
                                        <td className="p-3 text-slate-600 font-light">{data.challanNumber}</td>
                                        <td className="p-3 text-slate-600 font-medium">{data.tdsReferenceNo}</td>
                                        <td className="p-3">
                                            <div className='flex items-center space-x-4'>
                                                <button className="relative group text-slate-600 font-light flex items-center">
                                                    <svg
                                                        width="30px"
                                                        height="30px"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        stroke="#27880c"
                                                    >
                                                        <path
                                                            d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z"
                                                            stroke="#27880c"
                                                            strokeWidth="0.816"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z"
                                                            stroke="#27880c"
                                                            strokeWidth="0.816"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    {/* Tooltip */}
                                                    <span className="absolute left-1/2 -top-8 -translate-x-1/2 scale-0 rounded bg-white px-2 py-1 text-xs font-normal text-slate-900 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                                                        View Receipt
                                                    </span>
                                                </button>
                                                <button className="relative group text-slate-600 font-light flex items-center">
                                                    <svg width="48" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 3V16M12 16L8 12M12 16L16 12" stroke="blue" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M4 20H20" stroke="blue" stroke-width="3" stroke-linecap="round" />
                                                    </svg>

                                                    {/* Tooltip */}
                                                    <span className="absolute left-1/2 -top-8 -translate-x-1/2 scale-0 rounded bg-white px-2 py-1 text-xs font-normal text-slate-900 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                                                        Download Receipt
                                                    </span>
                                                </button>
                                            </div>
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

                </div>
            </div>

        </>
    );
};


export default TDSDeductionsPage;
