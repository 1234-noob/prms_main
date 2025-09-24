import React, { FC, useRef, useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { UpdateDisputePayload, DisputeStatus, Dispute } from '../../Disputes/core/_model';
import { Invoice } from '../../Invoices/core/_model';

interface EditDisputeModalProps {
    isOpen: boolean;
    onClose: () => void;
    // Corrected type: Change 'string' to 'number' for the id parameter
    onSubmit: (id: number, payload: UpdateDisputePayload, file?: File) => Promise<void>;
    selectedDispute: Dispute | null;
    invoices: Invoice[];
    loadingInvoices: boolean;
    loading: boolean;
    selectedReason: string;
    setSelectedReason: (reason: string) => void;
    invoiceId: string;
    setInvoiceId: (id: string) => void;
    submissionDate: string;
    setSubmissionDate: (date: string) => void;
    additionalComments: string;
    setAdditionalComments: (comments: string) => void;
    selectedFile: File | null;
    setSelectedFile: (file: File | null) => void;
    selectedDisputeStatus: DisputeStatus | '';
    setSelectedDisputeStatus: (status: DisputeStatus | '') => void;
    reasonError: string | null;
    setReasonError: (error: string | null) => void;
    invoiceIdError: string | null;
    setInvoiceIdError: (error: string | null) => void;
    submissionDateError: string | null;
    setSubmissionDateError: (error: string | null) => void;
    disputeStatusError: string | null;
    setDisputeStatusError: (error: string | null) => void;
}

const EditDisputeModal: FC<EditDisputeModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    selectedDispute,
    invoices,
    loadingInvoices,
    loading,
    selectedReason,
    setSelectedReason,
    invoiceId,
    setInvoiceId,
    submissionDate,
    setSubmissionDate,
    additionalComments,
    setAdditionalComments,
    selectedFile,
    setSelectedFile,
    selectedDisputeStatus,
    setSelectedDisputeStatus,
    reasonError,
    setReasonError,
    invoiceIdError,
    setInvoiceIdError,
    submissionDateError,
    setSubmissionDateError,
    disputeStatusError,
    setDisputeStatusError,
}) => {
    const datePickerRef = useRef<HTMLInputElement>(null);

    const disputeReasons = [
        { id: "overpayment", label: "Overpayment" },
        { id: "underpayment", label: "Underpayment" },
        { id: "duplicate", label: "Duplicate Payment" },
        { id: "incorrect_amount", label: "Incorrect Amount" },
        { id: "service_not_received", label: "Service Not Received" },
        { id: "payment_not_applied", label: "Payment Not Applied" },
        { id: "other", label: "Other" },
    ];

    const disputeStatusOptions: DisputeStatus[] = ['pending', 'resolved', 'rejected'];

    useEffect(() => {
        let fpInstance: flatpickr.Instance | null = null;
        if (isOpen && datePickerRef.current) {
            fpInstance = flatpickr(datePickerRef.current, {
                dateFormat: "d M, Y",
                onChange: (selectedDates, dateStr) => {
                    setSubmissionDate(dateStr);
                    if (submissionDateError) setSubmissionDateError(null);
                },
                onOpen: (selectedDates, dateStr, instance) => {
                    if (instance.calendarContainer) {
                        instance.calendarContainer.style.zIndex = '100002';
                    }
                },
            });
        }

        if (fpInstance && submissionDate) {
            fpInstance.setDate(submissionDate, true);
        } else if (fpInstance && !submissionDate) {
            fpInstance.clear();
        }

        return () => {
            if (fpInstance) {
                fpInstance.destroy();
            }
        };
    }, [isOpen, submissionDate, submissionDateError, setSubmissionDate, setSubmissionDateError]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDispute) return;

        // Clear all errors
        setReasonError(null);
        setInvoiceIdError(null);
        setSubmissionDateError(null);
        setDisputeStatusError(null);

        let isValid = true;

        if (!selectedReason) {
            setReasonError('Reason for dispute is required.');
            isValid = false;
        }

        if (!invoiceId || invoiceId.trim() === '') {
            setInvoiceIdError('Invoice number is required.');
            isValid = false;
        }

        if (!submissionDate) {
            setSubmissionDateError('Submission date is required.');
            isValid = false;
        }

        if (!selectedDisputeStatus) {
            setDisputeStatusError('Dispute status is required.');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        const payload: UpdateDisputePayload = {
            tenantId: 104,
            reason: selectedReason,
            invoiceId: parseInt(invoiceId),
            status: selectedDisputeStatus as DisputeStatus,
            comments: additionalComments || undefined,
        };
        
        // The error is here. `selectedDispute.id` is a number, but the `onSubmit` prop expects a string.
        // We'll fix this by updating the type definition in the props.
        await onSubmit(selectedDispute.id, payload, selectedFile || undefined);
    };

    if (!isOpen || !selectedDispute) return null;

    return (
        <>
            <style>{`
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s forwards;
                }
                @keyframes slide-in-right {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
            `}</style>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-[100000] font-sans">
                <div className="bg-white w-full max-w-md pt-8 px-6 pb-6 relative h-full overflow-y-auto shadow-lg animate-slide-in-right">
                    <button
                        className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={onClose}
                        aria-label="Close edit modal"
                    >
                        &#10005;
                    </button>

                    <h2 className="text-xl font-semibold mb-4">Edit Payment Dispute (ID: {selectedDispute.disputeID})</h2>

                    <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="editInvoiceNumber" className='block text-sm font-medium text-gray-700 mb-1'>
                                Invoice Number <span className="text-red-500">*</span>
                            </label>
                            {loadingInvoices ? (
                                <div className="w-full border rounded-md px-3 py-2 bg-gray-50 text-gray-500">
                                    Loading invoices...
                                </div>
                            ) : (
                                <select
                                    id="editInvoiceNumber"
                                    value={invoiceId}
                                    onChange={(e) => {
                                        setInvoiceId(e.target.value);
                                        if (invoiceIdError) setInvoiceIdError(null);
                                    }}
                                    className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${invoiceIdError ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select an invoice</option>
                                    {invoices.map((invoice) => (
                                        <option key={invoice.id} value={invoice.id}>
                                            Invoice #{invoice.id} - {invoice.tenant_name} - ₹{invoice.amount}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {invoiceIdError && <p className="text-red-500 text-xs mt-1">{invoiceIdError}</p>}
                        </div>

                        <div>
                            <label htmlFor="editReason" className='block text-sm font-medium text-gray-700 mb-1'>
                                Reason For Dispute <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="editReason"
                                value={selectedReason}
                                onChange={(e) => {
                                    setSelectedReason(e.target.value);
                                    if (reasonError) setReasonError(null);
                                }}
                                className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${reasonError ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">Select a reason</option>
                                {disputeReasons.map((reason) => (
                                    <option key={reason.id} value={reason.label}>
                                        {reason.label}
                                    </option>
                                ))}
                            </select>
                            {reasonError && <p className="text-red-500 text-xs mt-1">{reasonError}</p>}
                        </div>

                        <div>
                            <label htmlFor="editSubmissionDate" className='block text-sm font-medium text-gray-700 mb-1'>
                                Submission Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="editSubmissionDate"
                                ref={datePickerRef}
                                value={submissionDate}
                                readOnly
                                className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${submissionDateError ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Select date"
                            />
                            {submissionDateError && <p className="text-red-500 text-xs mt-1">{submissionDateError}</p>}
                        </div>

                        <div>
                            <label htmlFor="editDisputeStatus" className='block text-sm font-medium text-gray-700 mb-1'>
                                Dispute Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="editDisputeStatus"
                                value={selectedDisputeStatus}
                                onChange={(e) => {
                                    setSelectedDisputeStatus(e.target.value as DisputeStatus);
                                    if (disputeStatusError) setDisputeStatusError(null);
                                }}
                                className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${disputeStatusError ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">Select Status</option>
                                {disputeStatusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                            {disputeStatusError && <p className="text-red-500 text-xs mt-1">{disputeStatusError}</p>}
                        </div>

                        <div>
                            <label htmlFor="editFile" className='block text-sm font-medium text-gray-700 mb-1'>Attach File (Optional)</label>
                            <input
                                type="file"
                                id="editFile"
                                onChange={handleFileChange}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {selectedDispute.filePath && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Current file: {selectedDispute.filePath.split('/').pop()}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="editComments" className='block text-sm font-medium text-gray-700 mb-1'>Additional Comments (Optional)</label>
                            <textarea
                                id="editComments"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                                placeholder="Provide more details about your issue..."
                                value={additionalComments}
                                onChange={(e) => setAdditionalComments(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="mt-2 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all font-medium"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Dispute'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditDisputeModal;