import React, { useEffect, useState } from "react";
import { getPropertyById, updateProperty } from "../core/_requests";
import { toast } from 'react-toastify';

interface SplittableModalProps {
    isOpen: boolean;
    propertyId: number;
    onClose: () => void;
    onPropertyUpdated: () => void;
}

const UpdateSplittableModal: React.FC<SplittableModalProps> = ({ isOpen, onClose, propertyId, onPropertyUpdated }) => {

    const [splitable, setSplitable] = useState<boolean>(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen && propertyId) {
            fetchProperties();
        }
    }, [isOpen, propertyId]);

    const fetchProperties = async () => {
        setLoading(true); 
        try {
            const data = await getPropertyById(propertyId);
            setSplitable(data.splitable);
        } catch (err) {
            setError("Failed to fetch property.");
        } finally {
            setLoading(false);
        }
    };

    const saveStatus = async () => {
          try {
                    setLoading(true);
                    await updateProperty(propertyId, {
                        splitable
                    });
                    toast.success("Splitable Updated Successfully!");

                    onPropertyUpdated();
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

                <h3 className="text-lg text-slate-800 font-bold mb-5">Is the Property Splittable?</h3>

                {error && <p className="text-red-500">{error}</p>}

                <label className="block mb-5 cursor-pointer">
                    <input
                        type="radio"
                        name="splitable"
                        value="Yes"
                        checked={splitable === true}
                        onChange={() => setSplitable(true)}
                        className="hidden"
                    />
                    <span className={`px-4 py-1 text-sm rounded-full ${splitable === true ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                        {splitable === true && "✔ "} Yes
                    </span>
                </label>

                <label className="block mt-2 cursor-pointer">
                    <input
                        type="radio"
                        name="splitable"
                        value="No"
                        checked={splitable === false}
                        onChange={() => setSplitable(false)}
                        className="hidden"
                    />
                    <span className={`px-4 py-1 text-sm rounded-full ${splitable === false ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                        {splitable === false && "✔ "} No
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

export default UpdateSplittableModal;
