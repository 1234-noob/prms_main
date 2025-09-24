import React, { FC, useEffect, useState } from 'react';
import { getAllContracts, getAllExpiredContracts, getTenantById, updateContractStatus } from './core/_requests';
import { Contract } from './core/_models';

const RentAjustmentsRenewalsPage: FC = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [propertyName, setPropertyName] = useState("");
    const [query, setQuery] = useState("");
    const [isRentModalOpen, setRentModalOpen] = useState(false);
    const [isRenewModalOpen, setRenewModalOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [contracts, setContracts] = useState<Contract[]>([]);

    //Pagination logic
    const itemsPerPage = 10;

    const totalPages = Math.ceil(contracts.length / itemsPerPage);

    const currentItems = contracts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        fetchContracts();
        updatecontractStatus();
    }, []);

    const updatecontractStatus = async () => {
        try {

            const data = await getAllContracts();
            // For each contract, update contract status
            const contractsWithTenants = await Promise.all(
                data.map(async (contract: Contract) => {
                    const endDate = new Date(contract.end_date);
                    const now = new Date();
                    const contractStatus = endDate >= now;
                    await updateContractStatus(contract.id, { isActive: contractStatus });
                })
            );
            setContracts(contractsWithTenants);
        } catch (err) {
            setError("Failed to fetch Property Parts");
        } finally {
            setLoading(false);
        }
    }

    const fetchContracts = async () => {
        try {
            const data = await getAllExpiredContracts();

            // For each contract, fetch tenant details
            const contractsWithTenants = await Promise.all(
                data.map(async (contract: Contract) => {
                    const tenants = await Promise.all(
                        contract.tenant_ids.map(async (tenantId) => {
                            try {
                                const tenant = await getTenantById(tenantId);
                                return tenant; // e.g., { id, name, email }
                            } catch (err) {
                                console.error(`Failed to fetch tenant ${tenantId}`);
                                return null;
                            }
                        })
                    );
                    return { ...contract, tenants: tenants.filter(Boolean) };
                })
            );
            setContracts(contractsWithTenants);
        } catch (err) {
            setError("Failed to fetch Property Parts");
        } finally {
            setLoading(false);
        }
    }

    // Open Modals
    const openRentModal = (contract: any) => {
        setSelectedContract(contract);
        setRentModalOpen(true);
    };

    const openRenewModal = (contract: any) => {
        setSelectedContract(contract);
        setRenewModalOpen(true);
    };

    return (
        <>
            <div className="min-h-screen w-full bg-gray-100 flex justify-center">
                <div className="w-full min-h-screen bg-white rounded-md shadow-md">
                    <h2 className="text-xl text-[#3248d6] font-semibold p-6">Rent Adjustment & Renewal</h2>
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
                        <div className='flex space-x-2'>
                            <button className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:border hover:border-blue-800 hover:text-blue-800 transition">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 15V3M12 3L16 7M12 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5 15V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Export
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className='bg-blue-50 shadow-inner '>
                                <tr className="text-left text-slate-600 text-[0.8rem] border-b border-slate-100 tracking-wide">
                                    <th className="ps-6 font-normal">UNIT</th>
                                    <th className="p-3 font-normal">PROPERTY</th>
                                    <th className="p-3 font-normal">TENANT</th>
                                    <th className="p-3 font-normal">CONTRACT ID</th>
                                    <th className="p-3 font-normal">CONTRACT DURATION</th>
                                    <th className="p-3 font-normal">MONTLY RENT</th>
                                    <th className="p-3 font-normal">STATUS</th>
                                    <th className="p-3 font-normal"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr className="text-center text-gray-500 py-10">
                                        <td colSpan={6} className='py-4'>Loading...</td></tr>
                                ) : contracts.length === 0 ? (
                                    <tr className="text-center text-gray-500">
                                        <td colSpan={6} className='py-4'>No Contracts Found...</td></tr>
                                ) :
                                    (currentItems.map((contract, index) => (
                                        <tr key={index} className="border-b border-slate-100 hover:bg-gray-50">
                                            <td className="p-6 font-medium text-slate-600">{contract.property_part_name}</td>
                                            <td className="p-3 text-slate-600 font-light">{contract.property_name}</td>
                                            <td className="p-3 text-slate-600 font-normal">
                                                {contract.tenants?.map((tenant) => (
                                                    <div key={tenant.id} className='mb-1'>
                                                        <div>{tenant.name}</div>
                                                        <div className="text-sm text-slate-500">{tenant.email}</div>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="p-3 text-slate-600 font-light">{contract.id}</td>
                                            <td className="p-3 text-slate-600 font-light">{contract.start_date
                                                ? new Date(contract.start_date).toLocaleDateString()
                                                : "N/A"} - <div> {contract.end_date
                                                    ? new Date(contract.end_date).toLocaleDateString()
                                                    : "N/A"}</div>
                                            </td>
                                            <td className="p-3 text-slate-600 font-light">
                                                {contract.rent_amount
                                                    ? Number(contract.rent_amount).toLocaleString("en-IN", {
                                                        style: "currency",
                                                        currency: "INR",
                                                        maximumFractionDigits: 0,
                                                    })
                                                    : "-"}
                                            </td>
                                            {(() => {
                                                const endDate = new Date(contract.end_date);
                                                const now = new Date();
                                                const contractStatus = "Expired";
                                                const statusClass = "bg-red-200 text-red-800";

                                                return (
                                                    <td className="px-3 py-4 text-slate-600 font-normal">
                                                        <span className={`${statusClass} px-3 py-1 text-sm rounded-full`}>
                                                            {contractStatus}
                                                        </span>
                                                    </td>
                                                );
                                            })()}
                                            <td className="p-3">
                                                <div className='flex items-center space-x-4'>
                                                    <button onClick={() => openRentModal(contract)} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                                                        Modify Rent
                                                    </button>

                                                    {/* Renew Contract Button */}
                                                    <button onClick={() => openRenewModal(contract)} className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">
                                                        Renew
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )))}
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

                    {/* Rent Adjustment Modal */}
                    {isRentModalOpen && selectedContract && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
                                {/* Close Icon */}
                                <button
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                    onClick={() => setRentModalOpen(false)}
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
                                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Edit Rent Details</h2>
                                <label className='text-slate-900 text-md block mb-1'>Existing Rent Amount</label>
                                <input
                                    type='text'
                                    value="20,000"
                                    onChange={(e) => setPropertyName(e.target.value)}
                                    className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                                    disabled
                                />
                                <label className='text-slate-700 block mb-2'>New Rent Amount</label>
                                <input
                                    type='text'
                                    value={propertyName}
                                    onChange={(e) => setPropertyName(e.target.value)}
                                    className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                                />
                                <div className="flex justify-end mt-2">
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded">Update</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Renew Contract Modal */}
                    {isRenewModalOpen && selectedContract && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
                                {/* Close Icon */}
                                <button
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                    onClick={() => setRenewModalOpen(false)}
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
                                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Renew Contract for {selectedContract.unitName}</h2>
                                <label className='text-slate-700 block mb-1'>Select New Contract Duration</label>
                                <select className="w-full mb-4 p-2 border border-gray-300 rounded-md">
                                    <option value="">Select duration</option>
                                    <option value="6 Months">6 Months</option>
                                    <option value="6 Months">12 Months</option>
                                    <option value="12 Months">24 Months</option>
                                </select>
                                <label className='text-slate-700 block mb-1'>Contract End Date</label>
                                <input
                                    type='date'
                                    value={propertyName}
                                    onChange={(e) => setPropertyName(e.target.value)}
                                    className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                                />
                                <label className='text-slate-700 block mb-1'>Contract Start Date</label>
                                <input
                                    type='date'
                                    value={propertyName}
                                    onChange={(e) => setPropertyName(e.target.value)}
                                    className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                                />
                                <div className="flex justify-end mt-2">
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded">Renew</button>
                                </div>
                            </div>
                        </div>

                    )}

                </div>
            </div>

        </>
    );
};


export default RentAjustmentsRenewalsPage;
