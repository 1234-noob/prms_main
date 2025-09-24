import React, { FC, useState, useEffect, useCallback } from 'react';
import { CreateDisputePayload, DisputeStatus, DisputeResponse, Dispute, UpdateDisputePayload } from './Disputes/core/_model';
import { createDispute, getAllDisputes, updateDispute, deleteDispute } from './Disputes/core/_request';
import { getAllInvoices } from './Invoices/core/_requests'; 
import { Invoice } from './Invoices/core/_model'; 
import CreateDisputeModal from './Disputes/components/CreateDisputeModal';
import EditDisputeModal from './Disputes/components/EditDisputeModal';
import ViewDisputeModal from './Disputes/components/ViewDisputeModal';
import DeleteDisputeModal from './Disputes/components/DeleteDisputeModal';
import ImageViewModal from './Disputes/components/ImageViewModal';

const RaisePaymentDisputesPage: FC = () => {
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const [isRaiseDisputeModalOpen, setIsRaiseDisputeModalOpen] = useState(false);
    const [isEditDisputeOffcanvasOpen, setIsEditDisputeOffcanvasOpen] = useState(false);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
    const [isViewDisputeModalOpen, setIsViewDisputeModalOpen] = useState(false);
    const [isImageViewModalOpen, setIsImageViewModalOpen] = useState(false);
    const [imageToViewUrl, setImageToViewUrl] = useState<string | null>(null);
    const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

    const [selectedReason, setSelectedReason] = useState<string>("");
    const [invoiceId, setInvoiceId] = useState<string>(''); 
    const [submissionDate, setSubmissionDate] = useState<string>("");
    const [additionalComments, setAdditionalComments] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedDisputeStatus, setSelectedDisputeStatus] = useState<DisputeStatus | ''>('pending');
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingInvoices, setLoadingInvoices] = useState(false); 
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

    const [reasonError, setReasonError] = useState<string | null>(null);
    const [invoiceIdError, setInvoiceIdError] = useState<string | null>(null);
    const [submissionDateError, setSubmissionDateError] = useState<string | null>(null);
    const [disputeStatusError, setDisputeStatusError] = useState<string | null>(null);

    const itemsPerPage = 10;
    const totalPages = Math.ceil(disputes.length / itemsPerPage);
    const currentItems = disputes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const statusColors: Record<DisputeStatus, string> = {
        pending: "bg-yellow-100 text-yellow-700",
        resolved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
    };

    const getBaseApiUrl = () => {
        return process.env.REACT_APP_API_URL_HELP_SUPPORT || 'http://localhost:3013';
    };

    const isImageFile = (filePath?: string) => {
        if (!filePath) return false;
        const lowerCasePath = filePath.toLowerCase();
        return lowerCasePath.endsWith('.png') || lowerCasePath.endsWith('.jpg') || lowerCasePath.endsWith('.jpeg') || lowerCasePath.endsWith('.gif');
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

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000); 
            return () => clearTimeout(timer);
        }
    }, [message]);

    const fetchDisputes = useCallback(async () => {
        setLoading(true);
        try {
            const data: DisputeResponse[] = await getAllDisputes();
            const baseUrl = getBaseApiUrl();
            const mappedDisputes: Dispute[] = data.map((d, index) => ({
                id: d.id,
                srNo: String(index + 1),
                disputeID: `DISP-${d.id}`,
                submittedDate: new Date(d.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                disputeStatus: d.status,
                invoiceId: d.invoiceId,
                reason: d.reason,
                comments: d.comments || undefined,
                filePath: d.filePath,
                fileUrl: d.filePath ? `${baseUrl}/${d.filePath}` : undefined,
                externalId: d.external_id,
                createdAt: d.createdAt,
                updatedAt: d.updatedAt,
            }));
            setDisputes(mappedDisputes);
        } catch (error) {
            console.error("Failed to fetch disputes:", error);
            setMessage({ type: 'error', text: `Failed to load disputes: ${getErrorMessage(error)}` });
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchInvoices = useCallback(async () => {
        setLoadingInvoices(true);
        try {
            const data: Invoice[] = await getAllInvoices();
            setInvoices(data);
        } catch (error) {
            console.error("Failed to fetch invoices:", error);
        } finally {
            setLoadingInvoices(false);
        }
    }, []);

    useEffect(() => {
        fetchDisputes();
        fetchInvoices(); 
    }, [fetchDisputes, fetchInvoices]);

    const resetForm = () => {
        setSelectedReason("");
        setInvoiceId('');
        setSubmissionDate("");
        setAdditionalComments("");
        setSelectedFile(null);
        setSelectedDisputeStatus('pending');
        setReasonError(null);
        setInvoiceIdError(null);
        setSubmissionDateError(null);
        setDisputeStatusError(null);
        setMessage(null);
    };

    const handleCloseRaiseDisputeModal = () => {
        setIsRaiseDisputeModalOpen(false);
        resetForm();
    };

    const handleCloseEditDisputeOffcanvas = () => {
        setIsEditDisputeOffcanvasOpen(false);
        setSelectedDispute(null);
        resetForm();
    };

    const handleCloseDeleteConfirmModal = () => {
        setIsDeleteConfirmModalOpen(false);
        setSelectedDispute(null);
    };

    const handleCloseViewDisputeModal = () => {
        setIsViewDisputeModalOpen(false);
        setSelectedDispute(null);
    };

    const handleCloseImageViewModal = () => {
        setIsImageViewModalOpen(false);
        setImageToViewUrl(null);
    };

    const handleEditClick = (dispute: Dispute) => {
        setSelectedDispute(dispute);
        setSelectedReason(dispute.reason);
        setInvoiceId(String(dispute.invoiceId)); 
        setSubmissionDate(dispute.submittedDate);
        setSelectedDisputeStatus(dispute.disputeStatus);
        setAdditionalComments(dispute.comments || "");
        setSelectedFile(null);
        setIsEditDisputeOffcanvasOpen(true);
    };

    const handleDeleteClick = (dispute: Dispute) => {
        setSelectedDispute(dispute);
        setIsDeleteConfirmModalOpen(true);
    };

    const handleViewClick = (dispute: Dispute) => {
        setSelectedDispute(dispute);
        setIsViewDisputeModalOpen(true);
    };

    const handleImageViewClick = (imageUrl: string) => {
        setImageToViewUrl(imageUrl);
        setIsImageViewModalOpen(true);
    };

    const handleSubmitDispute = async (payload: CreateDisputePayload, file?: File) => {
        setLoading(true);
        setMessage(null);

        try {
            const responseData: DisputeResponse = await createDispute(payload, file);
            console.log("Dispute submitted successfully:", responseData);

            await fetchDisputes();

            setMessage({ type: 'success', text: 'Dispute submitted successfully!' });
            setTimeout(() => {
                handleCloseRaiseDisputeModal();
            }, 1500);
        } catch (error) {
            console.error("Error submitting dispute:", error);
            setMessage({ type: 'error', text: `Failed to submit dispute: ${getErrorMessage(error)}` });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateDispute = async (id: number, payload: UpdateDisputePayload, file?: File) => {
    setLoading(true);
    setMessage(null);

    try {
        // No need for Number(id) conversion here anymore
        const responseData: DisputeResponse = await updateDispute(id, payload, file);
        console.log("Dispute updated successfully:", responseData);
        await fetchDisputes();
        setMessage({ type: 'success', text: 'Dispute updated successfully!' });
        setTimeout(() => {
            handleCloseEditDisputeOffcanvas();
        }, 1500);
    } catch (error) {
        console.error("Error updating dispute:", error);
        setMessage({ type: 'error', text: `Failed to update dispute: ${getErrorMessage(error)}` });
    } finally {
        setLoading(false);
    }
};

const handleConfirmDelete = async () => {
    if (!selectedDispute) return;

    setLoading(true);
    setMessage(null);

    try {
        await deleteDispute(selectedDispute.id);

        // This is the key change: update the state array immediately
        setDisputes(prevDisputes => prevDisputes.filter(d => d.id !== selectedDispute.id));

        setMessage({ type: 'success', text: 'Dispute deleted successfully!' });
        handleCloseDeleteConfirmModal();

    } catch (error) {
        console.error("Error deleting dispute:", error);
        setMessage({ type: 'error', text: `Failed to delete dispute.` }); // Simplify the error message
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
                    <h2 className="text-2xl text-[#3248d6] font-bold p-6 border-b border-gray-200">Raise Payment Dispute</h2>
                    <div className='mb-6 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4'>
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
                        <div className='flex flex-wrap gap-2'>
                            <button className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all shadow-sm">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 15V3M12 3L16 7M12 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5 15V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Export
                            </button>
                            <button
                                onClick={() => setIsRaiseDisputeModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-1"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg> Raise Dispute
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className='bg-blue-50 shadow-inner'>
                                <tr className="text-left text-slate-600 text-sm border-b border-slate-100 tracking-wide">
                                    <th className="ps-6 py-3 font-semibold">DISPUTE ID</th>
                                    <th className="p-3 py-3 font-semibold">INVOICE NUMBER</th>
                                    <th className="p-3 py-3 font-semibold">REASON</th>
                                    <th className="p-3 py-3 font-semibold">SUBMITTED DATE</th>
                                    <th className="p-3 py-3 font-semibold">DISPUTE STATUS</th>
                                    <th className="p-3 py-3 font-semibold">COMMENTS</th>
                                    <th className="p-3 py-3 font-semibold">ATTACHED FILE</th>
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
                                        <td colSpan={8} className="text-center py-8 text-gray-500">No disputes found.</td>
                                    </tr>
                                ) : (
                                    currentItems.map((dispute, index) => (
                                        <tr key={index} className="border-b border-slate-100 hover:bg-gray-50">
                                            <td className="ps-6 py-4 font-medium text-slate-800">{dispute.disputeID}</td>
                                            <td className="p-3 py-4 text-slate-600 font-light">{dispute.invoiceId}</td>
                                            <td className="p-3 py-4 text-slate-600 font-light">{dispute.reason}</td>
                                            <td className="p-3 py-4 text-slate-600 font-light">{dispute.submittedDate}</td>
                                            <td className="px-3 py-4 text-slate-600 font-normal cursor-pointer">
                                                <span className={`${statusColors[dispute.disputeStatus]} px-3 py-1 text-xs rounded-full font-medium`}
                                                >{dispute.disputeStatus}</span>
                                            </td>
                                            <td className="p-3 py-4 text-slate-600 font-light max-w-[150px]">
                                                {dispute.comments && dispute.comments.trim() !== '' ? (
                                                    <div className="truncate" title={dispute.comments}>
                                                        {dispute.comments}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">N/A</span>
                                                )}
                                            </td>
                                                            <td className="p-3 py-4 text-center">
                                            {dispute.fileUrl && isImageFile(dispute.filePath) ? (
                                                <button onClick={() => handleImageViewClick(dispute.fileUrl!)} className="relative group p-1 rounded-full hover:bg-gray-100 transition-colors">
                                                    <img src={dispute.fileUrl} alt="Attached" className="w-8 h-8 object-cover rounded-md shadow-sm" />
                                                    <span className="absolute left-1/2 -top-8 -translate-x-1/2 scale-0 rounded bg-white px-2 py-1 text-xs font-normal text-slate-900 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 shadow-md">
                                                        View Image
                                                    </span>
                                                </button>
                                            ) : dispute.filePath ? (
                                                <a href={dispute.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm relative group">
                                                    <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13.5"></path>
                                                    </svg>
                                                    <span className="absolute left-1/2 -top-8 -translate-x-1/2 scale-0 rounded bg-white px-2 py-1 text-xs font-normal text-slate-900 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 shadow-md">
                                                        View File
                                                    </span>
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-sm">N/A</span>
                                            )}
                                        </td>
                                            <td className="p-3 py-4 flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleViewClick(dispute)}
                                                    className="text-gray-600 hover:text-gray-800 transition-colors relative group"
                                                    aria-label="View dispute"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12.001 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"></path>
                                                    </svg>
                                                    <span className="absolute left-1/2 -top-8 -translate-x-1/2 scale-0 rounded bg-white px-2 py-1 text-xs font-normal text-slate-900 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 shadow-md">
                                                        View Details
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(dispute)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors relative group"
                                                    aria-label="Edit dispute"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                    </svg>
                                                    <span className="absolute left-1/2 -top-8 -translate-x-1/2 scale-0 rounded bg-white px-2 py-1 text-xs font-normal text-slate-900 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 shadow-md">
                                                        Edit
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(dispute)}
                                                    className="text-red-600 hover:text-red-800 transition-colors relative group"
                                                    aria-label="Delete dispute"
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

                    {/* Modal Components */}
                    <CreateDisputeModal
                        isOpen={isRaiseDisputeModalOpen}
                        onClose={handleCloseRaiseDisputeModal}
                        onSubmit={handleSubmitDispute}
                        invoices={invoices}
                        loadingInvoices={loadingInvoices}
                        loading={loading}
                        selectedReason={selectedReason}
                        setSelectedReason={setSelectedReason}
                        invoiceId={invoiceId}
                        setInvoiceId={setInvoiceId}
                        submissionDate={submissionDate}
                        setSubmissionDate={setSubmissionDate}
                        additionalComments={additionalComments}
                        setAdditionalComments={setAdditionalComments}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                        selectedDisputeStatus={selectedDisputeStatus}
                        setSelectedDisputeStatus={setSelectedDisputeStatus}
                        reasonError={reasonError}
                        setReasonError={setReasonError}
                        invoiceIdError={invoiceIdError}
                        setInvoiceIdError={setInvoiceIdError}
                        submissionDateError={submissionDateError}
                        setSubmissionDateError={setSubmissionDateError}
                        disputeStatusError={disputeStatusError}
                        setDisputeStatusError={setDisputeStatusError}
                    />

                    <EditDisputeModal
                        isOpen={isEditDisputeOffcanvasOpen}
                        onClose={handleCloseEditDisputeOffcanvas}
                        onSubmit={handleUpdateDispute}
                        selectedDispute={selectedDispute}
                        invoices={invoices}
                        loadingInvoices={loadingInvoices}
                        loading={loading}
                        selectedReason={selectedReason}
                        setSelectedReason={setSelectedReason}
                        invoiceId={invoiceId}
                        setInvoiceId={setInvoiceId}
                        submissionDate={submissionDate}
                        setSubmissionDate={setSubmissionDate}
                        additionalComments={additionalComments}
                        setAdditionalComments={setAdditionalComments}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                        selectedDisputeStatus={selectedDisputeStatus}
                        setSelectedDisputeStatus={setSelectedDisputeStatus}
                        reasonError={reasonError}
                        setReasonError={setReasonError}
                        invoiceIdError={invoiceIdError}
                        setInvoiceIdError={setInvoiceIdError}
                        submissionDateError={submissionDateError}
                        setSubmissionDateError={setSubmissionDateError}
                        disputeStatusError={disputeStatusError}
                        setDisputeStatusError={setDisputeStatusError}
                    />

                    <ViewDisputeModal
                        isOpen={isViewDisputeModalOpen}
                        onClose={handleCloseViewDisputeModal}
                        selectedDispute={selectedDispute}
                        
                    />

                    <DeleteDisputeModal
                        isOpen={isDeleteConfirmModalOpen}
                        onClose={handleCloseDeleteConfirmModal}
                        onConfirm={handleConfirmDelete}
                        selectedDispute={selectedDispute}
                        loading={loading}
                    />

                </div>
            </div>
        </>
    );
};

export default RaisePaymentDisputesPage;