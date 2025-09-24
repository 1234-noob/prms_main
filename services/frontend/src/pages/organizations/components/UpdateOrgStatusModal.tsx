import React, { useEffect, useState } from "react";
import { getOrganizationById, updateOrganization } from "../core/_requests";

interface SplittableModalProps {
    isOpen: boolean;
    organizationId: number;
    onClose: () => void;
    onOrganizationUpdated: () => void;
}

const UpdateOrgStatusModal: React.FC<SplittableModalProps> = ({ isOpen, onClose, organizationId, onOrganizationUpdated }) => {

    const [status, setStatus] = useState<boolean>(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen && organizationId) {
            fetchProperties();
        }
    }, [isOpen, organizationId]);

    const fetchProperties = async () => {
        setLoading(true); 
        try {
            const data = await getOrganizationById(organizationId);
            setStatus(data.isActive);
        } catch (err) {
            setError("Failed to fetch organization.");
        } finally {
            setLoading(false);
        }
    };

    const saveStatus = async () => {
          try {
                    setLoading(true);
                    await updateOrganization(organizationId, { isActive : status
                    });
                    onOrganizationUpdated();
                    setTimeout(onClose, 100); 
                } catch (err) {
                    setError("Failed to update organization status.");
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

                <h3 className="text-lg text-slate-800 font-bold mb-5">Change Status</h3>

                {error && <p className="text-red-500">{error}</p>}

                <label className="block mb-5 cursor-pointer">
                    <input
                        type="radio"
                        value="true"
                        checked={status === true}
                        onChange={() => setStatus(true)}
                        className="hidden"
                    />
                    <span className={`px-4 py-1 text-sm rounded-full ${status === true ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                        {status === true && "✔ "} Active
                    </span>
                </label>

                <label className="block mt-2 cursor-pointer">
                    <input
                        type="radio"
                        value="false"
                        checked={status === false}
                        onChange={() => setStatus(false)}
                        className="hidden"
                    />
                    <span className={`px-4 py-1 text-sm rounded-full ${status === false ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                        {status === false && "✔ "} Supsended
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

export default UpdateOrgStatusModal;
