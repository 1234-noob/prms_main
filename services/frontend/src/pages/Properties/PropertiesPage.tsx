import React, { FC, useEffect, useState } from 'react';
import { Property } from './core/_models';
import AddPropertyModal from './components/AddPropertyModal';
import { getAllProperties, updateProperty } from './core/_requests';
import EditPropertyModal from './components/EditPropertyModal';
import UpdateSplittableModal from './components/UpdateSplittableModal';
import DeletePropertyModal from './components/DeletePropertyModal';
import ExportDropdown from '../ExportDropdown';
import ViewDetailsModal from './components/ViewDetailsModal';
import { ToastContainer } from "react-toastify";

const PropertiesPage: FC = () => {

    const [properties, setProperties] = useState<Property[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [searchCategory, setSearchCategory] = useState("name"); // default
    const [query, setQuery] = useState("");
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

    useEffect(() => {
        handleSearch();
    }, [query, searchCategory]);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const data = await getAllProperties();
            setProperties(data);
            setFilteredProperties(data);
        } catch (err) {
            setError("Failed to fetch properties");
        } finally {
            setLoading(false);
        }
    }

    //Pagination logic
    const itemsPerPage = 10;

    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

    const currentItems = filteredProperties.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const openStatusModal = (propertyID: number) => {
        setSelectedPropertyId(propertyID);
        setIsStatusModalOpen(true);
    };

    const handleEditClick = (propertyID: number) => {
        setSelectedPropertyId(propertyID);
        setIsEditModalOpen(true);
    };

    const handleViewClick = (propertyID: number) => {
        setSelectedPropertyId(propertyID);
        setIsViewModalOpen(true);
    };

    const statusColors: Record<string, string> = {
        false: "bg-red-100 text-red-700",
        true: "bg-green-100 text-green-700",
    };

    const handleDeleteClick = (propertyID: number) => {
        setSelectedPropertyId(propertyID);
        setIsDeleteModalOpen(true);
    };

    const handleQueryChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setQuery(e.target.value);
    };

    const handleSearchCategoryChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setQuery("");
        setSearchCategory(e.target.value);
    };

    const handleSearch = () => {
        const lowerQuery = query.toLowerCase();

        const filtered = properties.filter((property) => {
            switch (searchCategory) {
                case "name":
                    return property.name?.toLowerCase().includes(lowerQuery);
                case "location":
                    return property.location?.toLowerCase().includes(lowerQuery);
                case "splitable":
                    return query === "Yes"
                        ? property.splitable === true
                        : query === "No"
                            ? property.splitable === false
                            : true;
                default:
                    return true;
            }
        });

        setFilteredProperties(filtered);
        setCurrentPage(1); // reset to first page on search
    };

    return (
        <>
            <div className="min-h-screen w-full bg-gray-100 flex justify-center">
                <div className="w-full min-h-screen bg-white rounded-md shadow-md">
                    <h2 className="text-xl text-[#3248d6] font-semibold p-6">Properties List</h2>
                    <div className='mb-3 px-6 flex justify-between'>
                        <div className='border border-gray-300 rounded-md p-1'>
                            <div className='flex justify-center space-x-1'>
                                <select
                                    value={searchCategory}
                                    onChange={handleSearchCategoryChange}
                                    className=" w-28 bg-gray-100 text-slate-700 border-transparent rounded-md px-2 py-1"
                                >
                                    <option value="name">Name</option>
                                    <option value="location">Location</option>
                                    <option value="splitable">Splittable</option>
                                </select>
                                <div className="relative w-48 max-w-xs">
                                    {searchCategory === "splitable" ? (
                                        <select
                                            value={query}
                                            onChange={handleQueryChange}
                                            className="w-full bg-gray-100 text-slate-700 border border-gray-300 rounded-md px-3 py-2"
                                        >
                                            <option value="">Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
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
                                PROPERTY: item.name,
                                LOCATION: item.location,
                                SPLITTABLE: item.splitable ? "Yes" : "No",
                            }))} />
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
                                    <th className="ps-6 font-normal">PROPERTY</th>
                                    <th className="p-3 font-normal">LOCATION</th>
                                    <th className="p-3 font-normal">SPLITTABLE</th>
                                    <th className="p-3 font-normal">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr className="text-center text-gray-500 py-10">
                                        <td colSpan={5} className='py-4'>Loading...</td></tr>
                                ) : filteredProperties.length === 0 ? (
                                    <tr className="text-center text-gray-500">
                                        <td colSpan={5} className='py-4'>No Property Found...</td></tr>
                                ) :
                                    (currentItems.map((property, index) => (
                                        <tr key={property.id} className="border-b border-slate-100 hover:bg-gray-50">
                                            <td className="p-6 flex items-center font-medium text-slate-600">{property.name}</td>
                                            <td className="p-3 text-slate-600 font-light">{property.location}</td>
                                            <td className="px-3 py-4 text-slate-600 font-normal cursor-pointer">
                                                <span className={`${statusColors[property.splitable ? "true" : "false"]} px-3 py-1 text-sm rounded-full`}
                                                    onClick={() => openStatusModal(property.id)}>{property.splitable === true ? "Yes" : "No"}</span>
                                            </td>
                                            <td className="p-3">
                                                <div className='flex items-center space-x-4'>
                                                    {/* Edit Button */}
                                                    <button className="text-[#465FFF] hover:text-[#364FCC] flex items-center"
                                                        onClick={() => handleEditClick(property.id)}
                                                        title="Edit">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                        </svg>
                                                    </button>
                                                    {/* Delete (Trash) Button */}
                                                    <button className="text-[#e33a3a] hover:text-[rgb(220,76,76)] flex items-center h-6 w-6">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#fb6a6a"
                                                            onClick={() => handleDeleteClick(property.id)}>
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
                                                    <button
                                                        onClick={() => handleViewClick(property.id)}
                                                        className="text-[#f4d743] hover:text-yellow-500 flex items-center h-8 w-8">
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
                                    )))}
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

                    {/* Add Organization Modal */}
                    <AddPropertyModal
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        onPropertyAdded={fetchProperties} // Refresh table after adding
                    />

                    {/* Edit Modal */}
                    <EditPropertyModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        propertyId={selectedPropertyId ?? 0}
                        onPropertyUpdated={fetchProperties}
                    />

                    {/* View Modal */}
                    <ViewDetailsModal
                        isOpen={isViewModalOpen}
                        onClose={() => setIsViewModalOpen(false)}
                        propertyId={selectedPropertyId ?? 0}
                    />

                    {/* Status Modal */}
                    <UpdateSplittableModal
                        isOpen={isStatusModalOpen}
                        onClose={() => setIsStatusModalOpen(false)}
                        propertyId={selectedPropertyId ?? 0}
                        onPropertyUpdated={fetchProperties}
                    />

                    {/* Delete Modal */}
                    <DeletePropertyModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        propertyId={selectedPropertyId ?? 0}
                        onPropertyDeleted={fetchProperties}
                    />


                </div>
            </div>

        </>
    );
};


export default PropertiesPage;
