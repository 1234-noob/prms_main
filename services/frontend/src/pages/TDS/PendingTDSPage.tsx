import React, { FC, useEffect, useState } from 'react';
import { getAllProperties } from '../Properties/core/_requests';
import { getPropertyPartByPropertyId } from '../Tenant/core/_requests';
import { Property } from '../Properties/core/_models';
import { Unit } from '../PropertyParts/core/_models';
import SubmitTDSFormModal from './components/SubmitTDSFormModal';
import { ToastContainer } from "react-toastify";

const PendingTDSPage: FC = () => {
    const data: any[] = [
        {
            srNo: "1",
            unitName: "Unit A",
            grossAmount: "7,20,000",  // 12 months x ₹60,000
            tdsDeducted: "36,000",
            netAmountPaid: "6,84,000",
            tdsReferenceNo: "T98765QWE90"
          }
    ]
    const [properties, setProperties] = useState<Property[]>([]);
    const [propertyParts, setPropertyParts] = useState<Unit[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [propertyName, setPropertyName] = useState("");
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedOrganization, setSelectedOrganization] = useState<{ id: number; name: string }>({ id: 0, name: "" });
    const [selectedProperty, setSelectedProperty] = useState<{ id: number; name: string }>({ id: 0, name: "" });
    const [selectedPropertyPart, setSelectedPropertyPart] = useState<{ id: number; name: string }>({ id: 0, name: "" });

    //Pagination logic
    const itemsPerPage = 10;

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const currentItems = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const data = await getAllProperties();
            setProperties(data);
        } catch (err) {
            setError("Failed to fetch properties");
        } finally {
            setLoading(false);
        }
    }
    const fetchPropertyPartsByProperty = async (propertyId: number) => {
        try {
            console.log("selected property id : " + propertyId)
            const data = await getPropertyPartByPropertyId(propertyId);
            console.log("Property parts by property : " + data)
            setPropertyParts(data);
        } catch (err) {
            setError("Failed to fetch properties");
        } finally {
            setLoading(false);
        }
    }

    const handleClose = async () => {
        try {
            setError("");
            setSelectedProperty({ id: 0, name: "" })
            setSelectedPropertyPart({ id: 0, name: "" })
            setIsSubmitModalOpen(false)
        } catch (err) {
            setError("Failed to fetch properties");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="min-h-screen w-full bg-gray-100 flex justify-center">
                <div className="w-full min-h-screen bg-white rounded-md shadow-md">
                    <h2 className="text-xl text-[#3248d6] font-semibold p-6">Pending TDS Submissions</h2>
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
                                    <th className="p-3 font-normal">GROSS AMOUNT</th>
                                    <th className="p-3 font-normal">TDS DEDUCTED(5%)</th>
                                    <th className="p-3 font-normal">NET AMOUNT PAID</th>
                                    <th className="p-3 font-normal">SUBMIT TDS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((data, index) => (
                                    <tr key={index} className="border-b border-slate-100 hover:bg-gray-50">
                                        <td className="p-6 font-medium text-slate-600">{data.unitName}</td>
                                        <td className="p-3 text-slate-600 font-light">₹{data.grossAmount}</td>
                                        <td className="p-3 text-slate-600 font-light">₹{data.tdsDeducted}</td>
                                        <td className="p-3 text-slate-600 font-medium">₹{data.netAmountPaid}</td>
                                        <td className="p-3">
                                            {/* View (Eye) Button */}
                                            <button className="relative group text-slate-600 font-light flex items-center"
                                                onClick={() => setIsSubmitModalOpen(true)}>
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
                                                    Submit TDS
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <ToastContainer
                        position="top-center"
                        autoClose={3000}
                        hideProgressBar={true}
                        closeOnClick
                        pauseOnHover
                        draggable
                        style={{ top: "100px" }} // Moves the toast lower from the top
                    />


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

                    {/* Add contract Modal */}
                    <SubmitTDSFormModal
                        isOpen={isSubmitModalOpen}
                        onClose={() => setIsSubmitModalOpen(false)}
                    />

                    {/* Submit Modal */}
                    {/* {isSubmitModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg relative w-[45rem]">
                                <button
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                    onClick={handleClose}
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

                                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Submit TDS Form</h2>
                                <div className='flex space-x-4'>
                                    <div className='flex-1'>
                                        <label className='text-slate-900 text-md block mb-1'>Property Name</label>
                                        <select
                                            value={selectedProperty.id}
                                            onChange={(e) => {
                                                const selectedId = Number(e.target.value);
                                                const selectedProperty = properties.find(p => p.id === selectedId);
                                                if (selectedProperty) {
                                                    setSelectedProperty({ id: selectedProperty.id, name: selectedProperty.name });
                                                }
                                                fetchPropertyPartsByProperty(selectedId)
                                                setSelectedPropertyPart({ id: 0, name: "" })
                                            }}
                                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                                        >
                                            <option value="0">Select a property</option>
                                            {properties.map((property) => (
                                                <option key={property.id} value={property.id}>
                                                    {property.name}
                                                </option>
                                            ))}
                                        </select>

                                    </div>
                                    <div className='flex-1'>
                                        <label className='text-slate-900 text-md block mb-1'>Property Part Name</label>
                                        <select
                                            value={selectedPropertyPart.id}
                                            onChange={(e) => {
                                                const selectedId = Number(e.target.value);
                                                const selectedPropertyPart = propertyParts.find(p => p.id === selectedId);
                                                if (selectedPropertyPart) {
                                                    setSelectedPropertyPart({ id: selectedPropertyPart.id, name: selectedPropertyPart.part_name });
                                                }
                                            }}
                                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg">
                                            <option value="0">Select a unit</option>
                                            {propertyParts.map((part) => (
                                                <option key={part.id} value={part.id}>
                                                    {part.part_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className='flex space-x-4'>
                                    <div className='flex-1'>
                                        <label className='text-slate-900 text-md block mb-1'>TDS Amount</label>
                                        <input
                                            type='number'
                                            value={propertyName}
                                            onChange={(e) => setPropertyName(e.target.value)}
                                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg" />
                                    </div>
                                    <div className='flex-1'>
                                        <label className='text-slate-900 text-md block mb-1'>Date Submitted</label>
                                        <input
                                            type='date'
                                            value={propertyName}
                                            onChange={(e) => setPropertyName(e.target.value)}
                                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className='flex space-x-4'>
                                    <div className='flex-1'>
                                        <label className='text-slate-900 text-md block mb-1'>Challan Number</label>
                                        <input
                                            type='text'
                                            value={propertyName}
                                            onChange={(e) => setPropertyName(e.target.value)}
                                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <label className='text-slate-900 text-md block mb-1'>TDS Amount Deducted</label>
                                        <input
                                            type='number'
                                            value={propertyName}
                                            onChange={(e) => setPropertyName(e.target.value)}
                                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className='flex space-x-4'>
                                    <div className='flex-1'>
                                        <label className='text-slate-900 text-md block mb-1'>TDS Reference Number</label>
                                        <input
                                            type='text'
                                            value={propertyName}
                                            onChange={(e) => setPropertyName(e.target.value)}
                                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <label className='text-slate-900 text-md block mb-1'>Upload Challan receipt</label>
                                        <input
                                            type='file'
                                            value={propertyName}
                                            onChange={(e) => setPropertyName(e.target.value)}
                                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-2">
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
                                </div>
                            </div>
                        </div>
                    )} */}

                </div>
            </div >
        </>
    );
};


export default PendingTDSPage;
