import { useState, useEffect } from "react";
import { getPropertyPartById, updatePropertyPart } from "../core/_requests";
import { toast } from "react-toastify";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyPartId: number;
    onPropertyPartUpdated: () => void;
}

const EditPropertyPartModal: React.FC<ModalProps> = ({ isOpen, onClose, propertyPartId, onPropertyPartUpdated }) => {
    const [loading, setLoading] = useState(false);
    const [propertyPartName, setPropertyPartName] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("Available");
    const [error, setError] = useState("");
    const [propertyId, setPropertyId] = useState<number>(0);

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
            setStatus(data.status);
        } catch (err) {
            setError("Failed to fetch property part.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!propertyPartName) {
            setError("Please fill all fields.");
            return;
        }

        try {
            setLoading(true);
            await updatePropertyPart(propertyPartId, {
                part_name: propertyPartName,
                status
            });
            toast.success("Unit updated successfully!")
            onPropertyPartUpdated();
            onClose();
        } catch (err) {
            setError("Failed to update property part.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError("");
        fetchPropertyPart();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[100000] font-inter pt-24">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
                <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={handleClose}>
                    ✖
                </button>

                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Edit Unit</h2>

                {error && <p className="text-red-500">{error}</p>}

                <label className='text-slate-900 text-md block mb-1'>Unit Name</label>
                <input
                    type="text"
                    // placeholder="Unit Name"
                    value={propertyPartName}
                    onChange={(e) => setPropertyPartName(e.target.value)}
                    className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                />
                <label className='text-slate-700 block mb-2'>Status of the unit</label>
                <label className="mr-2 mb-5 cursor-pointer">
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

                <label className="mt-2 cursor-pointer">
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

                <div className="flex justify-end mt-2">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleUpdate} disabled={loading}>
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPropertyPartModal;
