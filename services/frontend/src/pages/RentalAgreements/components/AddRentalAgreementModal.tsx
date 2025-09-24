import { useEffect, useState, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { toast } from "react-toastify";
import { createContract } from "../core/_requests";
import { Property } from "../../Properties/core/_models";
import { Unit } from "../../PropertyParts/core/_models";
import { getAllProperties } from "../../Properties/core/_requests";
import { getPropertyPartByPropertyId } from "../../Tenant/core/_requests";


interface ExtendedContractPayload {
    property_id: number;
    property_part_id?: number;
    rent_amount: number;
    start_date: Date;
    end_date: Date;
    tds_applicable: boolean;
    property_name: string;
    property_part_name: string;
    organization_id: number;
    organization_name: string;
    payment_due_date: Date | null;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContractAdded: () => void;
}

const AddRentalAgreementModal: React.FC<ModalProps> = ({ isOpen, onClose, onContractAdded }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [propertyParts, setPropertyParts] = useState<Unit[]>([]);
    const [rentAmount, setRentAmount] = useState<string>("");
    const [rentError, setRentError] = useState('');
    const [tdsApplicable, setTdsApplicable] = useState<boolean>(true);
    const [contractStartDate, setContractStartDate] = useState<Date | null>(null);
    const [contractEndDate, setContractEndDate] = useState<Date | null>(null);
    const [paymentDueDate, setPaymentDueDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dateError, setDateError] = useState('');
    const [selectedProperty, setSelectedProperty] = useState<{ id: number; name: string }>({ id: 0, name: "" });
    const [selectedPropertyPart, setSelectedPropertyPart] = useState<{ id: number; name: string }>({ id: 0, name: "" });


    const contractStartDateRef = useRef<HTMLInputElement>(null);
    const contractEndDateRef = useRef<HTMLInputElement>(null);
    const paymentDueDateRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        fetchProperties();
    }, []);


    useEffect(() => {
        if (!isOpen) return; // Ensure modal is open

        let startDatePicker: flatpickr.Instance | undefined;
        let endDatePicker: flatpickr.Instance | undefined;
        let paymentDatePicker: flatpickr.Instance | undefined;


        if (contractStartDateRef.current) {
            startDatePicker = flatpickr(contractStartDateRef.current, {
                dateFormat: "Y-m-d",
                onChange: (selectedDates) => {
                    const date = selectedDates[0] || null;
                    setContractStartDate(date);

                    if (endDatePicker) {
                        endDatePicker.set("minDate", date);
                        if (contractEndDate && date && contractEndDate < date) {
                            setContractEndDate(null);
                            endDatePicker.clear();
                        }
                    }
                    setDateError('');
                },
                defaultDate: contractStartDate || undefined,
                onOpen: (selectedDates, dateStr, instance) => {
                    if (instance.calendarContainer) {
                        instance.calendarContainer.style.zIndex = '100002'; // Ensure it's above the modal
                    }
                },
            });
        }


        if (contractEndDateRef.current) {
            endDatePicker = flatpickr(contractEndDateRef.current, {
                dateFormat: "Y-m-d",
                onChange: (selectedDates) => {
                    const date = selectedDates[0] || null;
                    if (contractStartDate && date && date < contractStartDate) {
                        setDateError('Contract end date cannot be before start date.');
                        setContractEndDate(null);
                        endDatePicker?.clear();
                    } else {
                        setContractEndDate(date);
                        setDateError('');
                    }
                },
                minDate: contractStartDate || undefined,
                defaultDate: contractEndDate || undefined,
                onOpen: (selectedDates, dateStr, instance) => {
                    if (instance.calendarContainer) {
                        instance.calendarContainer.style.zIndex = '100002'; // Ensure it's above the modal
                    }
                },
            });
        }

        if (paymentDueDateRef.current) {
            paymentDatePicker = flatpickr(paymentDueDateRef.current, {
                dateFormat: "Y-m-d",
                onChange: (selectedDates) => {
                    setPaymentDueDate(selectedDates[0] || null);
                },
                defaultDate: paymentDueDate || undefined,
                onOpen: (selectedDates, dateStr, instance) => {
                    if (instance.calendarContainer) {
                        instance.calendarContainer.style.zIndex = '100002'; // Ensure it's above the modal
                    }
                },
            });
        }


        return () => {
            startDatePicker?.destroy();
            endDatePicker?.destroy();
            paymentDatePicker?.destroy();
        };
    }, [isOpen, contractStartDate, contractEndDate, paymentDueDate]);

    const fetchProperties = async () => {
        try {
            const data = await getAllProperties();
            console.log("Fetched properties", data);
            setProperties(data);
        } catch (err) {
            console.error("Error fetching properties", err);
            setError("Failed to fetch properties");
        } finally {
            setLoading(false);
        }
    }

    const fetchPropertyPartsByProperty = async (propertyId: number) => {
        try {
            const data = await getPropertyPartByPropertyId(propertyId);
            setPropertyParts(data);
            setSelectedPropertyPart({ id: 0, name: "" });
        } catch (err) {
            setError("Failed to fetch property parts");
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async () => {
        setLoading(true);
        setError("");


        if (!selectedProperty.id || !selectedPropertyPart.id || !rentAmount || parseFloat(rentAmount) <= 0 || !contractStartDate || !contractEndDate || !paymentDueDate) {
            setError("Please fill in all required fields and ensure rent amount is valid.");
            setLoading(false);
            return;
        }

        if (contractEndDate < contractStartDate) {
            setDateError('Contract end date cannot be before start date.');
            setLoading(false);
            return;
        }

        try {

            const payload: ExtendedContractPayload = {
                property_id: selectedProperty.id,
                property_part_id: selectedPropertyPart.id,
                rent_amount: Number(rentAmount),
                start_date: contractStartDate,
                end_date: contractEndDate,
                tds_applicable: tdsApplicable,
                property_name: selectedProperty.name,
                property_part_name: selectedPropertyPart.name,
                organization_id: 1,
                organization_name: "MahaRealty Group",
                payment_due_date: paymentDueDate,
            };

            const response = await createContract(payload);

            toast.success("Contract created successfully!");
            onContractAdded();
            handleClose();
        } catch (error) {
            console.error("Error creating contract:", error);
            setError("Failed to create contract. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError("");
        setRentAmount("");
        setContractStartDate(null);
        setContractEndDate(null);
        setPaymentDueDate(null);
        setTdsApplicable(true);
        setRentError("");
        setDateError('');
        setSelectedProperty({ id: 0, name: "" });
        setSelectedPropertyPart({ id: 0, name: "" });
        setPropertyParts([]);
        onClose();
    }

    const handleRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[100000] font-inter pt-24">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-[50rem] max-h-[90vh] overflow-y-auto">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={handleClose}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-xl font-semibold mb-4 border-b pb-4">Add Rental Agreement</h2>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div>
                        <label className='text-slate-900 text-md block mb-1'>Property Name</label>
                        <select
                            value={selectedProperty.id}
                            onChange={(e) => {
                                const selectedId = Number(e.target.value);
                                const foundProperty = properties.find(p => p.id === selectedId);
                                if (foundProperty) {
                                    setSelectedProperty({ id: foundProperty.id, name: foundProperty.name });
                                    fetchPropertyPartsByProperty(selectedId);
                                } else {
                                    setSelectedProperty({ id: 0, name: "" });
                                    setPropertyParts([]);
                                }
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="0">Select a property</option>
                            {properties.map((property) => (
                                <option key={property.id} value={property.id}>
                                    {property.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className='text-slate-900 text-md block mb-1'>Property Part Name</label>
                        <select
                            value={selectedPropertyPart.id}
                            onChange={(e) => {
                                const selectedId = Number(e.target.value);
                                const foundPropertyPart = propertyParts.find(p => p.id === selectedId);
                                if (foundPropertyPart) {
                                    setSelectedPropertyPart({ id: foundPropertyPart.id, name: foundPropertyPart.part_name });
                                } else {
                                    setSelectedPropertyPart({ id: 0, name: "" });
                                }
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={selectedProperty.id === 0}
                        >
                            <option value="0">Select a part</option>
                            {propertyParts.map((part) => (
                                <option key={part.id} value={part.id}>
                                    {part.part_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div>
                        <label className='text-slate-900 text-md block mb-1'>Monthly Rent Amount</label>
                        <input
                            type="number"
                            value={rentAmount}
                            onChange={handleRentChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg no-spinner focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 15000"
                        />
                        {rentError && <p className="text-red-500 text-sm mt-1">{rentError}</p>}
                    </div>
                    <div>
                        <label className='text-slate-900 text-md block mb-1'>TDS Applicable?</label>
                        <div className="flex gap-4 mt-2">
                            <button
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${tdsApplicable ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                                onClick={() => setTdsApplicable(true)}
                            >
                                Yes
                            </button>
                            <button
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${!tdsApplicable ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                                onClick={() => setTdsApplicable(false)}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div className="relative">
                        <label className='text-slate-900 text-md block mb-1'>Contract Start Date</label>
                        <input
                            type="text"
                            ref={contractStartDateRef}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Select start date"
                        />
                    </div>
                    <div className="relative">
                        <label className='text-slate-900 text-md block mb-1'>Contract End Date</label>
                        <input
                            type="text"
                            ref={contractEndDateRef}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Select end date"
                        />
                        {dateError && <p className="text-red-500 text-sm mt-1">{dateError}</p>}
                    </div>
                </div>

                {/* Payment Due Date */}
                <div className="mb-4">
                    <div className="relative">
                        <label className='text-slate-900 text-md block mb-1'>Payment Due Date</label>
                        <input
                            type="text"
                            ref={paymentDueDateRef}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Select payment due date"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-6 pt-4 border-t">
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || !!rentError || !!dateError || !selectedProperty.id || !selectedPropertyPart.id || !rentAmount || parseFloat(rentAmount) <= 0 || !contractStartDate || !contractEndDate || !paymentDueDate}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddRentalAgreementModal;
