import { useState, useEffect } from "react";
import { getPropertyPartByPropertyId, getTenantById, updateTenant } from "../core/_requests";
import DatePicker from "react-datepicker";
import { getAllProperties } from "../../Properties/core/_requests";
import { Property } from "../../Properties/core/_models";
import { Unit } from "../../PropertyParts/core/_models";
import { toast } from "react-toastify";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    tenantId: number;
    onTenantUpdated: () => void;
}

const EditTenantModal: React.FC<ModalProps> = ({ isOpen, onClose, tenantId, onTenantUpdated }) => {
    const [tenantName, setTenantName] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [tenant, setTenant] = useState<any>(null);
    const [selectedProperty, setSelectedProperty] = useState<{ id: number; name: string }>({ id: 0, name: "" });


    useEffect(() => {
        if (tenantId) {
            fetchTenant();
        }
    }, [tenantId]);

    const fetchTenant = async () => {
        try {
            setLoading(true);
            const data = await getTenantById(tenantId);
            setTenant(data);
            setTenantName(data.name);
            setContact(data.contact);
            setEmail(data.email);
        } catch (err) {
            setError("Failed to fetch tenant.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!tenantName || !email) {
            setError("Please fill all fields.");
            return;
        }

        try {
            setLoading(true);
            await updateTenant(tenantId, {
                name: tenantName,
                contact: contact,
                email: email,
            });

            toast.success("Tenant updated successfully!");
            onTenantUpdated();
            onClose();
        } catch (err) {
            setError("Failed to update tenant.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError("");
        fetchTenant();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-[50rem]">
                <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={handleClose}>
                    ✖
                </button>

                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Edit Tenant</h2>

                {error && <p className="text-red-500">{error}</p>}

                <div className='flex space-x-4'>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Tenant Name</label>
                        <input
                            type="text"
                            // placeholder="Property Name"
                            value={tenantName}
                            onChange={(e) => setTenantName(e.target.value)}
                            className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                        />
                    </div>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Email</label>
                        <input
                            type="text"
                            // placeholder="Location"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                        />
                    </div>
                </div>
                <div className='flex space-x-4'>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Contact</label>
                        <input
                            type="text"
                            // placeholder="Location"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                        />
                    </div>
                    <div className='flex-1'>
                    </div>
                </div>

                <div className="flex justify-end mt-2">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleUpdate} disabled={loading}>
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTenantModal;
