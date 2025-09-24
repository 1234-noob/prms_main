import React, { useEffect, useState } from "react";
import { getPropertyPartById, updatePropertyPart } from "../core/_requests";
import { toast } from "react-toastify";

interface StatusModalProps {
    isOpen: boolean;
    propertyPartId: number;
    onClose: () => void;
    onPropertyPartUpdated: () => void;
}

const UpdateStatusModal: React.FC<StatusModalProps> = ({ isOpen, onClose, propertyPartId, onPropertyPartUpdated }) => {

    const [status, setStatus] = useState("Available");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen && propertyPartId) {
            fetchProperties();
        }
    }, [isOpen, propertyPartId]);

    const fetchProperties = async () => {
        setLoading(true); 
        try {
            const data = await getPropertyPartById(propertyPartId);
            setStatus(data.status);
        } catch (err) {
            setError("Failed to fetch property.");
        } finally {
            setLoading(false);
        }
    };

    const saveStatus = async () => {
          try {
                    setLoading(true);
                    await updatePropertyPart(propertyPartId, {
                        status
                    });
                    toast.success("Unit updated successfully");
                    onPropertyPartUpdated();
                    setTimeout(onClose, 100); // Ensure update propagates before closing modal
                } catch (err) {
                    setError("Failed to update property.");
                } finally {
                    setLoading(false);
                }
    };

    if (!isOpen) return null; // Don't render if modal is closed

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-5 rounded-md shadow-md px-10 relative w-96">

                <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h3 className="text-lg text-slate-800 font-bold mb-5">Update Status of Unit</h3>

                {error && <p className="text-red-500">{error}</p>}

                <label className="block mb-5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="Available"
                                        checked={status === "Available"}
                                        onChange={() => setStatus("Available")}
                                        className="hidden"
                                    />
                                    <span
                                        className={`px-4 py-1 text-sm rounded-full ${status === "Available"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {status === "Available" && "✔ "} Available
                                    </span>
                                </label>

                                <label className="block mt-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="Rented"
                                        checked={status === "Rented"}
                                        onChange={() => setStatus("Rented")}
                                        className="hidden"
                                    />
                                    <span
                                        className={`px-4 py-1 text-sm rounded-full ${status === "Rented"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {status === "Rented" && "✔ "} Rented
                                    </span>
                                </label>

                {/* Update Button */}
                <div className="mt-6 flex justify-end">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={saveStatus}>
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateStatusModal;
