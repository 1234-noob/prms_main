import React, { FC, useState } from 'react';
import { MaintenanceRequest } from '../core/_model';
import { deleteMaintenanceRequest } from '../core/_request';

interface DeleteMaintenanceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedRequest: MaintenanceRequest | null;
}

const DeleteMaintenanceRequestModal: FC<DeleteMaintenanceRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedRequest,
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  const handleClose = () => {
    setMessage(null);
    onClose();
  };

  const handleConfirmDelete = async () => {
    if (!selectedRequest) return;

    setLoading(true);
    setMessage(null);

    try {
      const responseData = await deleteMaintenanceRequest(selectedRequest.id);
      console.log("Maintenance request deleted successfully:", responseData.message);

      //setMessage({ type: 'success', text: 'Maintenance request deleted successfully!' });
      
      // Close the modal and trigger success callback after a short delay
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1000);
      
    } catch (error) {
      console.error("Error deleting maintenance request:", error);
      setMessage({ type: 'error', text: `Failed to delete request: ${error instanceof Error ? error.message : String(error)}` });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !selectedRequest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100001] font-sans">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        
        {message && (
          <div className={`p-3 mb-4 rounded-md text-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}
        
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete request <span className="font-medium">{selectedRequest.requestID}</span>?
          This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMaintenanceRequestModal;