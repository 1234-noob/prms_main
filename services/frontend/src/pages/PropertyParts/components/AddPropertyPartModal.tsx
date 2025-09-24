import { useEffect, useState } from "react";
import { createPropertyPart } from "../core/_requests";
import { Property } from "../../Properties/core/_models";
import { getAllProperties } from "../../Properties/core/_requests";
import { toast } from "react-toastify";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPropertyPartAdded: () => void;
}

const AddPropertyPartModal: React.FC<ModalProps> = ({ isOpen, onClose, onPropertyPartAdded }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [propertyId, setPropertyId] = useState<number>(0);
    const [unitName, setUnitName] = useState("");
    const [location, setLocation] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("Available");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedOrganization, setSelectedOrganization] = useState<{ id: number; name: string }>({ id: 0, name: "" });

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const data = await getAllProperties();
            // Filter properties where splitable is true
            const splitableProperties = data.filter((property: any) => property.splitable === true);

            setProperties(splitableProperties);
        } catch (err) {
            setError("Failed to fetch properties");
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async () => {
        console.log("propertyId: ", propertyId);
        if (!propertyId || !unitName) {
            setError("Please fill all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            console.log(propertyId);
            const response = await createPropertyPart({ 
                property_id: propertyId, 
                part_name: unitName, 
                status: selectedStatus
             });

             toast.success("Unit created succesfully!")

            // Notify parent component to refresh the table
            onPropertyPartAdded();
            // Clear form & close modal
            setPropertyId(0);
            setUnitName("");
            setLocation("");
            setSelectedStatus("Available");
            onClose();
        } catch (error) {
            console.error("Error creating property part:", error);
            setError("Failed to create property part");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setPropertyId(0);
        setUnitName("");
        setLocation("");
        setSelectedStatus("Available");
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

                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Add Unit</h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <label className='text-slate-900 text-md block mb-1'>Property Name</label>
                <select
                    value={propertyId}
                    onChange={(e) => setPropertyId(Number(e.target.value))}
                    className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                >
                    <option value="0">Select a property</option>
                    {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                            {property.name}
                        </option>
                    ))}
                </select>

                <label className='text-slate-900 text-md block mb-1'>Unit Name</label>
                <input
                    type="text"
                    // placeholder="Unit Name"
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                    className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                />

                {/*Rupee Amount Field */}
                <label className='text-slate-900 text-md block mb-1'>Amount (in ₹)</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount in rupees"
                    className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                />

                <label className='text-slate-700 block mb-2'>Status of the unit</label>
                <label className="mr-2 mb-5 cursor-pointer">
                    <input
                        type="radio"
                        name="status"
                        value="Available"
                        checked={selectedStatus === "Available"}
                        onChange={() => setSelectedStatus("Available")}
                        className="hidden"
                    />
                    <span
                        className={`px-4 py-1 text-sm rounded-full ${selectedStatus === "Available"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                            }`}
                    >
                        {selectedStatus === "Available" && "✔ "} Available
                    </span>
                </label>

                <label className="mt-2 cursor-pointer">
                    <input
                        type="radio"
                        name="status"
                        value="Rented"
                        checked={selectedStatus === "Rented"}
                        onChange={() => setSelectedStatus("Rented")}
                        className="hidden"
                    />
                    <span
                        className={`px-4 py-1 text-sm rounded-full ${selectedStatus === "Rented"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                            }`}
                    >
                        {selectedStatus === "Rented" && "✔ "} Rented
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

export default AddPropertyPartModal;
