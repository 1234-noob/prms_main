import React, { FC, useEffect, useState } from 'react';

import AddOrganizationModal from './components/AddOrganizationModal';
import EditOrganizationModal from './components/EditOrganizationModal';
import { getAllOrganizations } from './core/_requests';
import DeleteOrganizationModal from './components/DeleteOrganizationModal';
import { Organization } from './core/_models';
import UpdateOrgStatusModal from './components/UpdateOrgStatusModal';

const ManageOrganizationsPage: FC = () => {
    useEffect(() => {
        fetchOrganizations();
    }, [])

    const fetchOrganizations = async () => {
        try {
            const data = await getAllOrganizations();
            setOrganizations(data);
        } catch (err) {
            setError("Failed to fetch organizations");
        } finally {
            setLoading(false);
        }
    }

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);

    //Pagination logic
    const itemsPerPage = 2;

    const totalPages = Math.ceil(organizations.length / itemsPerPage);

    const currentItems = organizations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleEditClick = (orgId: number) => {
        setSelectedOrgId(orgId);
        setIsEditModalOpen(true);
    };

    const openStatusModal = (orgId: number) => {
        setSelectedOrgId(orgId);
        setIsStatusModalOpen(true);
    };

    const statusColors: Record<string, string> = {
        false: "bg-yellow-100 text-yellow-700",
        true: "bg-green-100 text-green-700",
    };

    const handleDeleteClick = (orgId: number) => {
        setSelectedOrgId(orgId);
        setIsDeleteModalOpen(true);
    };
    return (
        <>
            <div className="min-h-screen w-full bg-gray-100 flex justify-center">
                <div className="w-full min-h-screen bg-white rounded-md shadow-md">
                    <h2 className="text-xl text-[#3248d6] font-semibold p-6">Manage Organizations</h2>
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
                                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-1"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5V19M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg> Add
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className='bg-blue-50 shadow-inner '>
                                <tr className="text-left text-slate-600 text-[0.8rem] border-b border-slate-100 tracking-wide">
                                    <th className="ps-6 font-normal">ORGANIZATION</th>
                                    <th className="p-3 font-normal">LOCATION</th>
                                    <th className="p-3 font-normal">STATUS</th>
                                    <th className="p-3 font-normal">NO. OF PROPERTIES</th>
                                    <th className="p-3 font-normal"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((organization, index) => (
                                    <tr key={organization.id} className="border-b border-slate-100 hover:bg-gray-50">
                                        <td className="p-6 flex items-center font-medium text-slate-600">{organization.name}</td>
                                        <td className="p-3 text-slate-600 font-light">{organization.address}</td>
                                        <td className="px-3 py-4 text-slate-600 font-normal cursor-pointer">
                                            <span className={`${statusColors[organization.isActive ? "true" : "false"]} px-3 py-1 text-sm rounded-full`}
                                                onClick={() => openStatusModal(organization.id)}
                                            >{organization.isActive === true ? "Active" : "Suspended"}</span>
                                        </td>
                                        <td className="p-3 text-slate-600 font-light">{organization.noOfProperties}</td>
                                        <td className="p-3 cursor-pointer">
                                            <div className='flex items-center space-x-4'>
                                                {/* Edit Button */}
                                                <button className="text-[#465FFF] hover:text-[#364FCC] flex items-center"
                                                    onClick={() => handleEditClick(organization.id)}
                                                    title="Edit">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                    </svg>
                                                </button>
                                                {/* Delete (Trash) Button */}
                                                <button className="text-[#e33a3a] hover:text-[rgb(220,76,76)] flex items-center h-6 w-6"
                                                    onClick={() => handleDeleteClick(organization.id)}>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fb6a6a">
                                                        <g id="SVGRepo_iconCarrier">
                                                            <path d="M9 5C9 3.895 9.895 3 11 3H13C14.105 3 15 3.895 15 5V7H9V5Z"
                                                                stroke="#fb6a6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M4 7H20"
                                                                stroke="#fb6a6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M6 10L7.7 19.35C7.87 20.3 8.7 21 9.67 21H14.33C15.3 21 16.13 20.3 16.3 19.35L18 10"
                                                                stroke="#fb6a6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M9 10V18M12 10V18M15 10V18"
                                                                stroke="rgba(251, 106, 106, 0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </g>
                                                    </svg>
                                                </button>

                                                {/* View (Eye) Button */}
                                                <button className="text-[#f4d743] hover:text-yellow-500 flex items-center h-8 w-8">
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
                                                </button>

                                            </div>
                                        </td>


                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
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
                    )}

                    {/* Add Organization Modal */}
                    <AddOrganizationModal
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        onOrganizationAdded={fetchOrganizations} // Refresh table after adding
                    />

                    {/* Edit Modal */}
                    <EditOrganizationModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        organizationId={selectedOrgId ?? 0}
                        onOrganizationUpdated={fetchOrganizations}
                    />

                    {/* Delete Modal */}
                    <DeleteOrganizationModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        organizationId={selectedOrgId ?? 0}
                        onOrganizationDeleted={fetchOrganizations}
                    />

                      {/* Status Modal */}
                      <UpdateOrgStatusModal
                        isOpen={isStatusModalOpen}
                        onClose={() => setIsStatusModalOpen(false)}
                        organizationId={selectedOrgId ?? 0}
                        onOrganizationUpdated={fetchOrganizations}
                    />
                </div>
            </div>
        </>
    );
};


export default ManageOrganizationsPage;
