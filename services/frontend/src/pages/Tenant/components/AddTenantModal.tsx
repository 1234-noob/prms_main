import { useEffect, useState } from "react";
import { createTenant, createTenantMapping, getPropertyPartByPropertyId, updateTenant } from "../core/_requests";
import DatePicker from "react-datepicker";
import { getAllProperties } from "../../Properties/core/_requests";
import { Property } from "../../Properties/core/_models";
import { Unit } from "../../PropertyParts/core/_models";
import { toast } from "react-toastify";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTenantAdded: () => void;
}

const AddTenantModal: React.FC<ModalProps> = ({ isOpen, onClose, onTenantAdded }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [propertyParts, setPropertyParts] = useState<Unit[]>([]);
    const [tenantName, setTenantName] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState('');
    const [rentAmount, setRentAmount] = useState<string>("");
    const [rentError, setRentError] = useState('');
    const [tdsApplicable, setTdsApplicable] = useState<boolean>(true);
    const [contractStartDate, setContractStartDate] = useState<Date | null>(null);
    const [contractEndDate, setContractEndDate] = useState<Date | null>(null);
    const [dateError, setDateError] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedOrganization, setSelectedOrganization] = useState<{ id: number; name: string }>({ id: 0, name: "select a property" });
    const [selectedProperty, setSelectedProperty] = useState<{ id: number; name: string }>({ id: 0, name: "" });
    const [selectedPropertyPart, setSelectedPropertyPart] = useState<{ id: number; name: string }>({ id: 0, name: "" });


    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const data = await getAllProperties();
            setProperties(data);
        } catch (err) {
            setError("Failed to fetch properties");
        } finally {
            setLoading(false);
        }
    }
    const fetchPropertyPartsByProperty = async (propertyId: number) => {
        try {
            console.log("selected property id : " + propertyId)
            const data = await getPropertyPartByPropertyId(propertyId);
            console.log("Property parts by property : " + data)
            setPropertyParts(data);
        } catch (err) {
            setError("Failed to fetch properties");
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async () => {
        if (!tenantName || !email || !selectedProperty.id || !selectedProperty.name || !selectedPropertyPart.id || !selectedPropertyPart.name) {
            setError("Please fill all required fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Create date objects with local timezone (no UTC/GMT conversion)
            // This ensures dates are sent in the format MySQL expects
            // const startDate = new Date(contractStartDate!.toLocaleDateString());
            // const endDate = new Date(contractEndDate!.toLocaleDateString());

            const response = await createTenant({
                name: tenantName,
                contact: contact,
                email: email,
            });
            await updateTenant(response.id,
                {
                    isActive: true,
                })
            await createTenantMapping({
                tenant_id: response.id,
                organization_id: 1,
                organization_name: "MahaRealty Group",
                property_id: selectedProperty.id,
                property_name: selectedProperty.name,
                property_part_id: selectedPropertyPart.id,
                property_part_name: selectedPropertyPart.name,
                // property_id: 10,
                // property_name: "Signature Heights",
                // property_part_id: 100,
                // property_part_name: "Unit B",
            });

            console.log("Tenant Created:", response.data);
            toast.success("Tenant added successfully");
            onTenantAdded();
            setTenantName("");
            setEmail("");
            setContact("");
            setSelectedProperty({ id: 0, name: "" });
            setSelectedPropertyPart({ id: 0, name: "" });
            onClose();
        } catch (error) {
            console.error("Error creating tenant:", error);
            setError("Failed to create tenant");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setTenantName("");
        setContact("");
        setEmail("");
        setSelectedProperty({ id: 0, name: "" });
        setSelectedPropertyPart({ id: 0, name: "" });
        setError("");
        setEmailError("");
        onClose();
    }

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const handleEmailChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setEmail(value);

        if (!validateEmail(value)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    if (!isOpen) return null;

    return (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[100000] font-inter pt-24">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-[50rem]">
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

                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Add Tenant</h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}

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
                            onChange={handleEmailChange}
                            className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                        />
                        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                    </div>
                </div>
                <div className='flex space-x-4'>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Contact</label>
                        <input
                            type="number"
                            // placeholder="Location"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                        />
                    </div>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Property Name</label>
                        <select
                            value={selectedProperty.id}
                            onChange={(e) => {
                                const selectedId = Number(e.target.value);
                                const selectedProperty = properties.find(p => p.id === selectedId);
                                if (selectedProperty) {
                                    setSelectedProperty({ id: selectedProperty.id, name: selectedProperty.name });
                                }
                                fetchPropertyPartsByProperty(selectedId)
                            }}
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                        >
                            <option value="0">Select a property</option>
                            {properties.map((property) => (
                                <option key={property.id} value={property.id}>
                                    {property.name}
                                </option>
                            ))}
                        </select>

                    </div>
                </div>
                <div className='flex space-x-4'>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Property Part Name</label>
                        <select
                            value={selectedPropertyPart.id}
                            onChange={(e) => {
                                const selectedId = Number(e.target.value);
                                const selectedPropertyPart = propertyParts.find(p => p.id === selectedId);
                                if (selectedPropertyPart) {
                                    setSelectedPropertyPart({ id: selectedPropertyPart.id, name: selectedPropertyPart.part_name });
                                }
                            }}
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg">
                            <option value="0">Select a unit</option>
                            {propertyParts.map((part) => (
                                <option key={part.id} value={part.id}>
                                    {part.part_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='flex-1'>
                    </div>
                </div>

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

export default AddTenantModal;
