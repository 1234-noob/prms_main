import React, { FC, useState } from 'react';

const TenantPaymentHistoryPage: FC = () => {
    const data: any[] = [
        // Tenant 1 - Unit A (Green Valley Residency)
        {
            srNo: "1",
            unitName: "Unit A",
            propertyName: "Green Valley Residency",
            tenantId: 10,
            tenant: [
                { name: "Vikram Shetty", email: "vikram@gmail.com" },
                { name: "Rita Shetty", email: "rita@gmail.com" }
            ],
            date: "Jan 01, 2025",
            amountPaid: "60,000",
            paymentMethod: "BankTransfer",
            tdsDeducted: "0",
            netAmountPaid: "60,000",
            tdsReferenceNo: ""
        },
        {
            srNo: "2",
            unitName: "Unit A",
            propertyName: "Green Valley Residency",
            tenantId: 10,
            tenant: [
                { name: "Vikram Shetty", email: "vikram@gmail.com" },
                { name: "Rita Shetty", email: "rita@gmail.com" }
            ],
            date: "Feb 01, 2025",
            amountPaid: "60,000",
            paymentMethod: "BankTransfer",
            tdsDeducted: "0",
            netAmountPaid: "60,000",
            tdsReferenceNo: ""
        },
        {
            srNo: "3",
            unitName: "Unit A",
            propertyName: "Green Valley Residency",
            tenantId: 10,
            tenant: [
                { name: "Vikram Shetty", email: "vikram@gmail.com" },
                { name: "Rita Shetty", email: "rita@gmail.com" }
            ],
            date: "Mar 01, 2025",
            amountPaid: "60,000",
            paymentMethod: "CreditCard",
            tdsDeducted: "0",
            netAmountPaid: "60,000",
            tdsReferenceNo: ""
        },
        {
            srNo: "4",
            unitName: "Unit A",
            propertyName: "Green Valley Residency",
            tenantId: 10,
            tenant: [
                { name: "Vikram Shetty", email: "vikram@gmail.com" },
                { name: "Rita Shetty", email: "rita@gmail.com" }
            ],
            date: "Apr 01, 2025",
            amountPaid: "60,000",
            paymentMethod: "BankTransfer",
            tdsDeducted: "0",
            netAmountPaid: "60,000",
            tdsReferenceNo: ""
        },
        {
            srNo: "5",
            unitName: "Unit A",
            propertyName: "Green Valley Residency",
            tenantId: 10,
            tenant: [
                { name: "Vikram Shetty", email: "vikram@gmail.com" },
                { name: "Rita Shetty", email: "rita@gmail.com" }
            ],
            date: "May 01, 2025",
            amountPaid: "60,000",
            paymentMethod: "BankTransfer",
            tdsDeducted: "0",
            netAmountPaid: "60,000",
            tdsReferenceNo: ""
        },

        // Tenant 2 - Unit 1 (Riverfront Apartments)
        {
            srNo: "6",
            unitName: "Unit 1",
            propertyName: "Riverfront Apartments",
            tenantId: 8,
            tenant: [
                { name: "Ritika Jadhav", email: "ritika.jadhav@gmail.com" },
                { name: "Suresh Patil", email: "suresh.patil@gmail.com" }
            ],
            date: "Jan 01, 2025",
            amountPaid: "18,000",
            paymentMethod: "BankTransfer",
            tdsDeducted: "0",
            netAmountPaid: "18,000",
            tdsReferenceNo: ""
        },
        {
            srNo: "7",
            unitName: "Unit 1",
            propertyName: "Riverfront Apartments",
            tenantId: 8,
            tenant: [
                { name: "Ritika Jadhav", email: "ritika.jadhav@gmail.com" },
                { name: "Suresh Patil", email: "suresh.patil@gmail.com" }
            ],
            date: "Feb 01, 2025",
            amountPaid: "18,000",
            paymentMethod: "CreditCard",
            tdsDeducted: "0",
            netAmountPaid: "18,000",
            tdsReferenceNo: ""
        },
        {
            srNo: "8",
            unitName: "Unit 1",
            propertyName: "Riverfront Apartments",
            tenantId: 8,
            tenant: [
                { name: "Ritika Jadhav", email: "ritika.jadhav@gmail.com" },
                { name: "Suresh Patil", email: "suresh.patil@gmail.com" }
            ],
            date: "Mar 01, 2025",
            amountPaid: "18,000",
            paymentMethod: "BankTransfer",
            tdsDeducted: "0",
            netAmountPaid: "18,000",
            tdsReferenceNo: ""
        },
        {
            srNo: "9",
            unitName: "Unit 1",
            propertyName: "Riverfront Apartments",
            tenantId: 8,
            tenant: [
                { name: "Ritika Jadhav", email: "ritika.jadhav@gmail.com" },
                { name: "Suresh Patil", email: "suresh.patil@gmail.com" }
            ],
            date: "Apr 01, 2025",
            amountPaid: "18,000",
            paymentMethod: "CreditCard",
            tdsDeducted: "0",
            netAmountPaid: "18,000",
            tdsReferenceNo: ""
        },
        {
            srNo: "10",
            unitName: "Unit 1",
            propertyName: "Riverfront Apartments",
            tenantId: 8,
            tenant: [
                { name: "Ritika Jadhav", email: "ritika.jadhav@gmail.com" },
                { name: "Suresh Patil", email: "suresh.patil@gmail.com" }
            ],
            date: "May 01, 2025",
            amountPaid: "18,000",
            paymentMethod: "BankTransfer",
            tdsDeducted: "0",
            netAmountPaid: "18,000",
            tdsReferenceNo: ""
        },

        // Tenant 3 - Flat A1 (Sunrise Meadows)
        {
            srNo: "11",
            unitName: "Flat A1",
            propertyName: "Sunrise Meadows",
            tenantId: 11,
            tenant: [
                { name: "Neha Kulkarni", email: "neha.kulkarni@gmail.com" },
                { name: "Priya More", email: "priya.more@gmail.com" }
            ],
            date: "Jan 01, 2025",
            amountPaid: "30,000",
            paymentMethod: "BankTransfer",
            tdsDeducted: "0",
            netAmountPaid: "30,000",
            tdsReferenceNo: ""
        },
        {
            srNo: "12",
            unitName: "Flat A1",
            propertyName: "Sunrise Meadows",
            tenantId: 11,
            tenant: [
                { name: "Neha Kulkarni", email: "neha.kulkarni@gmail.com" },
                { name: "Priya More", email: "priya.more@gmail.com" }
            ],
            date: "Feb 01, 2025",
            amountPaid: "30,000",
            paymentMethod: "CreditCard",
            tdsDeducted: "0",
            netAmountPaid: "30,000",
            tdsReferenceNo: ""
        },
        {
            srNo: "13",
            unitName: "Flat A1",
            propertyName: "Sunrise Meadows",
            tenantId: 11,
            tenant: [
                { name: "Neha Kulkarni", email: "neha.kulkarni@gmail.com" },
                { name: "Priya More", email: "priya.more@gmail.com" }
            ],
            date: "Mar 01, 2025",
            amountPaid: "30,000",
            paymentMethod: "BankTransfer",
            tdsDeducted: "0",
            netAmountPaid: "30,000",
            tdsReferenceNo: ""
        },
        {
            srNo: "14",
            unitName: "Flat A1",
            propertyName: "Sunrise Meadows",
            tenantId: 11,
            tenant: [
                { name: "Neha Kulkarni", email: "neha.kulkarni@gmail.com" },
                { name: "Priya More", email: "priya.more@gmail.com" }
            ],
            date: "Apr 01, 2025",
            amountPaid: "30,000",
            paymentMethod: "CreditCard",
            tdsDeducted: "0",
            netAmountPaid: "30,000",
            tdsReferenceNo: ""
        },
        {
            srNo: "15",
            unitName: "Flat A1",
            propertyName: "Sunrise Meadows",
            tenantId: 11,
            tenant: [
                { name: "Neha Kulkarni", email: "neha.kulkarni@gmail.com" },
                { name: "Priya More", email: "priya.more@gmail.com" }
            ],
            date: "May 01, 2025",
            amountPaid: "30,000",
            paymentMethod: "BankTransfer",
            tdsDeducted: "0",
            netAmountPaid: "30,000",
            tdsReferenceNo: ""
        },
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
        RupayCreditCard: (<svg xmlns="http://www.w3.org/2000/svg" width="120" height="76" id="payment">
            <g fill="none" fill-rule="evenodd">
                <path fill="#F4F4F4" d="M111.999 0H8C3.582 0 0 3.59 0 8.008v59.984C0 72.415 3.591 76 8.001 76H112c4.419 0 8.001-3.59 8.001-8.008V8.008C120 3.585 116.409 0 111.999 0Z"></path>
                <path fill="#227FBB" d="M19.239 43.888c-.08-.053.475-2.193 1.8-6.932 1.053-3.77 2.045-7.297 2.202-7.838l.287-.982 4.141.076c4.842.088 5.587.152 6.366.546 1.38.699 1.76 1.773 1.285 3.634-.406 1.584-1.18 2.663-2.677 3.728-.284.202-.532.449-.55.548-.022.111.155.355.453.627.27.245.555.573.636.728.216.42.179 1.258-.122 2.713-.147.713-.295 1.732-.33 2.264l-.06.968h-2.005c-1.42 0-2.041-.036-2.13-.125-.196-.196-.152-.695.188-2.125.378-1.591.401-2.216.095-2.604-.403-.514-.77-.624-2.218-.673-1.17-.039-1.365-.021-1.542.139-.276.25-.5.894-1.154 3.321l-.556 2.067-1.996-.001c-1.098-.001-2.049-.036-2.113-.079zm10.537-8.88c.951-.282 1.352-.903 1.354-2.096 0-.359-.06-.611-.183-.76-.289-.348-1.159-.466-2.791-.38l-1.419.077-.207.696c-.319 1.074-.542 2.113-.507 2.358.022.16.133.241.398.293.579.114 2.748-.008 3.355-.188zm6.713 9.187c-.634-.226-1.133-.65-1.342-1.139-.398-.93-.032-2.998 1.421-8.029.348-1.204.633-2.202.633-2.216 0-.015.074-.1.164-.19.134-.135.44-.165 1.668-.165.827 0 1.62.044 1.763.098l.26.1-.259.92c-.636 2.26-1.297 5.002-1.41 5.859-.104.779-.1.985.023 1.243.281.587 1.302.71 2.17.264 1.019-.524 1.21-.973 2.847-6.684.24-.837.424-1.273.628-1.491l.289-.31h1.636c1.265 0 1.648.032 1.689.14.04.107-2.038 7.847-2.914 10.85l-.138.471-1.749.052c-.962.03-1.748.023-1.748-.013s.071-.267.158-.514c.354-1.003-.087-1.065-1.375-.196-1.273.859-1.806 1.062-2.908 1.109-.745.031-1.072-.003-1.506-.159zm11.627-.31c-.093-.06.446-2.136 2.041-7.874l2.168-7.794 3.663.03c4.57.039 5.503.12 6.387.555.726.357 1.072.677 1.395 1.29.544 1.03.535 2.225-.029 3.864-.866 2.52-2.483 4.176-4.614 4.728-.345.09-1.428.21-2.407.269-3.233.193-3.038.157-3.211.6-.083.212-.406 1.293-.718 2.4l-.567 2.015-1.99-.001c-1.096-.001-2.048-.038-2.118-.082zm9.426-8.389c1.065-.137 1.625-.466 1.98-1.163.382-.748.483-1.564.24-1.935-.332-.507-.787-.617-2.498-.608-.852.004-1.592.05-1.643.101-.117.118-.837 2.963-.837 3.309 0 .14.031.287.07.326.099.099 1.837.08 2.688-.03zm5.981 8.742c-1.232-.516-1.552-1.369-1.15-3.073.561-2.381 1.798-3.177 6.044-3.891 2.564-.432 3.204-.747 3.388-1.669.137-.682-.448-1.054-1.655-1.056-.754 0-1.036.11-1.69.657l-.527.442-1.358.035c-1.573.04-2.057-.023-2.057-.266 0-.284.617-1.151 1.193-1.678.62-.566 1.44-1 2.328-1.23 1.864-.486 5.074-.43 6.177.108.59.288 1.115.766 1.365 1.244.236.452.152.921-.963 5.34-.547 2.17-.995 4.13-.995 4.356v.411H72.33c-.711 0-1.51.03-1.777.067l-.483.066-.213-.496c-.25-.583-.279-.583-1.595.01-1.429.642-1.953.786-3.063.838-.945.044-1.108.023-1.675-.215zm5.626-2.445c.721-.32 1.537-1.626 1.541-2.471l.003-.408-.665.062c-.736.07-2.292.571-2.862.923-.482.298-.764.778-.763 1.296.002.497.075.633.42.78.394.168 1.78.06 2.326-.182zm5.764 7.133c-.42-.094-.435-.25-.144-1.4.39-1.538.365-1.506 1.33-1.656 1.04-.162 1.505-.39 1.737-.855.257-.515.238-2.535-.073-7.954-.173-3.016-.216-4.384-.14-4.475.078-.095.608-.13 1.972-.13h1.865l.033 3.5c.022 2.39.07 3.539.148 3.618.191.19.891-.994 3.761-6.36l.406-.758h1.646c.906 0 1.669.036 1.696.08.053.085-2.442 4.532-4.945 8.816-3.558 6.089-4.228 6.928-5.897 7.393-.545.152-2.955.28-3.395.181z" opacity=".938"></path>
                <path fill="#1AAF5D" d="m90.338 47.53 4.893-17.924 4.658 9.263z"></path>
                <path fill="#F59D00" d="m87.31 47.595 4.893-17.923 4.658 9.262z"></path>
                <path fill="#000" d="M100.793 29.271v-1.222h-.465v-.213h1.172v.213h-.468v1.222h-.24Zm.867 0v-1.435h.352l.363 1.146.35-1.146h.345v1.435h-.218v-1.204l-.37 1.204h-.216l-.386-1.222v1.222h-.22Z"></path>
                <path stroke="#000" stroke-width=".5" d="M103.79 28.527a1.99 1.99 0 1 1-3.98 0 1.99 1.99 0 0 1 3.98 0Z" opacity=".938"></path>
            </g>
        </svg>)
    };
    return (
        <>
            <div className="min-h-screen w-full bg-gray-100 flex justify-center">
                <div className="w-full min-h-screen bg-white rounded-md shadow-md">
                    <h2 className="text-xl text-[#3248d6] font-semibold p-6">Payment History</h2>
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
                                    <th className="ps-6 font-normal">TENANT</th>
                                    <th className="p-3 font-normal">UNIT</th>
                                    <th className="p-3 font-normal">RENT AMOUNT</th>
                                    <th className="p-3 font-normal">PAYMENT DATE</th>
                                    <th className="p-3 font-normal">PAYMENT METHOD</th>
                                    <th className="p-3 font-normal">NET AMOUNT PAID</th>
                                    <th className="p-3 font-normal">TDS DEDUCTED</th>
                                    <th className="p-3 font-normal">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((data, index) => (
                                    <tr key={index} className="border-b border-slate-100 hover:bg-gray-50">
                                        <td className="p-6 text-slate-600 font-normal">
                                            {data.tenant?.map((tenant: any) => (
                                                <div key={tenant.id} className='mb-1'>
                                                    <div>{tenant.name}</div>
                                                    <div className="text-sm text-slate-500">{tenant.email}</div>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="p-3 font-normal text-slate-600">{data.unitName}<div className='text-sm font-light'>{data.propertyName}</div></td>
                                        <td className="p-3 text-slate-600 font-light">₹{data.amountPaid}</td>
                                        <td className="p-3 text-slate-600 font-light">{data.date}</td>
                                        <td className="p-3 text-slate-600 font-light">
                                            <div className='flex items-center gap-1'>
                                                {paymentIcons[data.paymentMethod] || null}
                                                {data.paymentMethod}
                                            </div>
                                        </td>
                                        <td className="p-3 text-slate-600 font-medium">₹{data.netAmountPaid}</td>
                                        <td className="p-3 text-slate-600 font-light">₹{data.tdsDeducted}</td>
                                        <td className="p-3">
                                            <div className='flex items-center'>
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


export default TenantPaymentHistoryPage;
