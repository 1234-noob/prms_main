import React, { useEffect, useState } from "react";
import { deleteTenant, getTenantById } from "../core/_requests";
import { toast } from "react-toastify";

interface DeleteTenantModalProps {
    isOpen: boolean;
    onClose: () => void;
    tenantId: number;
    onTenantDeleted: () => void;
}

const DeleteTenantModal: React.FC<DeleteTenantModalProps> = ({ isOpen, onClose, tenantId, onTenantDeleted }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [tenantName, setTenantName] = useState<any>(null);

    useEffect(() => {
        if (tenantId) {
            fetchProperties();
        }
    }, [tenantId]);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const data = await getTenantById(tenantId);
            setTenantName(data.name);
        } catch (err) {
            setError("Failed to fetch tenant.");
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteClick = async () => {
        if (tenantId !== null) {
            try {
                console.log(tenantId);
                await deleteTenant(tenantId, { isActive: false });
                onTenantDeleted();
                toast.success("Tenant marked as inactive successfully!");
            } catch (error) {
                alert("Failed to delete tenant.");
            } finally {
                onClose();
            }
        }
    };


    if (!isOpen) return null; // Don't render if modal is closed

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative">
                <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                <p className="mt-2">
                    Are you sure you want to delete <strong>{tenantName || "this tenant"}</strong>?
                </p>

                <div className="flex justify-end mt-4 space-x-4">
                    <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400" onClick={onClose}>
                        Cancel
                    </button>
                    <button onClick={handleDeleteClick} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteTenantModal;
