import React, { useState, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { toast } from "react-toastify";
import { createSingleInvoice, uploadBulkInvoices, ApiResponseError } from '../core/_requests';
import { SingleInvoicePayload, InvoiceStatus, InvoiceFrequency } from '../core/_model';
import { getAllContracts } from '../../RentalAgreements/core/_requests'; 
import { Contract } from '../../RentalAgreements/core/_models'; 
import { getAllTenants } from '../../Tenant/core/_requests'; 
import { Tenant } from '../../Tenant/core/_models'; 

interface CreateInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInvoiceAdded: () => void;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ isOpen, onClose, onInvoiceAdded }) => {
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [tenantName, setTenantName] = useState('');
    const [invoiceAmount, setInvoiceAmount] = useState('');
    const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus | ''>('');

    const [contractId, setContractId] = useState<string>(''); 
    const [propertyPartId, setPropertyPartId] = useState<string>(''); 
    const [merchant, setMerchant] = useState('');
    const [frequency, setFrequency] = useState<InvoiceFrequency | ''>('');
    const [externalId, setExternalId] = useState('');

    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [alias, setAlias] = useState('');
    const [aliasError, setAliasError] = useState<string | null>(null);

    const [contractIdError, setContractIdError] = useState<string | null>(null);
    const [propertyPartIdError, setPropertyPartIdError] = useState<string | null>(null);
    const [invoiceAmountError, setInvoiceAmountError] = useState<string | null>(null);
    const [dueDateError, setDueDateError] = useState<string | null>(null);
    const [tenantNameError, setTenantNameError] = useState<string | null>(null);
    const [merchantError, setMerchantError] = useState<string | null>(null);
    const [frequencyError, setFrequencyError] = useState<string | null>(null);
    const [externalIdError, setExternalIdError] = useState<string | null>(null);
    const [invoiceStatusError, setInvoiceStatusError] = useState<string | null>(null);

    const [type, setType] = useState<'single' | 'bulk'>('single');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [contracts, setContracts] = useState<Contract[]>([]); 
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null); 
    const [tenants, setTenants] = useState<Tenant[]>([]); 
    const [associatedTenants, setAssociatedTenants] = useState<Tenant[]>([]); 

    const dueDateRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    const contractsData = await getAllContracts();
                    setContracts(contractsData);

                    const tenantsData = await getAllTenants();
                    setTenants(tenantsData);
                } catch (err) {
                    console.error("Error fetching data:", err);
                    toast.error("Failed to load necessary data (contracts/tenants).");
                }
            };
            fetchData();
        }
    }, [isOpen]);

    useEffect(() => {
        if (selectedContract) {
            setPropertyPartId(String(selectedContract.property_part_id));
            if (propertyPartIdError) setPropertyPartIdError(null);

            const filteredTenants = tenants.filter(
                tenant => tenant.property_part_id === selectedContract.property_part_id
            );
            setAssociatedTenants(filteredTenants);

            if (filteredTenants.length === 1) {
                setTenantName(filteredTenants[0].name);
            } else {
                setTenantName('');
            }
            if (tenantNameError) setTenantNameError(null);

            
            setInvoiceAmount(String(selectedContract.rent_amount));
            if (invoiceAmountError) setInvoiceAmountError(null);

            if (selectedContract.end_date) { 
                setDueDate(new Date(selectedContract.end_date));
            } else {
                setDueDate(null);
            }
            if (dueDateError) setDueDateError(null);

        } else {
            setPropertyPartId('');
            setAssociatedTenants([]);
            setTenantName('');
            setInvoiceAmount(''); 
            setDueDate(null); 
        }
    }, [selectedContract, tenants]);

    useEffect(() => {
        if (!isOpen) return;

        let datePickerInstance: flatpickr.Instance | undefined;

        if (dueDateRef.current) {
            datePickerInstance = flatpickr(dueDateRef.current, {
                dateFormat: "Y-m-d",
                onChange: (selectedDates) => {
                    setDueDate(selectedDates[0] || null);
                    if (dueDateError) setDueDateError(null);
                },
                defaultDate: dueDate || undefined,
                onOpen: (selectedDates, dateStr, instance) => {
                    if (instance.calendarContainer) {
                        instance.calendarContainer.style.zIndex = '100002';
                    }
                },
            });
        }

        return () => {
            datePickerInstance?.destroy();
        };
    }, [isOpen, dueDate, dueDateError]);

    if (!isOpen) return null;

    const formatDate = (date: Date | null): string => {
        if (!date) return '';
        const d = date;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const handleContractChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(e.target.value);
        setContractId(e.target.value); 

        const foundContract = contracts.find(c => c.id === selectedId);
        setSelectedContract(foundContract || null);

        if (contractIdError) setContractIdError(null);
    };

    const handlePropertyPartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPropertyPartId(e.target.value);
        if (propertyPartIdError) setPropertyPartIdError(null);

        const selectedPropertyPartId = Number(e.target.value);
        const filteredTenants = tenants.filter(
            tenant => tenant.property_part_id === selectedPropertyPartId
        );
        setAssociatedTenants(filteredTenants);

        if (filteredTenants.length === 1) {
            setTenantName(filteredTenants[0].name);
        } else {
            setTenantName('');
        }
        if (tenantNameError) setTenantNameError(null);
    };

    const handleTenantNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTenantName(e.target.value);
        if (tenantNameError) setTenantNameError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        setAliasError(null);
        setContractIdError(null);
        setPropertyPartIdError(null);
        setInvoiceAmountError(null);
        setDueDateError(null);
        setTenantNameError(null);
        setMerchantError(null);
        setFrequencyError(null);
        setExternalIdError(null);
        setInvoiceStatusError(null);

        if (type === 'single') {
            let isValid = true;

            if (!contractId || isNaN(parseInt(contractId))) {
                setContractIdError('Contract ID is required.');
                isValid = false;
            }
            if (!propertyPartId || isNaN(parseInt(propertyPartId))) {
                setPropertyPartIdError('Property Part ID is required.');
                isValid = false;
            }
            if (!invoiceAmount || parseFloat(invoiceAmount) <= 0 || isNaN(parseFloat(invoiceAmount))) {
                setInvoiceAmountError('Invoice Amount is required.');
                isValid = false;
            }
            if (!dueDate) {
                setDueDateError('Due Date is required.');
                isValid = false;
            }
            if (!tenantName.trim()) {
                setTenantNameError('Tenant Name is required.');
                isValid = false;
            }
            if (!merchant.trim()) {
                setMerchantError('Merchant is required.');
                isValid = false;
            }
            if (!frequency.trim()) {
                setFrequencyError('Frequency is required.');
                isValid = false;
            }
            if (!externalId.trim()) {
                setExternalIdError('External ID is required.');
                isValid = false;
            }
            if (!invoiceStatus.trim()) {
                setInvoiceStatusError('Invoice Status is required.');
                isValid = false;
            }

            if (!isValid) {
                setLoading(false);
                toast.error("Please fill in all required fields correctly.");
                return;
            }

            const payload: SingleInvoicePayload = {
                contract_id: parseInt(contractId),
                property_part_id: parseInt(propertyPartId),
                amount: parseFloat(invoiceAmount),
                due_date: formatDate(dueDate),
                status: invoiceStatus.toLowerCase() as InvoiceStatus,
                tenant_name: tenantName,
                merchant: merchant,
                frequency: frequency.toLowerCase() as InvoiceFrequency,
                external_id: externalId
            };

            try {
                const result = await createSingleInvoice(payload);
                toast.success('Invoice created successfully!');
                onInvoiceAdded();
                handleClose(); 
            } catch (error: any) {
                console.error('Error creating invoice:', error);
                if (error instanceof ApiResponseError) {
                    setMessage({ type: 'error', text: `Error: ${error.message}` });
                    toast.error(`Error creating invoice: ${error.message}`);
                } else {
                    setMessage({ type: 'error', text: `An unexpected error occurred: ${error.message}` });
                    toast.error(`An unexpected error occurred: ${error.message}`);
                }
            } finally {
                setLoading(false);
            }
        } else {
            if (!excelFile) {
                setMessage({ type: 'error', text: 'Please select an Excel file for bulk upload.' });
                setLoading(false);
                return;
            }
            if (!alias.trim()) {
                setAliasError('Alias name is required for bulk upload.');
                setLoading(false);
                return;
            }

            try {
                const result = await uploadBulkInvoices(excelFile, alias);
                toast.success('Invoices uploaded successfully!');
                onInvoiceAdded();
                setExcelFile(null);
                setAlias('');
                setTimeout(() => onClose(), 1500);
            } catch (error: any) {
                console.error('Error uploading invoices in bulk:', error);
                if (error instanceof ApiResponseError) {
                    setMessage({ type: 'error', text: `Error: ${error.message}` });
                    toast.error(`Error uploading invoices: ${error.message}`);
                } else {
                    setMessage({ type: 'error', text: `An unexpected error occurred: ${error.message}` });
                    toast.error(`An unexpected error occurred: ${error.message}`);
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

            if (allowedTypes.includes(file.type)) {
                setExcelFile(file);
                setMessage(null);
            } else {
                setExcelFile(null);
                setMessage({ type: 'error', text: 'Only .xlsx or .xls files are allowed for bulk upload.' });
                e.target.value = '';
            }
        } else {
            setExcelFile(null);
            setMessage(null);
        }
    };

    const handleClose = () => {
        setDueDate(null);
        setTenantName('');
        setInvoiceAmount('');
        setInvoiceStatus('');
        setContractId('');
        setPropertyPartId('');
        setMerchant('');
        setFrequency('');
        setExternalId('');
        setExcelFile(null);
        setAlias('');
        setAliasError(null);
        setContractIdError(null);
        setPropertyPartIdError(null);
        setInvoiceAmountError(null);
        setDueDateError(null);
        setTenantNameError(null);
        setMerchantError(null);
        setFrequencyError(null);
        setExternalIdError(null);
        setInvoiceStatusError(null);
        setMessage(null);
        setLoading(false);
        setContracts([]);
        setTenants([]);
        setAssociatedTenants([]);
        setSelectedContract(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] font-inter">

            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl pt-8 px-6 pb-6 relative max-h-[85vh] overflow-y-auto">
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close modal"
                >
                    &#10005;
                </button>

                <h2 className="text-xl font-semibold mb-4">Create Invoice</h2>

                <div className="flex gap-4 mb-6">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={type === 'single'}
                            onChange={() => {
                                setType('single');
                                setMessage(null);
                                setExcelFile(null);
                                setAlias('');
                                setAliasError(null);
                                setContractIdError(null);
                                setPropertyPartIdError(null);
                                setInvoiceAmountError(null);
                                setDueDateError(null);
                                setTenantNameError(null);
                                setMerchantError(null);
                                setFrequencyError(null);
                                setExternalIdError(null);
                                setInvoiceStatusError(null);
                            }}
                            className="accent-blue-600 rounded-full"
                        />
                        Single
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={type === 'bulk'}
                            onChange={() => {
                                setType('bulk');
                                setMessage(null);
                                setAliasError(null);
                                setContractIdError(null);
                                setPropertyPartIdError(null);
                                setInvoiceAmountError(null);
                                setDueDateError(null);
                                setTenantNameError(null);
                                setMerchantError(null);
                                setFrequencyError(null);
                                setExternalIdError(null);
                                setInvoiceStatusError(null);
                            }}
                            className="accent-blue-600 rounded-full"
                        />
                        Bulk
                    </label>
                </div>

                {message && (
                    <div className={`p-3 mb-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                {type === 'single' && (
                    <div className="mt-4 border border-gray-300 rounded-md p-4 bg-gray-50">
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contract ID <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={contractId}
                                    onChange={handleContractChange}
                                    className={`w-full border rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500 ${contractIdError ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select Contract ID</option>
                                    {contracts.map((contract) => (
                                        <option key={contract.id} value={contract.id}>
                                            {contract.id} - {contract.property_name}
                                        </option>
                                    ))}
                                </select>
                                {contractIdError && <p className="text-red-500 text-xs mt-1">{contractIdError}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Property Part <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={propertyPartId}
                                    onChange={handlePropertyPartChange}
                                    className={`w-full border rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500 ${propertyPartIdError ? 'border-red-500' : 'border-gray-300'}`}
                                    disabled={!selectedContract} 
                                >
                                    <option value="">Select Property Part</option>
                                    {selectedContract && (
                                        <option key={selectedContract.property_part_id} value={selectedContract.property_part_id}>
                                            {selectedContract.property_part_name}
                                        </option>
                                    )}
                                </select>
                                {propertyPartIdError && <p className="text-red-500 text-xs mt-1">{propertyPartIdError}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Due Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    ref={dueDateRef}
                                    placeholder="Select Due Date"
                                    value={dueDate ? formatDate(dueDate) : ''} 
                                    className={`w-full border rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500 ${dueDateError ? 'border-red-500' : 'border-gray-300'}`}
                                    readOnly={!!selectedContract} 
                                />
                                {dueDateError && <p className="text-red-500 text-xs mt-1">{dueDateError}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Invoice Amount <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={invoiceAmount}
                                    onChange={(e) => {
                                        setInvoiceAmount(e.target.value);
                                        if (invoiceAmountError) setInvoiceAmountError(null);
                                    }}
                                    className={`w-full border rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500 ${invoiceAmountError ? 'border-red-500' : 'border-gray-300'}`}
                                    // Removed readOnly={!!selectedContract} to make it editable
                                />
                                {invoiceAmountError && <p className="text-red-500 text-xs mt-1">{invoiceAmountError}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tenant Name <span className="text-red-500">*</span>
                                </label>
                                {associatedTenants.length <= 1 ? ( 
                                    <input
                                        type="text"
                                        value={associatedTenants.length === 1 ? tenantName : ''} 
                                        placeholder={associatedTenants.length === 0 && selectedContract ? "No tenants found for this property part" : "Select Contract and Property Part"}
                                        className={`w-full border rounded-md px-2 py-1 bg-gray-100 cursor-not-allowed ${tenantNameError ? 'border-red-500' : 'border-gray-300'}`}
                                        disabled
                                        readOnly
                                    />
                                ) : ( 
                                    <select
                                        value={tenantName}
                                        onChange={handleTenantNameChange}
                                        className={`w-full border rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500 ${tenantNameError ? 'border-red-500' : 'border-gray-300'}`}
                                        disabled={!selectedContract || associatedTenants.length === 0} 
                                    >
                                        <option value="">Select Tenant</option>
                                        {associatedTenants.map((tenant) => (
                                            <option key={tenant.id} value={tenant.name}>
                                                {tenant.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {tenantNameError && <p className="text-red-500 text-xs mt-1">{tenantNameError}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Merchant <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={merchant}
                                    onChange={(e) => {
                                        setMerchant(e.target.value);
                                        if (merchantError) setMerchantError(null);
                                    }}
                                    className={`w-full border rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500 ${merchantError ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {merchantError && <p className="text-red-500 text-xs mt-1">{merchantError}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Frequency <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={frequency}
                                    onChange={(e) => {
                                        setFrequency(e.target.value as InvoiceFrequency | '');
                                        if (frequencyError) setFrequencyError(null);
                                    }}
                                    className={`w-full border rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500 ${frequencyError ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select Frequency</option>
                                    <option value="one-time">One Time</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="annually">Annually</option>
                                </select>
                                {frequencyError && <p className="text-red-500 text-xs mt-1">{frequencyError}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    External ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={externalId}
                                    onChange={(e) => {
                                        setExternalId(e.target.value);
                                        if (externalIdError) setExternalIdError(null);
                                    }}
                                    className={`w-full border rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500 ${externalIdError ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {externalIdError && <p className="text-red-500 text-xs mt-1">{externalIdError}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Invoice Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={invoiceStatus}
                                    onChange={(e) => {
                                        setInvoiceStatus(e.target.value as InvoiceStatus | '');
                                        if (invoiceStatusError) setInvoiceStatusError(null);
                                    }}
                                    className={`w-full border rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500 ${invoiceStatusError ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                                {invoiceStatusError && <p className="text-red-500 text-xs mt-1">{invoiceStatusError}</p>}
                            </div>
                            <div className="md:col-span-2 mt-2 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all"
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {type === 'bulk' && (
                    <div className="mt-4 border border-gray-300 rounded-md p-4 bg-gray-50">
                        <div className="mb-4">
                            <label htmlFor="excel-file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Excel File <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="excel-file-upload"
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                disabled={loading}
                            />
                            <p className="text-sm text-gray-500 mt-1">Only .xlsx or .xls files are supported.</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                File Alias Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={alias}
                                onChange={(e) => {
                                    setAlias(e.target.value);
                                    if (aliasError) setAliasError(null);
                                }}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter alias for this bulk upload"
                                disabled={loading}
                            />
                            {aliasError && <p className="text-red-500 text-sm mt-1">{aliasError}</p>}
                            <p className="text-sm text-gray-500 mt-1">Provide a name for this bulk upload, e.g., "Invoices_Batch1".</p>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all"
                                disabled={loading || !excelFile || !!aliasError}
                            >
                                {loading ? 'Uploading...' : 'Upload Bulk Invoices'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateInvoiceModal;
