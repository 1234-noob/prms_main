import { useState } from "react";
import { createProperty } from "../core/_requests";
import { toast } from 'react-toastify';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPropertyAdded: () => void;
}

const AddPropertyModal: React.FC<ModalProps> = ({ isOpen, onClose, onPropertyAdded }) => {
    const [propertyName, setPropertyName] = useState("");
    const [location, setLocation] = useState("");
    const [splitable, setSplitable] = useState<boolean>(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedOrganization, setSelectedOrganization] = useState<{ id: number; name: string }>({ id: 0, name: "" });

    const handleSubmit = async () => {
        if (!propertyName || !location) {
            setError("Please fill all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await createProperty({
                name: propertyName,
                // organization_id: selectedOrganization.id,
                // organization_name: selectedOrganization.name,
                organization_id: 1,
                organization_name: "Hilltop Enclave",
                location: location,
                splitable: splitable
            });

            // Notify parent component to refresh the table
            toast.success("Property Added Successfully!");
            onPropertyAdded();
            // Clear form & close modal
            setPropertyName("");
            setLocation("");
            onClose();
        } catch (error) {
            toast.error("Error adding property");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setPropertyName("");
        setLocation("");
        setSplitable(true);
        setError("");
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[100000] font-inter pt-24">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
                {/* Close Icon */}
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={handleClose}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Add Property</h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <label className='text-slate-900 text-md block mb-1'>Property Name</label>
                <input
                    type="text"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                />

                <label className='text-slate-900 text-md block mb-1'>Location</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                />

                <label className='text-slate-900 block mb-2'>Is the Property Splittable?</label>
                <label className="mr-2 mb-5 cursor-pointer">
                    <input
                        type="radio"
                        name="splitable"
                        value="Yes"
                        checked={splitable === true}
                        onChange={() => setSplitable(true)}
                        className="hidden"
                    />
                    <span
                        className={`px-4 py-1 text-sm rounded-full ${splitable === true
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                            }`}
                    >
                        {splitable === true && "✔ "} Yes
                    </span>
                </label>

                <label className="mt-2 cursor-pointer">
                    <input
                        type="radio"
                        name="splitable"
                        value="No"
                        checked={splitable === false}
                        onChange={() => setSplitable(false)}
                        className="hidden"
                    />
                    <span
                        className={`px-4 py-1 text-sm rounded-full ${splitable === false
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {splitable === false && "✔ "} No
                    </span>
                </label>

                <div className="flex justify-end mt-2">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                        disabled={loading}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPropertyModal;
