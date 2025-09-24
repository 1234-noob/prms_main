import React, { FC } from 'react';
import { Dispute, DisputeStatus } from '../../Disputes/core/_model';

interface ViewDisputeModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDispute: Dispute | null;
}

const ViewDisputeModal: FC<ViewDisputeModalProps> = ({
    isOpen,
    onClose,
    selectedDispute,
}) => {
    const statusColors: Record<DisputeStatus, string> = {
        pending: "bg-yellow-100 text-yellow-700",
        resolved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
    };

    const isImageFile = (filePath?: string) => {
        if (!filePath) return false;
        const lowerCasePath = filePath.toLowerCase();
        return lowerCasePath.endsWith('.png') || lowerCasePath.endsWith('.jpg') || lowerCasePath.endsWith('.jpeg') || lowerCasePath.endsWith('.gif');
    };

    const getFileUrl = (filePath?: string, fileUrl?: string): string | undefined => {
        if (fileUrl) {
            return fileUrl;
        }
        if (filePath) {
            const baseApiUrl = process.env.REACT_APP_API_URL_HELP_SUPPORT || 'http://localhost:3013';
            const cleanedFilePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
            return `${baseApiUrl}/${cleanedFilePath}`;
        }
        return undefined;
    };

    if (!isOpen || !selectedDispute) return null;

    const fileUrl = getFileUrl(selectedDispute.filePath, selectedDispute.fileUrl);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] font-sans">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md pt-8 px-6 pb-6 relative max-h-[85vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close view modal"
                >
                    &#10005;
                </button>
                <h2 className="text-xl font-semibold mb-4 text-center">Dispute Details</h2>
                <div className="grid grid-cols-1 gap-3 text-gray-700">
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium">Dispute ID:</span>
                        <span>{selectedDispute.disputeID}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium">Invoice Number:</span>
                        <span>{selectedDispute.invoiceId}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium">Reason:</span>
                        <span>{selectedDispute.reason}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium">Submitted Date:</span>
                        <span>{selectedDispute.submittedDate}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium">Status:</span>
                        <span className={`${statusColors[selectedDispute.disputeStatus]} px-3 py-1 text-xs rounded-full font-medium`}>
                            {selectedDispute.disputeStatus}
                        </span>
                    </div>
                    {selectedDispute.comments && (
                        <div className="flex flex-col border-b pb-2">
                            <span className="font-medium mb-1">Additional Comments:</span>
                            <p className="text-sm bg-gray-50 p-2 rounded-md">{selectedDispute.comments}</p>
                        </div>
                    )}
                    {selectedDispute.filePath && fileUrl && (
                        <div className="flex flex-col">
                            <span className="font-medium mb-1">Attached File:</span>
                            {isImageFile(selectedDispute.filePath) ? (
                                <img
                                    src={fileUrl}
                                    alt="Dispute Attachment"
                                    className="max-w-full h-auto mt-2 rounded-md border"
                                />
                            ) : (
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    View Document
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewDisputeModal;