import React, { FC, useState, useEffect } from 'react';
import { CreateMaintenanceRequestPayload } from '../core/_model';
import { createMaintenanceRequest } from '../core/_request';
import { Property } from '../../Properties/core/_models';
import { Unit } from '../../PropertyParts/core/_models';
import { Tenant } from '../../Tenant/core/_models';
import { getPropertyPartByPropertyId } from '../../Tenant/core/_requests';

interface CreateMaintenanceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
}

const CreateMaintenanceRequestModal: FC<CreateMaintenanceRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  properties,
  units,
  tenants,
}) => {
  const [selectedIssueType, setSelectedIssueType] = useState<string>("");
  const [otherIssueType, setOtherIssueType] = useState<string>("");
  const [unit, setUnit] = useState<number | ''>('');
  const [property, setProperty] = useState<number | ''>('');
  const [tenant, setTenant] = useState<number | ''>('');
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);

  const [issueTypeError, setIssueTypeError] = useState<string | null>(null);
  const [otherIssueTypeError, setOtherIssueTypeError] = useState<string | null>(null);
  const [unitError, setUnitError] = useState<string | null>(null);
  const [propertyError, setPropertyError] = useState<string | null>(null);
  const [tenantError, setTenantError] = useState<string | null>(null);

  const issueTypes = [
    { id: "Electrical", label: "Electrical" },
    { id: "Plumbing", label: "Plumbing" },
    { id: "HVAC", label: "HVAC" },
    { id: "General", label: "General" },
    { id: "Other", label: "Other (Specify in Comments)" },
  ];

  const resetForm = () => {
    setSelectedIssueType("");
    setOtherIssueType("");
    setUnit('');
    setProperty('');
    setTenant('');
    setDescription("");
    setAvailableUnits([]);
    setAvailableTenants([]);
    setIssueTypeError(null);
    setOtherIssueTypeError(null);
    setUnitError(null);
    setPropertyError(null);
    setTenantError(null);
    setMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handlePropertyChange = async (propertyId: number) => {
    try {
      const unitsByProperty = await getPropertyPartByPropertyId(propertyId);
      setAvailableUnits(unitsByProperty);
      setUnit('');
      setTenant('');
      setAvailableTenants([]);
    } catch (error) {
      console.error("Failed to fetch units for property:", error);
      setAvailableUnits([]);
      setAvailableTenants([]);
    }
  };

  const handleUnitChange = (unitId: number) => {
    setUnit(unitId);
    if (property && unitId) {
      const filteredTenants = tenants.filter(tenant => 
        tenant.property_id === Number(property) && 
        tenant.property_part_id === unitId
      );
      setAvailableTenants(filteredTenants);
      setTenant('');
    } else {
      setAvailableTenants([]);
      setTenant('');
    }
  };

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

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!validateForm()) {
      setLoading(false);
      setMessage({ type: 'error', text: 'Please fill in all required fields correctly.' });
      return;
    }

    const issueTypeToSubmit = selectedIssueType === "Other" ? otherIssueType : selectedIssueType;

    const payload: CreateMaintenanceRequestPayload = {
      unit: Number(unit),
      propertyId: Number(property),
      TenantId: Number(tenant),
      description: description || undefined,
      issueType: issueTypeToSubmit,
    };

    try {
      const responseData = await createMaintenanceRequest(payload);
      console.log("Maintenance request submitted successfully:", responseData);

      //setMessage({ type: 'success', text: 'Maintenance Request submitted successfully!' });
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (error) {
      console.error("Error submitting maintenance request:", error);
      setMessage({ type: 'error', text: `Failed to submit request: ${error instanceof Error ? error.message : String(error)}` });
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] font-sans">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md pt-8 px-6 pb-6 relative max-h-[85vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors"
          onClick={handleClose}
          aria-label="Close modal"
        >
          &#10005;
        </button>

        <h2 className="text-xl font-semibold mb-4">Maintenance Request</h2>

        {message && (
          <div className={`p-3 mb-4 rounded-md text-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmitRequest}>
          <div>
            <label htmlFor="issueType" className='block text-sm font-medium text-gray-700 mb-1'>
              Type of Issue <span className="text-red-500">*</span>
            </label>
            <select
              id="issueType"
              value={selectedIssueType}
              onChange={(e) => {
                setSelectedIssueType(e.target.value);
                if (issueTypeError) setIssueTypeError(null);
              }}
              className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${
                issueTypeError ? 'border-red-500' : 'border-gray-300'
              }`}
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
              <label htmlFor="otherIssueType" className="block text-sm font-medium text-gray-700 mb-1">
                Specify Your Reason <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="otherIssueType"
                className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${
                  otherIssueTypeError ? 'border-red-500' : 'border-gray-300'
                }`}
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
            <label htmlFor="property" className='block text-sm font-medium text-gray-700 mb-1'>
              Property <span className="text-red-500">*</span>
            </label>
            <select
              id="property"
              value={property === '' ? '' : property}
              onChange={(e) => {
                const val = e.target.value;
                const propertyId = val === '' ? '' : Number(val);
                setProperty(propertyId);
                if (propertyId) {
                  handlePropertyChange(propertyId);
                } else {
                  setAvailableUnits([]);
                  setUnit('');
                }
                if (propertyError) setPropertyError(null);
              }}
              className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${
                propertyError ? 'border-red-500' : 'border-gray-300'
              }`}
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
            <label htmlFor="unit" className='block text-sm font-medium text-gray-700 mb-1'>
              Unit <span className="text-red-500">*</span>
            </label>
            <select
              id="unit"
              value={unit === '' ? '' : unit}
              onChange={(e) => {
                const val = e.target.value;
                const unitId = val === '' ? '' : Number(val);
                if (unitId) {
                  handleUnitChange(unitId);
                } else {
                  setUnit('');
                  setAvailableTenants([]);
                  setTenant('');
                }
                if (unitError) setUnitError(null);
              }}
              className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${
                unitError ? 'border-red-500' : 'border-gray-300'
              }`}
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
            <label htmlFor="tenant" className='block text-sm font-medium text-gray-700 mb-1'>
              Tenant <span className="text-red-500">*</span>
            </label>
            <select
              id="tenant"
              value={tenant === '' ? '' : tenant}
              onChange={(e) => {
                const val = e.target.value;
                setTenant(val === '' ? '' : Number(val));
                if (tenantError) setTenantError(null);
              }}
              className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${
                tenantError ? 'border-red-500' : 'border-gray-300'
              }`}
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
            <label htmlFor="description" className='block text-sm font-medium text-gray-700 mb-1'>
              Additional Comments (Optional)
            </label>
            <textarea
              id="description"
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
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMaintenanceRequestModal;