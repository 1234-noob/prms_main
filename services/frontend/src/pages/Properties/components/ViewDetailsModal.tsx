import { useState, useEffect } from "react";
import { getPropertyById, updateProperty } from "../core/_requests";
import { getPropertyPartByPropertyId } from "../../Tenant/core/_requests";
import { Unit } from "../../PropertyParts/core/_models";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: number;
}

const ViewDetailsModal: React.FC<ModalProps> = ({ isOpen, onClose, propertyId }) => {
    const [propertyName, setPropertyName] = useState("");
    const [propertyParts, setPropertyParts] = useState<Unit[]>([]);
    const [location, setLocation] = useState("");
    const [splitable, setSplittable] = useState<boolean>(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [property, setProperty] = useState<any>(null);

    useEffect(() => {
        if (propertyId) {
            fetchProperties();
            fetchPropertyPartsByProperty(propertyId);
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

    const fetchPropertyPartsByProperty = async (propertyId: number) => {
        try {
            console.log("selected property id : " + propertyId)
            const data = await getPropertyPartByPropertyId(propertyId);
            console.log("Property parts by property : " + data)
            setPropertyParts(data);
        } catch (err) {
            setError("Failed to fetch property parts");
        } finally {
            setLoading(false);
        }
    }

    const handleClose = () => {
        setError("");
        fetchProperties();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[100000] font-inter pt-24">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-[30rem]">
                <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={handleClose}>
                    ✖
                </button>

                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Property Details</h2>

                <div className="space-y-5 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-500">Property Name</label>
                            <div className="text-base font-medium text-gray-800 border-b pb-1">
                                {propertyName}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500">Location</label>
                            <div className="text-base font-medium text-gray-800 border-b pb-1">
                                {location}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500">Is Splitable?</label>
                        <div className="mt-1">
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${splitable
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {splitable ? "Yes" : "No"}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">

                        <>
                            <div>
                                <label className="block text-sm text-gray-500">Property Part Name</label>
                                {propertyParts.map((part) =>
                                    <div key={part.id} className="text-base font-medium text-gray-800 pb-1">
                                        {part.part_name}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500">Status</label>
                                {propertyParts.map((part) =>
                                    <div key={part.id} className="text-base font-medium text-gray-800 pb-3">
                                        <span className={`${part.status === "Available" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}  px-3 py-1 rounded-full pb-1`}>
                                            {part.status}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewDetailsModal;
