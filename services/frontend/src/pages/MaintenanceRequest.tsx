import React, { FC, useState, useEffect, useCallback } from 'react';
import { MaintenanceRequest, CreateMaintenanceRequestPayload, UpdateMaintenanceRequestPayload } from './Maintenance/core/_model';
import { getAllMaintenanceRequests, createMaintenanceRequest, updateMaintenanceRequest, deleteMaintenanceRequest } from './Maintenance/core/_request';
import { Property } from './Properties/core/_models';
import { getAllProperties } from './Properties/core/_requests';
import { Unit } from './PropertyParts/core/_models';
import { getAllPropertyParts } from './PropertyParts/core/_requests';
import { Tenant } from './Tenant/core/_models';
import { getAllTenants, getPropertyPartByPropertyId } from './Tenant/core/_requests';
import CreateMaintenanceRequestModal from './Maintenance/components/CreateMaintenanceRequestModal';
import UpdateMaintenanceModal from './Maintenance/components/UpdateMaintenanceRequestModal';
import DeleteMaintenanceRequestModal from './Maintenance/components/DeleteMaintenanceRequestModal';
import ViewMaintenanceRequestModal from './Maintenance/components/ViewMaintenanceRequestModal';

const MaintenanceRequestPage: FC = () => {
    const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<MaintenanceRequest[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isRequestMaintenanceModalOpen, setIsRequestMaintenanceModalOpen] = useState(false);
    const [isEditMaintenanceOffcanvasOpen, setIsEditMaintenanceOffcanvasOpen] = useState(false);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
    const [isViewMaintenanceModalOpen, setIsViewMaintenanceModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

    const [selectedIssueType, setSelectedIssueType] = useState<string>("");
    const [otherIssueType, setOtherIssueType] = useState<string>("");
    const [unit, setUnit] = useState<number | ''>('');
    const [property, setProperty] = useState<number | ''>('');
    const [tenant, setTenant] = useState<number | ''>('');
    const [description, setDescription] = useState<string>("");
    const [query, setQuery] = useState("");
    const [filterTenantId, setFilterTenantId] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

    const [properties, setProperties] = useState<Property[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);
    const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);

    const [issueTypeError, setIssueTypeError] = useState<string | null>(null);
    const [otherIssueTypeError, setOtherIssueTypeError] = useState<string | null>(null);
    const [unitError, setUnitError] = useState<string | null>(null);
    const [propertyError, setPropertyError] = useState<string | null>(null);
    const [tenantError, setTenantError] = useState<string | null>(null);

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const currentItems = filteredRequests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const issueTypes = [
        { id: "Electrical", label: "Electrical" },
        { id: "Plumbing", label: "Plumbing" },
        { id: "HVAC", label: "HVAC" },
        { id: "General", label: "General" },
        { id: "Other", label: "Other (Specify in Comments)" },
    ];

    const getErrorMessage = (error: unknown): string => {
        if (error && typeof error === 'object') {
            if ('message' in error && typeof error.message === 'string') {
                return error.message;
            }
            if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
                return String(error.data.message);
            }
        }
        return error instanceof Error ? error.message : String(error);
    };

    // Auto-hide toast messages after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const fetchMaintenanceRequests = useCallback(async () => {
        try {
            const data = await getAllMaintenanceRequests();
            const mappedRequests: MaintenanceRequest[] = data.map((req, index) => ({
                id: req.id,
                srNo: String(index + 1),
                requestID: `MREQ-${req.id}`,
                submittedDate: new Date(req.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                issueType: req.issueType,
                unit: req.unit,
                propertyId: req.propertyId,
                TenantId: req.TenantId,
                description: req.description,
                createdAt: req.createdAt,
                updatedAt: req.updatedAt,
            }));
            setMaintenanceRequests(mappedRequests);
            setFilteredRequests(mappedRequests);
        } catch (error) {
            console.error("Failed to fetch maintenance requests:", error);
            setMessage({ type: 'error', text: `Failed to load maintenance requests: ${getErrorMessage(error)}` });
        }
    }, []);

    const fetchProperties = useCallback(async () => {
        try {
            const data = await getAllProperties();
            setProperties(data);
        } catch (error) {
            console.error("Failed to fetch properties:", error);
        }
    }, []);

    const fetchUnits = useCallback(async () => {
        try {
            const data = await getAllPropertyParts();
            setUnits(data);
        } catch (error) {
            console.error("Failed to fetch units:", error);
        }
    }, []);

    const fetchTenants = useCallback(async () => {
        try {
            const data = await getAllTenants();
            setTenants(data);
        } catch (error) {
            console.error("Failed to fetch tenants:", error);
        }
    }, []);

    const handlePropertyChange = async (propertyId: number) => {
        try {
            const unitsByProperty = await getPropertyPartByPropertyId(propertyId);
            setAvailableUnits(unitsByProperty);
            setUnit('');
            setTenant('');
            setAvailableTenants([]);
        } catch (error) {
            console.error("Failed to fetch units for property:", error);
            setAvailableUnits([]);
            setAvailableTenants([]);
        }
    };

    const handleUnitChange = (unitId: number) => {
        setUnit(unitId);
        if (property && unitId) {
            const filteredTenants = tenants.filter(tenant => 
                tenant.property_id === Number(property) && 
                tenant.property_part_id === unitId
            );
            setAvailableTenants(filteredTenants);
            setTenant('');
        } else {
            setAvailableTenants([]);
            setTenant('');
        }
    };

    useEffect(() => {
        fetchMaintenanceRequests();
        fetchProperties();
        fetchUnits();
        fetchTenants();
    }, [fetchMaintenanceRequests, fetchProperties, fetchUnits, fetchTenants]);

    useEffect(() => {
        let filtered = maintenanceRequests;

        if (filterTenantId !== '') {
            filtered = filtered.filter(request => request.TenantId === Number(filterTenantId));
        }

        if (query.trim()) {
            filtered = filtered.filter(request =>
                request.requestID.toLowerCase().includes(query.toLowerCase()) ||
                request.issueType.toLowerCase().includes(query.toLowerCase()) ||
                (request.description && request.description.toLowerCase().includes(query.toLowerCase()))
            );
        }

        setFilteredRequests(filtered);
        setCurrentPage(1);
    }, [maintenanceRequests, filterTenantId, query]);

    const resetForm = () => {
        setSelectedIssueType("");
        setOtherIssueType("");
        setUnit('');
        setProperty('');
        setTenant('');
        setDescription("");
        setAvailableUnits([]);
        setAvailableTenants([]);
        setIssueTypeError(null);
        setOtherIssueTypeError(null);
        setUnitError(null);
        setPropertyError(null);
        setTenantError(null);
    };

    const handleCloseRequestMaintenanceModal = () => {
        setIsRequestMaintenanceModalOpen(false);
        resetForm();
    };

    const handleCloseEditMaintenanceOffcanvas = () => {
        setIsEditMaintenanceOffcanvasOpen(false);
        setSelectedRequest(null);
        resetForm();
    };

    const handleCloseDeleteConfirmModal = () => {
        setIsDeleteConfirmModalOpen(false);
        setSelectedRequest(null);
    };

    const handleCloseViewMaintenanceModal = () => {
        setIsViewMaintenanceModalOpen(false);
        setSelectedRequest(null);
    };

    const handleEditClick = async (request: MaintenanceRequest) => {
        setSelectedRequest(request);
        setSelectedIssueType(request.issueType);
        
        
        const isOtherIssue = !issueTypes.some(t => t.id === request.issueType);
        if (isOtherIssue) {
            setSelectedIssueType("Other");
            setOtherIssueType(request.issueType);
        } else {
            setSelectedIssueType(request.issueType);
            setOtherIssueType("");
        }
        
        setProperty(request.propertyId);
        setDescription(request.description || "");
        
        try {
           
            const unitsByProperty = await getPropertyPartByPropertyId(request.propertyId);
            setAvailableUnits(unitsByProperty);
            
            
            setUnit(request.unit);
            
            
            const filteredTenants = tenants.filter(tenant => 
                tenant.property_id === request.propertyId && 
                tenant.property_part_id === request.unit
            );
            setAvailableTenants(filteredTenants);
            
            
            setTenant(request.TenantId);
        } catch (error) {
            console.error("Failed to fetch units for property:", error);
            setAvailableUnits([]);
            setAvailableTenants([]);
        }
        
        setIsEditMaintenanceOffcanvasOpen(true);
    };

    const handleDeleteClick = (request: MaintenanceRequest) => {
        setSelectedRequest(request);
        setIsDeleteConfirmModalOpen(true);
    };

    const handleViewClick = (request: MaintenanceRequest) => {
        setSelectedRequest(request);
        setIsViewMaintenanceModalOpen(true);
    };

    const handleUpdateMaintenanceRequest = async (id: number, payload: UpdateMaintenanceRequestPayload) => {
        setLoading(true);

        try {
            const responseData = await updateMaintenanceRequest(id, payload);
            console.log("Maintenance request updated successfully:", responseData);
            
            // Refresh the data immediately
            await fetchMaintenanceRequests();
            
            setMessage({ type: 'success', text: 'Maintenance request updated successfully!' });
            setTimeout(() => {
                handleCloseEditMaintenanceOffcanvas();
            }, 1500);
        } catch (error) {
            console.error("Error updating maintenance request:", error);
            setMessage({ type: 'error', text: `Failed to update request: ${getErrorMessage(error)}` });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSuccess = async () => {
        setMessage({ type: 'success', text: 'Maintenance Request submitted successfully!' });
        await fetchMaintenanceRequests();
        setIsRequestMaintenanceModalOpen(false);
    };

    const handleDeleteSuccess = async () => {
        setMessage({ type: 'success', text: 'Maintenance request deleted successfully!' });
        await fetchMaintenanceRequests();
        setIsDeleteConfirmModalOpen(false);
        setSelectedRequest(null);
    };

    const getPropertyName = (propertyId: number) => {
        const property = properties.find(p => p.id === propertyId);
        return property ? property.name : `Property ${propertyId}`;
    };

    const getUnitName = (unitId: number) => {
        const unit = units.find(u => u.id === unitId);
        return unit ? unit.part_name : `Unit ${unitId}`;
    };

    const getTenantName = (tenantId: number) => {
        const tenant = tenants.find(t => t.id === tenantId);
        return tenant ? tenant.name : `Tenant ${tenantId}`;
    };

    return (
        <>
            <style>{`
                .dots-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    width: 100%;
                }
                .dot {
                    height: 20px;
                    width: 20px;
                    margin-right: 10px;
                    border-radius: 10px;
                    background-color: #b3d4fc;
                    animation: pulse 1.5s infinite ease-in-out;
                }
                .dot:last-child {
                    margin-right: 0;
                }
                .dot:nth-child(1) {
                    animation-delay: -0.3s;
                }
                .dot:nth-child(2) {
                    animation-delay: -0.1s;
                }
                .dot:nth-child(3) {
                    animation-delay: 0.1s;
                }
                @keyframes pulse {
                    0% {
                        transform: scale(0.8);
                        background-color: #b3d4fc;
                        box-shadow: 0 0 0 0 rgba(178, 212, 252, 0.7);
                    }
                    50% {
                        transform: scale(1.2);
                        background-color: #265cdb;
                        box-shadow: 0 0 0 10px rgba(178, 212, 252, 0);
                    }
                    100% {
                        transform: scale(0.8);
                        background-color: #b3d4fc;
                        box-shadow: 0 0 0 0 rgba(178, 212, 252, 0.7);
                    }
                }
                .toast {
                    animation: slideInFromTop 0.3s ease-out;
                }
                @keyframes slideInFromTop {
                    from {
                        transform: translateY(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in-right {
                    animation: slideInFromRight 0.3s ease-out;
                }
                @keyframes slideInFromRight {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
            `}</style>
            <div className="min-h-screen w-full bg-gray-100 flex justify-center font-sans">
                {/* Toast notification */}
                {message && (
                    <div className="fixed top-4 right-4 z-[100003] toast">
                        <div className={`p-4 rounded-lg shadow-lg text-white font-medium ${
                            message.type === 'success' ? 'bg-green-500' : 
                            message.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`}>
                            <div className="flex items-center justify-between">
                                <span>{message.text}</span>
                                <button 
                                    onClick={() => setMessage(null)}
                                    className="ml-4 text-white hover:text-gray-200 transition-colors"
                                >
                                    &#10005;
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="w-full min-h-screen bg-white rounded-md shadow-md">
                    <h2 className="text-2xl text-[#3248d6] font-bold p-6 border-b border-gray-200">Maintenance Request</h2>
                    
                    <div className='mb-6 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4'>
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <div className="relative w-full max-w-xs">
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
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="w-full max-w-xs">
                                <select
                                    value={filterTenantId === '' ? '' : filterTenantId}
                                    onChange={(e) => setFilterTenantId(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="">Filter by Tenant</option>
                                    {tenants.map((tenant) => (
                                        <option key={tenant.id} value={tenant.id}>
                                            {tenant.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <button className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all shadow-sm">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 15V3M12 3L16 7M12 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5 15V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Export
                            </button>
                            <button
                                onClick={() => setIsRequestMaintenanceModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-1"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg> Request Maintenance
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead className='bg-blue-50 shadow-inner'>
                                <tr className="text-left text-slate-600 text-sm border-b border-slate-100 tracking-wide">
                                    <th className="ps-6 py-3 font-semibold">REQUEST ID</th>
                                    <th className="p-3 py-3 font-semibold">ISSUE TYPE</th>
                                    <th className="p-3 py-3 font-semibold">UNIT</th>
                                    <th className="p-3 py-3 font-semibold">PROPERTY</th>
                                    <th className="p-3 py-3 font-semibold">TENANT</th>
                                    <th className="p-3 py-3 font-semibold">DESCRIPTION</th>
                                    <th className="p-3 py-3 font-semibold">REQUESTED DATE</th>
                                    <th className="p-3 py-3 font-semibold">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-8">
                                            <div className="dots-container">
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : currentItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-8 text-gray-500">No maintenance requests found.</td>
                                    </tr>
                                ) : (
                                    currentItems.map((request, index) => (
                                        <tr key={request.id} className="border-b border-slate-100 hover:bg-gray-50">
                                            <td className="ps-6 py-4 font-medium text-slate-800">{request.requestID}</td>
                                            <td className="p-3 py-4 text-slate-600 font-light">{request.issueType}</td>
                                            <td className="p-3 py-4 text-slate-600 font-light">{getUnitName(request.unit)}</td>
                                            <td className="p-3 py-4 text-slate-600 font-light">{getPropertyName(request.propertyId)}</td>
                                            <td className="p-3 py-4 text-slate-600 font-light">{getTenantName(request.TenantId)}</td>
                                            <td className="p-3 py-4 text-slate-600 font-light">{request.description || 'N/A'}</td>
                                            <td className="p-3 py-4 text-slate-600 font-light">{request.submittedDate}</td>
                                            <td className="p-3 py-4 flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleViewClick(request)}
                                                    className="text-gray-600 hover:text-gray-800 transition-colors relative group"
                                                    aria-label="View request"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12.001 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"></path>
                                                    </svg>
                                                    <span className="absolute left-1/2 -top-8 -translate-x-1/2 scale-0 rounded bg-white px-2 py-1 text-xs font-normal text-slate-900 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 shadow-md">
                                                        View
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(request)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors relative group"
                                                    aria-label="Edit request"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                    </svg>
                                                    <span className="absolute left-1/2 -top-8 -translate-x-1/2 scale-0 rounded bg-white px-2 py-1 text-xs font-normal text-slate-900 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 shadow-md">
                                                        Edit
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(request)}
                                                    className="text-red-600 hover:text-red-800 transition-colors relative group"
                                                    aria-label="Delete request"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                    </svg>
                                                    <span className="absolute left-1/2 -top-8 -translate-x-1/2 scale-0 rounded bg-white px-2 py-1 text-xs font-normal text-slate-900 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 shadow-md">
                                                        Delete
                                                    </span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 0 && (
                        <div className="flex justify-end items-center space-x-2 mt-6 mr-6 mb-4">
                            <button
                                className="px-3 py-1 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    className={`px-3 py-1 border rounded-full text-sm font-medium transition-all ${currentPage === index + 1 ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                className="px-3 py-1 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Create Modal */}
                    <CreateMaintenanceRequestModal
                        isOpen={isRequestMaintenanceModalOpen}
                        onClose={handleCloseRequestMaintenanceModal}
                        onSuccess={handleCreateSuccess}
                        properties={properties}
                        units={units}
                        tenants={tenants}
                    />

                    {/* Update Modal */}
                    <UpdateMaintenanceModal
                        isOpen={isEditMaintenanceOffcanvasOpen}
                        onClose={handleCloseEditMaintenanceOffcanvas}
                        onSubmit={handleUpdateMaintenanceRequest}
                        selectedRequest={selectedRequest}
                        properties={properties}
                        units={units}
                        tenants={tenants}
                        availableUnits={availableUnits}
                        availableTenants={availableTenants}
                        loading={loading}
                        selectedIssueType={selectedIssueType}
                        setSelectedIssueType={setSelectedIssueType}
                        otherIssueType={otherIssueType}
                        setOtherIssueType={setOtherIssueType}
                        unit={unit}
                        setUnit={setUnit}
                        property={property}
                        setProperty={setProperty}
                        tenant={tenant}
                        setTenant={setTenant}
                        description={description}
                        setDescription={setDescription}
                        onPropertyChange={handlePropertyChange}
                        onUnitChange={handleUnitChange}
                        issueTypeError={issueTypeError}
                        setIssueTypeError={setIssueTypeError}
                        otherIssueTypeError={otherIssueTypeError}
                        setOtherIssueTypeError={setOtherIssueTypeError}
                        unitError={unitError}
                        setUnitError={setUnitError}
                        propertyError={propertyError}
                        setPropertyError={setPropertyError}
                        tenantError={tenantError}
                        setTenantError={setTenantError}
                        message={message}
                    />

                    {/* Delete Modal */}
                    <DeleteMaintenanceRequestModal
                        isOpen={isDeleteConfirmModalOpen}
                        onClose={handleCloseDeleteConfirmModal}
                        onSuccess={handleDeleteSuccess}
                        selectedRequest={selectedRequest}
                    />

                    {/* View Modal */}
                    <ViewMaintenanceRequestModal
                        isOpen={isViewMaintenanceModalOpen}
                        onClose={handleCloseViewMaintenanceModal}
                        selectedRequest={selectedRequest}
                        properties={properties}
                        units={units}
                        tenants={tenants}
                    />
                </div>
            </div>
        </>
    );
};

export default MaintenanceRequestPage;