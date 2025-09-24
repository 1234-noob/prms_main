import React, { FC, useEffect, useState } from 'react';
import { getAllContracts, getTenantById, updateContractStatus } from './core/_requests';
import { Contract } from './core/_models';
import ExportDropdown from '../ExportDropdown';

const ContractManagementPage: FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [searchCategory, setSearchCategory] = useState("name"); // default
    const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);


    //Pagination logic
    const itemsPerPage = 10;

    const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);

    const currentItems = filteredContracts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        handleSearch();
    }, [query, searchCategory]);


    useEffect(() => {
        updatecontractStatus();
        fetchContracts();
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
            const data = await getAllContracts();
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
            setFilteredContracts(contractsWithTenants)
        } catch (err) {
            setError("Failed to fetch Property Parts");
        } finally {
            setLoading(false);
        }
    }

    const handleQueryChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setQuery(e.target.value);
    };

    const handleSearchCategoryChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setQuery("");
        setSearchCategory(e.target.value);
    };

    const handleSearch = () => {
        const lowerQuery = query.toLowerCase();

        const filtered = contracts.filter((contract) => {
            const endDate = new Date(contract.end_date);
            const now = new Date();
            const contractStatus = endDate >= now ? "Active" : "Expired";
            switch (searchCategory) {
                case "property":
                    return contract.property_name?.toLowerCase().includes(lowerQuery);
                case "propertyPart":
                    return contract.property_part_name?.toLowerCase().includes(lowerQuery);
                //    case "rent":
                //        return contract.rent_amount?.toLowerCase().includes(lowerQuery);
                case "status":
                    return query === "Active" ? contract.isActive === true : query === "Expired" ? contract.isActive === false : true;
                default:
                    return true;
            }
        });

        setFilteredContracts(filtered);
        setCurrentPage(1); // reset to first page on search
    };

    const statusColors: Record<string, string> = {
        Expired: "bg-red-100 text-red-700",
        Active: "bg-green-100 text-green-700",
    };

    return (
        <>
            <div className="min-h-screen w-full bg-gray-100 flex justify-center">
                <div className="w-full min-h-screen bg-white rounded-md shadow-md">
                    <h2 className="text-xl text-[#3248d6] font-semibold p-6">Contract Management</h2>
                    <div className='mb-3 px-6 flex justify-between'>
                        <div className='border border-gray-300 rounded-md p-1'>
                            <div className='flex justify-center space-x-1'>
                                <select
                                    value={searchCategory}
                                    onChange={handleSearchCategoryChange}
                                    className=" w-28 bg-gray-100 text-slate-700 border-transparent rounded-md px-2 py-1"
                                >
                                    <option value="property">Property</option>
                                    <option value="propertyPart">Unit</option>
                                    <option value="status">Status</option>
                                </select>
                                <div className="relative w-48 max-w-xs">
                                    {searchCategory === "status" ? (
                                        <select
                                            value={query}
                                            onChange={handleQueryChange}
                                            className="w-full bg-gray-100 text-slate-700 border border-gray-300 rounded-md px-3 py-2"
                                        >
                                            <option value="">Select</option>
                                            <option value="Active">Active</option>
                                            <option value="Expired">Expired</option>
                                        </select>
                                    ) : (
                                        <>
                                            {/* Search Icon */}
                                            <svg
                                                className="absolute left-2 top-2.5 text-gray-500 w-5 h-5"
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
                                                onChange={handleQueryChange}
                                                className="w-full pl-10 pr-3 py-2 text-sm border border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='flex space-x-2'>
                            <ExportDropdown data={currentItems.map(item => ({
                                CONTRACT_ID: item.id,
                                PROPERTY: item.property_id,
                                UNIT: item.property_part_id,
                                TENANT: item.tenant_id,
                                "CONTRACT DURATION": item.start_date + "-" + item.end_date,
                                "MONTHLY RENT": item.rent_amount
                                    ? Number(item.rent_amount).toLocaleString("en-IN", {
                                        style: "currency",
                                        currency: "INR",
                                        maximumFractionDigits: 0,
                                    })
                                    : "-"
                            }))} />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className='bg-blue-50 shadow-inner '>
                                <tr className="text-left text-slate-600 text-[0.8rem] border-b border-slate-100 tracking-wide">
                                    <th className="ps-6 font-normal">CONTRACT ID</th>
                                    <th className="p-3 font-normal">PROPERTY</th>
                                    <th className="p-3 font-normal">UNIT</th>
                                    <th className="p-3 font-normal">TENANT</th>
                                    <th className="p-3 font-normal">CONTRACT DURATION</th>
                                    <th className="p-3 font-normal">MONTLY RENT</th>
                                    <th className="p-3 font-normal">STATUS</th>
                                    <th className="p-3 font-normal">ACTIONS</th>
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
                                            <td className="p-6 font-medium text-slate-600">{contract.id}</td>
                                            <td className="p-3 text-slate-600 font-light">{contract.property_name}</td>
                                            <td className="p-3 text-slate-600 font-light">{contract.property_part_name}</td>
                                            <td className="p-3 text-slate-600 font-light">
                                                {contract.tenants?.map((tenant) => (
                                                    <div key={tenant.id} className='mb-1'>
                                                        <div className='font-medium text-slate-600'>{tenant.name}</div>
                                                        <div className="text-sm font-light text-slate-500">{tenant.email}</div>
                                                    </div>
                                                ))}
                                            </td>
                                            {/* <td className="p-3 text-slate-600 font-normal">{contract.tenant_id}<div className='font-light text-sm'>{contract.email}</div></td> */}
                                            <td className="p-3 text-slate-600 font-medium">{contract.start_date
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
                                            <td className="px-3 py-4 text-slate-600 font-normal">
                                                <span className={`${statusColors[contract.isActive ? "Active" : "Expired"]} px-3 py-1 text-sm rounded-full`}>
                                                    {contract.isActive ? "Active" : "Expired"}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className='flex items-center'>
                                                    {/* View (Eye) Button */}
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
                                                            View Contract
                                                        </span>
                                                    </button>
                                                    <button className="relative group text-slate-600 font-light flex items-center">
                                                        <svg width="48" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 3V16M12 16L8 12M12 16L16 12" stroke="blue" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M4 20H20" stroke="blue" stroke-width="3" stroke-linecap="round" />
                                                        </svg>

                                                        {/* Tooltip */}
                                                        <span className="absolute left-1/2 -top-8 -translate-x-1/2 scale-0 rounded bg-white px-2 py-1 text-xs font-normal text-slate-900 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                                                            Download Contract
                                                        </span>
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

                </div>
            </div>

        </>
    );
};


export default ContractManagementPage;
