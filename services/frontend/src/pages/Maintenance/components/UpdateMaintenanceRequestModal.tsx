import React, { FC, useEffect } from 'react';
import { MaintenanceRequest, UpdateMaintenanceRequestPayload } from '../core/_model';
import { Property } from '../../Properties/core/_models';
import { Unit } from '../../PropertyParts/core/_models';
import { Tenant } from '../../Tenant/core/_models';

interface UpdateMaintenanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: number, payload: UpdateMaintenanceRequestPayload) => Promise<void>;
    selectedRequest: MaintenanceRequest | null;
    properties: Property[];
    units: Unit[];
    tenants: Tenant[];
    availableUnits: Unit[];
    availableTenants: Tenant[];
    loading: boolean;
    selectedIssueType: string;
    setSelectedIssueType: (value: string) => void;
    otherIssueType: string;
    setOtherIssueType: (value: string) => void;
    unit: number | '';
    setUnit: (value: number | '') => void;
    property: number | '';
    setProperty: (value: number | '') => void;
    tenant: number | '';
    setTenant: (value: number | '') => void;
    description: string;
    setDescription: (value: string) => void;
    onPropertyChange: (propertyId: number) => Promise<void>;
    onUnitChange: (unitId: number) => void;
    issueTypeError: string | null;
    setIssueTypeError: (error: string | null) => void;
    otherIssueTypeError: string | null;
    setOtherIssueTypeError: (error: string | null) => void;
    unitError: string | null;
    setUnitError: (error: string | null) => void;
    propertyError: string | null;
    setPropertyError: (error: string | null) => void;
    tenantError: string | null;
    setTenantError: (error: string | null) => void;
    message: { type: 'success' | 'error' | 'info', text: string } | null;
}

const UpdateMaintenanceModal: FC<UpdateMaintenanceModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    selectedRequest,
    properties,
    availableUnits,
    availableTenants,
    loading,
    selectedIssueType,
    setSelectedIssueType,
    otherIssueType,
    setOtherIssueType,
    unit,
    setUnit,
    property,
    setProperty,
    tenant,
    setTenant,
    description,
    setDescription,
    onPropertyChange,
    onUnitChange,
    issueTypeError,
    setIssueTypeError,
    otherIssueTypeError,
    setOtherIssueTypeError,
    unitError,
    setUnitError,
    propertyError,
    setPropertyError,
    tenantError,
    setTenantError,
    message
}) => {
    const issueTypes = [
        { id: "Electrical", label: "Electrical" },
        { id: "Plumbing", label: "Plumbing" },
        { id: "HVAC", label: "HVAC" },
        { id: "General", label: "General" },
        { id: "Other", label: "Other (Specify in Comments)" },
    ];

    const validateForm = () => {
        let isValid = true;

        // Reset all errors
        setIssueTypeError(null);
        setOtherIssueTypeError(null);
        setUnitError(null);
        setPropertyError(null);
        setTenantError(null);

        if (!selectedIssueType) {
            setIssueTypeError('Issue type is required.');
            isValid = false;
        } else if (selectedIssueType === "Other" && !otherIssueType.trim()) {
            setOtherIssueTypeError('Please specify your issue type.');
            isValid = false;
        }

        if (unit === '' || unit === null || unit === undefined) {
            setUnitError('Unit is required.');
            isValid = false;
        }

        if (property === '' || property === null || property === undefined) {
            setPropertyError('Property is required.');
            isValid = false;
        }

        if (tenant === '' || tenant === null || tenant === undefined) {
            setTenantError('Tenant is required.');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;

        if (!validateForm()) {
            return;
        }

        const issueTypeToSubmit = selectedIssueType === "Other" ? otherIssueType : selectedIssueType;

        const payload: UpdateMaintenanceRequestPayload = {
            issueType: issueTypeToSubmit,
            unit: Number(unit),
            propertyId: Number(property),
            TenantId: Number(tenant),
            description: description || undefined,
        };

        await onSubmit(selectedRequest.id, payload);
    };

    if (!isOpen || !selectedRequest) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-[100000] font-sans">
            <div className="bg-white w-full max-w-md pt-8 px-6 pb-6 relative h-full overflow-y-auto shadow-lg animate-slide-in-right">
                <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={onClose}
                    aria-label="Close update modal"
                >
                    &#10005;
                </button>

                <h2 className="text-xl font-semibold mb-4">Update Maintenance Request (ID: {selectedRequest.requestID})</h2>

                {message && (
                    <div className={`p-3 mb-4 rounded-md text-sm ${
                        message.type === 'success' ? 'bg-green-100 text-green-700' : 
                        message.type === 'error' ? 'bg-red-100 text-red-700' : 
                        'bg-blue-100 text-blue-700'
                    }`}>
                        {message.text}
                    </div>
                )}

                <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="updateIssueType" className='block text-sm font-medium text-gray-700 mb-1'>
                            Type of Issue <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="updateIssueType"
                            value={selectedIssueType}
                            onChange={(e) => {
                                setSelectedIssueType(e.target.value);
                                if (issueTypeError) setIssueTypeError(null);
                            }}
                            className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${issueTypeError ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select issue type</option>
                            {issueTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                        {issueTypeError && <p className="text-red-500 text-xs mt-1">{issueTypeError}</p>}
                    </div>

                    {selectedIssueType === "Other" && (
                        <div>
                            <label htmlFor="updateOtherIssueType" className="block text-sm font-medium text-gray-700 mb-1">
                                Specify Your Reason <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="updateOtherIssueType"
                                className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${otherIssueTypeError ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your reason..."
                                value={otherIssueType}
                                onChange={(e) => {
                                    setOtherIssueType(e.target.value);
                                    if (otherIssueTypeError) setOtherIssueTypeError(null);
                                }}
                            />
                            {otherIssueTypeError && <p className="text-red-500 text-xs mt-1">{otherIssueTypeError}</p>}
                        </div>
                    )}

                    <div>
                        <label htmlFor="updateProperty" className='block text-sm font-medium text-gray-700 mb-1'>
                            Property <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="updateProperty"
                            value={property === '' ? '' : property}
                            onChange={(e) => {
                                const val = e.target.value;
                                const propertyId = val === '' ? '' : Number(val);
                                setProperty(propertyId);
                                if (propertyId) {
                                    onPropertyChange(propertyId);
                                }
                                if (propertyError) setPropertyError(null);
                            }}
                            className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${propertyError ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select property</option>
                            {properties.map((prop) => (
                                <option key={prop.id} value={prop.id}>
                                    {prop.name}
                                </option>
                            ))}
                        </select>
                        {propertyError && <p className="text-red-500 text-xs mt-1">{propertyError}</p>}
                    </div>

                    <div>
                        <label htmlFor="updateUnit" className='block text-sm font-medium text-gray-700 mb-1'>
                            Unit <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="updateUnit"
                            value={unit === '' ? '' : unit}
                            onChange={(e) => {
                                const val = e.target.value;
                                const unitId = val === '' ? '' : Number(val);
                                if (unitId) {
                                    onUnitChange(unitId);
                                } else {
                                    setUnit('');
                                }
                                if (unitError) setUnitError(null);
                            }}
                            className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${unitError ? 'border-red-500' : 'border-gray-300'}`}
                            disabled={!property}
                        >
                            <option value="">Select unit</option>
                            {availableUnits.map((unit) => (
                                <option key={unit.id} value={unit.id}>
                                    {unit.part_name}
                                </option>
                            ))}
                        </select>
                        {unitError && <p className="text-red-500 text-xs mt-1">{unitError}</p>}
                    </div>

                    <div>
                        <label htmlFor="updateTenant" className='block text-sm font-medium text-gray-700 mb-1'>
                            Tenant <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="updateTenant"
                            value={tenant === '' ? '' : tenant}
                            onChange={(e) => {
                                const val = e.target.value;
                                setTenant(val === '' ? '' : Number(val));
                                if (tenantError) setTenantError(null);
                            }}
                            className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${tenantError ? 'border-red-500' : 'border-gray-300'}`}
                            disabled={!unit}
                        >
                            <option value="">Select tenant</option>
                            {availableTenants.map((tenant) => (
                                <option key={tenant.id} value={tenant.id}>
                                    {tenant.name}
                                </option>
                            ))}
                        </select>
                        {tenantError && <p className="text-red-500 text-xs mt-1">{tenantError}</p>}
                    </div>

                    <div>
                        <label htmlFor="updateDescription" className='block text-sm font-medium text-gray-700 mb-1'>Additional Comments (Optional)</label>
                        <textarea
                            id="updateDescription"
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                            placeholder="Provide more details about your issue..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="mt-2 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all font-medium"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateMaintenanceModal;