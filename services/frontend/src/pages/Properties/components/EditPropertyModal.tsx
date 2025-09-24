import { useState, useEffect } from "react";
import { getPropertyById, updateProperty } from "../core/_requests";
import { toast } from 'react-toastify';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: number;
    onPropertyUpdated: () => void;
}

const EditPropertyModal: React.FC<ModalProps> = ({ isOpen, onClose, propertyId, onPropertyUpdated }) => {
    const [propertyName, setPropertyName] = useState("");
    const [location, setLocation] = useState("");
    const [splitable, setSplittable] = useState<boolean>(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [property, setProperty] = useState<any>(null);

    useEffect(() => {
        if (propertyId) {
            fetchProperties();
        }
    }, [propertyId]);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const data = await getPropertyById(propertyId);
            setProperty(data);
            setPropertyName(data.name);
            setLocation(data.location);
            setSplittable(data.splitable);
        } catch (err) {
            setError("Failed to fetch property.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!propertyName || !location) {
            setError("Please fill all fields.");
            return;
        }

        try {
            setLoading(true);
await updateProperty(propertyId, {
  name: propertyName,
  location,
  splitable,
  organization_name: property?.organization_name || "", // Required by backend
  isActive: property?.isActive ?? true // Optional fallback
});
            toast.success("Property Updated Successfully!");

            onPropertyUpdated();
            onClose();
        } catch (err) {
            setError("Failed to update property.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError("");
        fetchProperties();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[100000] font-inter pt-24">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
                <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={handleClose}>
                    ✖
                </button>

                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Edit Property</h2>

                {error && <p className="text-red-500">{error}</p>}

                <label className="text-slate-900 text-md block mb-1">Property Name</label>
                <input type="text" value={propertyName} onChange={(e) => setPropertyName(e.target.value)} className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg" />

                <label className="text-slate-900 text-md block mb-1">Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg" />

                <label className="mr-2 mb-5 cursor-pointer">
                    <input
                        type="radio"
                        name="splitable"
                        value="Yes"
                        checked={splitable === true}
                        onChange={() => setSplittable(true)}
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
                        onChange={() => setSplittable(false)}
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
                    <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleUpdate} disabled={loading}>
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPropertyModal;
