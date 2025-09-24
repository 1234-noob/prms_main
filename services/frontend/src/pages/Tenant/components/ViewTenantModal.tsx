import { useState, useEffect } from "react";
import { getTenantById, updateTenant } from "../core/_requests";
import DatePicker from "react-datepicker";
import { getAllProperties } from "../../Properties/core/_requests";
import { Property } from "../../Properties/core/_models";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    tenantId: number;
}

const ViewDetailsModal: React.FC<ModalProps> = ({ isOpen, onClose, tenantId }) => {
    const [tenantName, setTenantName] = useState("");
    const [properties, setProperties] = useState<Property[]>([]);
    const [propertyId, setPropertyId] = useState<number>(0);
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [rentAmount, setRentAmount] = useState<string>("");
    const [rentError, setRentError] = useState('');
    const [tdsApplicable, setTdsApplicable] = useState<boolean>(true);
    const [contractStartDate, setContractStartDate] = useState<Date | null>(null);
    const [contractEndDate, setContractEndDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [propertyName, setPropertyName] = useState("");
    const [propertyPartName, setPropertyPartName] = useState("");
    const [error, setError] = useState("");
    const [tenant, setTenant] = useState<any>(null);

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
            setPropertyName(data.property_name);
            setPropertyPartName(data.property_part_name);
            setContact(data.contact);
            setEmail(data.email);
            setRentAmount(data.rent_amount);
            setTdsApplicable(data.tds_applicable);
            setContractStartDate(data.contract_start_date);
            setContractEndDate(data.contract_end_date);
        } catch (err) {
            setError("Failed to fetch tenant.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError("");
        setRentError("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-[50rem]">
                <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={handleClose}>
                    ✖
                </button>

                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Tenant Details</h2>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-gray-500">Tenant Name</label>
                        <div className="text-base font-medium text-gray-800 border-b pb-1">{tenantName}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">Email</label>
                        <div className="text-base font-medium text-gray-800 border-b pb-1">{email}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">Contact</label>
                        <div className="text-base font-medium text-gray-800 border-b pb-1">{contact}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">Property Name</label>
                        <div className="text-base font-medium text-gray-800 border-b pb-1">
                            {propertyName}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">Contract Start Date</label>
                        <div className="text-base font-medium text-gray-800 border-b pb-1">
                            {contractStartDate ? contractStartDate.toString() : '—'}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">Contract End Date</label>
                        <div className="text-base font-medium text-gray-800 border-b pb-1">
                            {contractEndDate ? contractEndDate.toString() : '—'}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500">Monthly Rent Amount</label>
                        <div className="text-base font-medium text-gray-800 border-b pb-1">₹ {rentAmount}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">TDS Applicable?</label>
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${tdsApplicable
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {tdsApplicable ? "Yes" : "No"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewDetailsModal;
