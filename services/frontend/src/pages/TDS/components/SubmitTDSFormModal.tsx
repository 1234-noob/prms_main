import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Property } from "../../Properties/core/_models";
import { Unit } from "../../PropertyParts/core/_models";
import { getAllProperties } from "../../Properties/core/_requests";
import { getPropertyPartByPropertyId } from "../../Tenant/core/_requests";
import { submitTDS } from "../core/_requests";
import { toast } from "react-toastify";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SubmitTDSFormModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [propertyParts, setPropertyParts] = useState<Unit[]>([]);
    const [tdsAmount, setTdsAmount] = useState<string>("");
    const [challanNumber, setChallanNumber] = useState<string>("");
    const [tdsReferenceNo, setTdsReferenceNo] = useState<string>("");
    const [tdsAmountError, setTdsAmountError] = useState('');
    const [tdsApplicable, setTdsApplicable] = useState<boolean>(true);
    const [submittedDate, setSubmittedDate] = useState<Date | null>(null);
    const [contractEndDate, setContractEndDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dateError, setDateError] = useState('');
    const [challanError, setChallanError] = useState('');
    const [tdsReferenceNoError, setTdsReferenceNoError] = useState('');
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [selectedOrganization, setSelectedOrganization] = useState<{ id: number; name: string }>({ id: 0, name: "" });
    const [selectedTenant, setSelectedTenant] = useState<{ id: number; name: string }>({ id: 0, name: "" });
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
        setLoading(true);
        setError("");

        try {
            if (!receiptFile) {
                setError("Please upload the challan receipt.");
                setLoading(false);
                return;
            }

            const SubmittedDate = new Date(submittedDate!.toLocaleDateString());

            const response = await submitTDS({
                tenant_id: 6,
                tenant_name: "Vikrant Sharma",
                organization_id: 1,
                organization_name: "MahaRealty Group",
                property_id: 3,
                property_name:"Green Valley Residency",
                property_part_id: 4,
                property_part_name: "Unit A",
                // property_id: selectedProperty.id,
                // property_name: selectedProperty.name,
                // property_part_id: selectedPropertyPart.id,
                // property_part_name: selectedPropertyPart.name,
                tds_amount: tdsAmount ? Number(tdsAmount) : 0,
                date_submitted: SubmittedDate,
                challan_number: challanNumber,
                tds_reference_number: tdsReferenceNo,
                receipt: receiptFile, // ✅ use file from state
            });

            toast.success("TDS form submitted successfully");
            console.log(response.data);

            handleClose();
        } catch (error) {
            console.error("Error submitting tds:", error);
            setError("Failed to submit tds");
        } finally {
            setLoading(false);
        }
    };


    const handleClose = () => {
        setError("");
        setTdsAmount("");
        setSubmittedDate(null);
        setContractEndDate(null);
        setTdsApplicable(true);
        setTdsAmountError("");
        setChallanError("");
        setTdsReferenceNoError("");
        setChallanNumber("");
        setTdsReferenceNo("");
        onClose();
    }

    const handleTdsAmountChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setTdsAmount(value);

        if (value === '' || parseFloat(value) <= 0) {
            setTdsAmountError('Please enter a valid rent amount greater than 0');
        } else {
            setTdsAmountError('');
        }
    };

    const handleChallanNoChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setChallanNumber(value);
        const challanRegex = /^\d{7}\/\d{4}-\d{2}-\d{2}\/\d{5}$/;
        const isValidChallan = challanRegex.test(value);
        if (!isValidChallan) {
            setChallanError("Please enter a valid challan number in the format: BSRCode/YYYY-MM-DD/ChallanSerial");
        }
        else {
            setChallanError("");
        }
    }
    const handleTdsReferenceNoChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        setTdsReferenceNo(value);
        const tdsRefRegex = /^[A-Z0-9]{15}$/;
        const isValidTdsReference = tdsRefRegex.test(value);
        if (!isValidTdsReference) {
            setTdsReferenceNoError("TDS Reference Number must be 15 characters long and contain only uppercase letters and digits.");
        } else {
            setTdsReferenceNoError("");
        }

    }


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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

                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Submit TDS Form</h2>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className='flex space-x-4'>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Property Name</label>
                        <input
                            type='text'
                            value="Green Valley Residency"
                            disabled
                            // onChange={(e) => setTdsAmount(e.target.value)}
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg" />
                        {/* <select
                            value={selectedProperty.id}
                            onChange={(e) => {
                                const selectedId = Number(e.target.value);
                                const selectedProperty = properties.find(p => p.id === selectedId);
                                if (selectedProperty) {
                                    setSelectedProperty({ id: selectedProperty.id, name: selectedProperty.name });
                                }
                                fetchPropertyPartsByProperty(selectedId)
                                setSelectedPropertyPart({ id: 0, name: "" })
                            }}
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                        >
                            <option value="0">Select a property</option>
                            {properties.map((property) => (
                                <option key={property.id} value={property.id}>
                                    {property.name}
                                </option>
                            ))}
                        </select> */}

                    </div>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Property Part Name</label>
                        <input
                            type='text'
                            value="Unit A"
                            disabled
                            // onChange={(e) => setTdsAmount(e.target.value)}
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg" />
                        {/* <select
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
                        </select> */}
                    </div>
                </div>
                <div className='flex space-x-4'>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>TDS Amount</label>
                        <input
                            type='number'
                            value="36000"
                            disabled
                            onChange={(e) => setTdsAmount(e.target.value)}
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg" />
                    </div>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Date Submitted</label>
                        <DatePicker
                            selected={submittedDate}
                            onChange={(date) => setSubmittedDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                        />
                    </div>
                </div>
                <div className='flex space-x-4'>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Challan Number</label>
                        <input
                            type='text'
                            value={challanNumber}
                            onChange={handleChallanNoChange}
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                        />
                        {challanError && <p className="text-red-500 text-sm">{challanError}</p>}
                    </div>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>TDS Reference Number</label>
                        <input
                            type='text'
                            value={tdsReferenceNo}
                            onChange={handleTdsReferenceNoChange}
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                        />
                        {tdsReferenceNoError && <p className="text-red-500 text-sm">{tdsReferenceNoError}</p>}
                    </div>
                </div>
                <div className='flex space-x-4'>
                    <div className='flex-1'>
                        <label className='text-slate-900 text-md block mb-1'>Upload Challan receipt</label>
                        <input
                            type='file'
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setReceiptFile(e.target.files[0]);
                                }
                            }}
                            className="w-full px-2 py-1 mb-4 border border-slate-300 rounded-lg"
                        />
                    </div>
                    <div className='flex-1'>

                    </div>
                </div>
                <div className="flex justify-end mt-2">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmitTDSFormModal;
