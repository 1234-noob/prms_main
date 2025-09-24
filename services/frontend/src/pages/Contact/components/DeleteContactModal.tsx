import React from 'react';
import { Contact } from '../core/_model';

interface DeleteContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  selectedContact: Contact | null;
  loading: boolean;
}

const DeleteContactModal: React.FC<DeleteContactModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedContact,
  loading,
}) => {
  if (!isOpen || !selectedContact) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100001] font-sans">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete contact <span className="font-medium">{selectedContact.contactID}</span>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
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

export default DeleteContactModal;