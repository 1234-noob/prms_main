import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { updateContract } from "../core/_requests";

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
    const [rentAmount, setRentAmount] = useState<string>("");
    const [rentError, setRentError] = useState('');
    const [tdsApplicable, setTdsApplicable] = useState<boolean>(true);
    const [contractStartDate, setContractStartDate] = useState<Date | null>(null);
    const [contractEndDate, setContractEndDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [propertyName, setPropertyName] = useState("");
    const [error, setError] = useState("");
    const [tenant, setTenant] = useState<any>(null);

    // useEffect(() => {
    //     if (tenantId) {
    //         fetchTenant();
    //     }
    // }, [tenantId]);

    // const fetchTenant = async () => {
    //     try {
    //         setLoading(true);
    //         const data = await getTenantById(tenantId);
    //         setTenant(data);
    //         setTenantName(data.name);
    //         setContact(data.contact);
    //         setEmail(data.email);
    //         setRentAmount(data.rent_amount);
    //         setTdsApplicable(data.tds_applicable);
    //         setContractStartDate(data.contract_start_date);
    //         setContractEndDate(data.contract_end_date);
    //     } catch (err) {
    //         setError("Failed to fetch property part.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleUpdate = async () => {
        if (!tenantName) {
            setError("Please fill all fields.");
            return;
        }

        try {
            const startDate = contractStartDate ? new Date(contractStartDate).toISOString().split("T")[0] : null;
            const endDate = contractEndDate ? new Date(contractEndDate).toISOString().split("T")[0] : null;

            setLoading(true);
            await updateContract(tenantId, {
                ...tenant,
                name: tenantName,
                contact: contact,
                email: email,
                rent_amount: rentAmount ? Number(rentAmount) : 0, // or handle default/fallback
                tds_applicable: tdsApplicable,
                contract_start_date: startDate,
                contract_end_date: endDate,
            });
            onTenantUpdated();
            onClose();
        } catch (err) {
            setError("Failed to update property part.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError("");
        setRentError("");
        onClose();
    };

    const handleRentChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setRentAmount(value);

        if (value === '' || parseFloat(value) <= 0) {
            setRentError('Please enter a valid rent amount greater than 0');
        } else {
            setRentError('');
        }
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
                            type="number"
                            // placeholder="Location"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                        />
                    </div>
                    {/* <div className='flex-1'>
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
                                    </div> */}
                </div>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="text-slate-900 text-md block mb-1">Contract Start Date</label>
                        <DatePicker
                            selected={contractStartDate}
                            onChange={(date) => setContractStartDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-slate-900 text-md block mb-1">Contract End Date</label>
                        <DatePicker
                            selected={contractEndDate}
                            onChange={(date) => setContractEndDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                        />
                    </div>
                </div>
                <div className='flex space-x-4'>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Monthly Rent Amount</label>
                        <input
                            type="number"
                            // placeholder="Location"
                            value={rentAmount}
                            onChange={handleRentChange}
                            className="w-full px-2 py-1 mb-4 border-slate-300 rounded-lg"
                        />
                                                {rentError && <p className="text-red-500 text-sm">{rentError}</p>}
                    </div>
                    <div className='flex-1'>
                        <label className='text-slate-900 block mb-2'>TDS Applicable?</label>
                        <label className="mr-2 mb-5 cursor-pointer">
                            <input
                                type="radio"
                                name="status"
                                value="Yes"
                                checked={tdsApplicable === true}
                                onChange={() => setTdsApplicable(true)}
                                className="hidden"
                            />
                            <span
                                className={`px-4 py-1 text-sm rounded-full ${tdsApplicable === true
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                    }`}
                            >
                                {tdsApplicable === true && "✔ "} Yes
                            </span>
                        </label>

                        <label className="mt-2 cursor-pointer">
                            <input
                                type="radio"
                                name="status"
                                value="No"
                                checked={tdsApplicable === false}
                                onChange={() => setTdsApplicable(false)}
                                className="hidden"
                            />
                            <span
                                className={`px-4 py-1 text-sm rounded-full ${tdsApplicable === false
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {tdsApplicable === false && "✔ "} No
                            </span>
                        </label>
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
