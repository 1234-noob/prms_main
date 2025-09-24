import React, { useEffect, useState } from "react";
import { deletePropertyPart, getPropertyPartById } from "../core/_requests";
import { toast } from "react-toastify";

interface DeletePropertyPartModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyPartId: number;
    onPropertyPartDeleted: () => void;
}

const DeletePropertyPartModal: React.FC<DeletePropertyPartModalProps> = ({ isOpen, onClose, propertyPartId, onPropertyPartDeleted }) => {

    const handleDeleteClick = async () => {
        if (propertyPartId !== null) {
            try {
                await deletePropertyPart(propertyPartId);
                onPropertyPartDeleted();
                toast.success("Unit deleted successfully!");
            } catch (error) {
                setError("Failed to delete Property Part.");
            } finally {
                onClose();
            }
        }
    };
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [propertyPartName, setPropertyPartName] = useState<any>(null);

    useEffect(() => {
        if (propertyPartId) {
            fetchPropertyPart();
        }
    }, [propertyPartId]);

    const fetchPropertyPart = async () => {
        try {
            setLoading(true);
            const data = await getPropertyPartById(propertyPartId);
            setPropertyPartName(data.part_name);
        } catch (err) {
            setError("Failed to fetch property part.");
        } finally {
            setLoading(false);
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
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <p className="mt-2">
                    Are you sure you want to delete <strong>{ propertyPartName || "this Unit"}</strong>?
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

export default DeletePropertyPartModal;
