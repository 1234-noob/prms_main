import React, { FC, useState, useEffect, useCallback } from 'react';
import { Contact, ContactStatus, CreateContactPayload, UpdateContactPayload } from './Contact/core/_model';
import { getAllContacts, createContact, updateContact, deleteContact } from './Contact/core/_request';
import { Property } from './Properties/core/_models';
import { getAllProperties } from './Properties/core/_requests';
import { Unit } from './PropertyParts/core/_models';
import { getAllPropertyParts } from './PropertyParts/core/_requests';
import { Tenant } from './Tenant/core/_models';
import { getAllTenants, getPropertyPartByPropertyId } from './Tenant/core/_requests';
import CreateContactModal from './Contact/components/CreateContactModal';
import EditContactModal from './Contact/components/EditContactModal';
import ViewContactModal from './Contact/components/ViewContactModal';
import DeleteContactModal from './Contact/components/DeleteContactModal';

const ContactManagementPage: FC = () => {
    // State declarations
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

    // Modal states
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isEditContactOffcanvasOpen, setIsEditContactOffcanvasOpen] = useState(false);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
    const [isViewContactModalOpen, setIsViewContactModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    // Form states
    const [unit, setUnit] = useState<number | ''>('');
    const [property, setProperty] = useState<number | ''>('');
    const [tenant, setTenant] = useState<number | ''>('');
    const [reason, setReason] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [selectedContactStatus, setSelectedContactStatus] = useState<ContactStatus | ''>('pending');

    // Error states
    const [unitError, setUnitError] = useState<string | null>(null);
    const [propertyError, setPropertyError] = useState<string | null>(null);
    const [tenantError, setTenantError] = useState<string | null>(null);
    const [reasonError, setReasonError] = useState<string | null>(null);
    const [contactStatusError, setContactStatusError] = useState<string | null>(null);

    const itemsPerPage = 10;

    // Helper functions
    const getPropertyName = (propertyId: number) => {
        const prop = properties.find(p => p.id === propertyId);
        return prop ? prop.name : propertyId.toString();
    };

    const getUnitName = (unitId: number) => {
        const unit = units.find(u => u.id === unitId);
        return unit ? unit.part_name : unitId.toString();
    };

    const getTenantName = (tenantId: number) => {
        const tenant = tenants.find(t => t.id === tenantId);
        return tenant ? tenant.name : tenantId.toString();
    };

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

    // Filter contacts based on search query
    const filteredContacts = contacts.filter(contact => 
        contact.contactID.toLowerCase().includes(query.toLowerCase()) ||
        contact.reason.toLowerCase().includes(query.toLowerCase()) ||
        getPropertyName(contact.propertyId).toLowerCase().includes(query.toLowerCase()) ||
        getUnitName(contact.unit).toLowerCase().includes(query.toLowerCase()) ||
        getTenantName(contact.tenantId).toLowerCase().includes(query.toLowerCase())
    );
    
    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
    const currentItems = filteredContacts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const statusColors: Record<ContactStatus, string> = {
        approved: "bg-green-100 text-green-700",
        pending: "bg-yellow-100 text-yellow-700",
        rejected: "bg-red-100 text-red-700",
    };

    // Effects
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        setCurrentPage(1);
    }, [query]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [contactsData, propertiesData, unitsData, tenantsData] = await Promise.all([
                getAllContacts(),
                getAllProperties(),
                getAllPropertyParts(),
                getAllTenants()
            ]);

            const mappedContacts: Contact[] = contactsData.map((contact, index) => ({
                id: contact.id,
                srNo: String(index + 1),
                contactID: `CONT-${contact.id}`,
                submittedDate: new Date(contact.createdAt).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                }),
                contactStatus: contact.status,
                unit: contact.unit,
                propertyId: contact.propertyId,
                tenantId: contact.tenantId,
                reason: contact.reason,
                description: contact.description,
                externalId: contact.externalId,
                createdAt: contact.createdAt,
                updatedAt: contact.updatedAt,
            }));

            setContacts(mappedContacts);
            setProperties(propertiesData);
            setUnits(unitsData);
            setTenants(tenantsData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            setMessage({ type: 'error', text: `Failed to load data: ${getErrorMessage(error)}` });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePropertyChange = useCallback(async (propertyId: number | '') => {
        setProperty(propertyId);
        setUnit('');
        
        if (propertyId === '') {
            setFilteredUnits([]);
            return;
        }

        try {
            const propertyUnits = await getPropertyPartByPropertyId(Number(propertyId));
            setFilteredUnits(propertyUnits);
        } catch (error) {
            console.error("Error fetching property units:", error);
            setFilteredUnits([]);
        }
    }, []);

    const resetForm = () => {
        setUnit('');
        setProperty('');
        setTenant('');
        setReason("");
        setDescription("");
        setSelectedContactStatus('pending');
        setFilteredUnits([]);
        setUnitError(null);
        setPropertyError(null);
        setTenantError(null);
        setReasonError(null);
        setContactStatusError(null);
    };

    // Modal handlers
    const handleCloseContactModal = () => {
        setIsContactModalOpen(false);
        resetForm();
    };

    const handleCloseEditContactOffcanvas = () => {
        setIsEditContactOffcanvasOpen(false);
        setSelectedContact(null);
        resetForm();
    };

    const handleCloseDeleteConfirmModal = () => {
        setIsDeleteConfirmModalOpen(false);
        setSelectedContact(null);
    };

    const handleCloseViewContactModal = () => {
        setIsViewContactModalOpen(false);
        setSelectedContact(null);
    };

    const handleEditClick = async (contact: Contact) => {
        setSelectedContact(contact);
        setUnit(contact.unit);
        setProperty(contact.propertyId);
        setTenant(contact.tenantId);
        setReason(contact.reason);
        setDescription(contact.description || "");
        setSelectedContactStatus(contact.contactStatus);
        
        if (contact.propertyId) {
            try {
                const propertyUnits = await getPropertyPartByPropertyId(contact.propertyId);
                setFilteredUnits(propertyUnits);
            } catch (error) {
                console.error("Error fetching property units:", error);
                setFilteredUnits([]);
            }
        }
        
        setIsEditContactOffcanvasOpen(true);
    };

    const handleDeleteClick = (contact: Contact) => {
        setSelectedContact(contact);
        setIsDeleteConfirmModalOpen(true);
    };

    const handleViewClick = (contact: Contact) => {
        setSelectedContact(contact);
        setIsViewContactModalOpen(true);
    };

    // CRUD operations
    const handleSubmitContact = async (payload: CreateContactPayload) => {
        setLoading(true);
        setMessage(null);

        try {
            await createContact(payload);
            await fetchData();
            setMessage({ type: 'success', text: 'Contact created successfully!' });
            setTimeout(() => {
                handleCloseContactModal();
            }, 1500);
        } catch (error) {
            console.error("Error creating contact:", error);
            setMessage({ type: 'error', text: `Failed to create contact: ${getErrorMessage(error)}` });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateContact = async (id: number, payload: UpdateContactPayload) => {
        setLoading(true);
        setMessage(null);

        try {
            await updateContact(id, payload);
            await fetchData();
            setMessage({ type: 'success', text: 'Contact updated successfully!' });
            setTimeout(() => {
                handleCloseEditContactOffcanvas();
            }, 1500);
        } catch (error) {
            console.error("Error updating contact:", error);
            setMessage({ type: 'error', text: `Failed to update contact: ${getErrorMessage(error)}` });
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedContact) return;

        setLoading(true);
        setMessage(null);

        try {
            await deleteContact(selectedContact.id);
            setContacts(prevContacts => prevContacts.filter(c => c.id !== selectedContact.id));
            setMessage({ type: 'success', text: 'Contact deleted successfully!' });
            handleCloseDeleteConfirmModal();
        } catch (error) {
            console.error("Error deleting contact:", error);
            setMessage({ type: 'error', text: `Failed to delete contact: ${getErrorMessage(error)}` });
        } finally {
            setLoading(false);
        }
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
                    {/* Header */}
                    <h2 className="text-2xl text-[#3248d6] font-bold p-6 border-b border-gray-200">
                        Contact Management
                    </h2>
                    
                    {/* Search and Actions */}
                    <div className='mb-6 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4'>
                        <div className="relative w-full max-w-xs">
                            <svg
                                className="absolute left-3 top-2.5 text-gray-500 w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        
                        <div className='flex flex-wrap gap-2'>
                            <button className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all shadow-sm">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 15V3M12 3L16 7M12 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5 15V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Export
                            </button>
                            <button
                                onClick={() => setIsContactModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-1"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg> 
                                Contact
                            </button>
                        </div>
                    </div>
                    
                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead className='bg-blue-50 shadow-inner'>
                                <tr className="text-left text-slate-600 text-sm border-b border-slate-100 tracking-wide">
                                    <th className="ps-6 py-3 font-semibold">CONTACT ID</th>
                                    <th className="p-3 py-3 font-semibold">UNIT</th>
                                    <th className="p-3 py-3 font-semibold">PROPERTY</th>
                                    <th className="p-3 py-3 font-semibold">TENANT</th>
                                    <th className="p-3 py-3 font-semibold">REASON</th>
                                    <th className="p-3 py-3 font-semibold">DESCRIPTION</th>
                                    <th className="p-3 py-3 font-semibold">SUBMITTED DATE</th>
                                    <th className="p-3 py-3 font-semibold">STATUS</th>
                                    <th className="p-3 py-3 font-semibold">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-8">
                                            <div className="dots-container">
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : currentItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-8 text-gray-500">
                                            No contacts found.
                                        </td>
                                    </tr>
                                ) : (
                                    currentItems.map((contact) => (
                                        <tr key={contact.id} className="border-b border-slate-100 hover:bg-gray-50">
                                            <td className="ps-6 py-4 font-medium text-slate-800">{contact.contactID}</td>
                                            <td className="p-3 py-4 text-slate-600 font-light">{getUnitName(contact.unit)}</td>
                                            <td className="p-3 py-4 text-slate-600 font-light">{getPropertyName(contact.propertyId)}</td>
                                            <td className="p-3 py-4 text-slate-600 font-light">{getTenantName(contact.tenantId)}</td>
                                            <td className="p-3 py-4 text-slate-600 font-light">{contact.reason}</td>
                                            <td className="p-3 py-4 text-slate-600 font-light">{contact.description || 'N/A'}</td>
                                            <td className="p-3 py-4 text-slate-600 font-light">{contact.submittedDate}</td>
                                            <td className="px-3 py-4 text-slate-600 font-normal">
                                                <span className={`${statusColors[contact.contactStatus]} px-3 py-1 text-xs rounded-full font-medium`}>
                                                    {contact.contactStatus}
                                                </span>
                                            </td>
                                            <td className="p-3 py-4 flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleViewClick(contact)}
                                                    className="text-gray-600 hover:text-gray-800 transition-colors relative group"
                                                    aria-label="View contact"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12.001 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(contact)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors relative group"
                                                    aria-label="Edit contact"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(contact)}
                                                    className="text-red-600 hover:text-red-800 transition-colors relative group"
                                                    aria-label="Delete contact"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="flex justify-end items-center space-x-2 mt-6 mr-6 mb-4">
                            <button
                                className="px-3 py-1 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    className={`px-3 py-1 border rounded-full text-sm font-medium transition-all ${
                                        currentPage === index + 1 
                                            ? "bg-blue-600 text-white border-blue-600" 
                                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                    }`}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                className="px-3 py-1 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Modal Components */}
                    {isContactModalOpen && (
                        <CreateContactModal
                            isOpen={isContactModalOpen}
                            onClose={handleCloseContactModal}
                            onSubmit={handleSubmitContact}
                            properties={properties}
                            units={units}
                            filteredUnits={filteredUnits}
                            tenants={tenants}
                            loading={loading}
                            unit={unit}
                            setUnit={setUnit}
                            property={property}
                            setProperty={setProperty}
                            handlePropertyChange={handlePropertyChange}
                            tenant={tenant}
                            setTenant={setTenant}
                            reason={reason}
                            setReason={setReason}
                            description={description}
                            setDescription={setDescription}
                            selectedContactStatus={selectedContactStatus}
                            setSelectedContactStatus={setSelectedContactStatus}
                            unitError={unitError}
                            setUnitError={setUnitError}
                            propertyError={propertyError}
                            setPropertyError={setPropertyError}
                            tenantError={tenantError}
                            setTenantError={setTenantError}
                            reasonError={reasonError}
                            setReasonError={setReasonError}
                            contactStatusError={contactStatusError}
                            setContactStatusError={setContactStatusError}
                            message={message}
                        />
                    )}

                    {isEditContactOffcanvasOpen && (
                        <EditContactModal
                            isOpen={isEditContactOffcanvasOpen}
                            onClose={handleCloseEditContactOffcanvas}
                            onSubmit={handleUpdateContact}
                            selectedContact={selectedContact}
                            properties={properties}
                            filteredUnits={filteredUnits}
                            tenants={tenants}
                            loading={loading}
                            unit={unit}
                            setUnit={setUnit}
                            property={property}
                            handlePropertyChange={handlePropertyChange}
                            tenant={tenant}
                            setTenant={setTenant}
                            reason={reason}
                            setReason={setReason}
                            description={description}
                            setDescription={setDescription}
                            selectedContactStatus={selectedContactStatus}
                            setSelectedContactStatus={setSelectedContactStatus}
                            unitError={unitError}
                            setUnitError={setUnitError}
                            propertyError={propertyError}
                            setPropertyError={setPropertyError}
                            tenantError={tenantError}
                            setTenantError={setTenantError}
                            reasonError={reasonError}
                            setReasonError={setReasonError}
                            contactStatusError={contactStatusError}
                            setContactStatusError={setContactStatusError}
                        />
                    )}

                    {isViewContactModalOpen && (
                        <ViewContactModal
                            isOpen={isViewContactModalOpen}
                            onClose={handleCloseViewContactModal}
                            selectedContact={selectedContact}
                            properties={properties}
                            units={units}
                            tenants={tenants}
                        />
                    )}

                    {isDeleteConfirmModalOpen && (
                        <DeleteContactModal
                            isOpen={isDeleteConfirmModalOpen}
                            onClose={handleCloseDeleteConfirmModal}
                            onConfirm={handleConfirmDelete}
                            selectedContact={selectedContact}
                            loading={loading}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default ContactManagementPage;