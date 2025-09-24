import React from 'react';
import { Contact, ContactStatus, CreateContactPayload } from '../core/_model';
import { Property } from '../../Properties/core/_models';
import { Unit } from '../../PropertyParts/core/_models';
import { Tenant } from '../../Tenant/core/_models';


interface CreateContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateContactPayload) => Promise<void>;
  properties: Property[];
  units: Unit[];
  filteredUnits: Unit[];
  tenants: Tenant[];
  loading: boolean;
  unit: number | '';
  setUnit: (unit: number | '') => void;
  property: number | '';
  setProperty: (property: number | '') => void;
  handlePropertyChange: (propertyId: number | '') => void;
  tenant: number | '';
  setTenant: (tenant: number | '') => void;
  reason: string;
  setReason: (reason: string) => void;
  description: string;
  setDescription: (description: string) => void;
  selectedContactStatus: ContactStatus | '';
  setSelectedContactStatus: (status: ContactStatus | '') => void;
  unitError: string | null;
  setUnitError: (error: string | null) => void;
  propertyError: string | null;
  setPropertyError: (error: string | null) => void;
  tenantError: string | null;
  setTenantError: (error: string | null) => void;
  reasonError: string | null;
  setReasonError: (error: string | null) => void;
  contactStatusError: string | null;
  setContactStatusError: (error: string | null) => void;
  message: { type: 'success' | 'error' | 'info', text: string } | null;
}

const CreateContactModal: React.FC<CreateContactModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  properties,
  filteredUnits,
  tenants,
  loading,
  unit,
  setUnit,
  property,
  handlePropertyChange,
  tenant,
  setTenant,
  reason,
  setReason,
  description,
  setDescription,
  selectedContactStatus,
  setSelectedContactStatus,
  unitError,
  setUnitError,
  propertyError,
  setPropertyError,
  tenantError,
  setTenantError,
  reasonError,
  setReasonError,
  contactStatusError,
  setContactStatusError,
  message,
}) => {
  const contactReasons = [
    { id: "general_inquiry", label: "General Inquiry" },
    { id: "technical_support", label: "Technical Support" },
    { id: "billing_question", label: "Billing Question" },
    { id: "feedback", label: "Feedback" },
    { id: "other", label: "Other" },
  ];

  const contactStatusOptions: ContactStatus[] = ['pending', 'approved', 'rejected'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    
    setUnitError(null);
    setPropertyError(null);
    setTenantError(null);
    setReasonError(null);
    setContactStatusError(null);

    let isValid = true;

    if (unit === '' || isNaN(Number(unit))) {
      setUnitError('Unit is required and must be a valid number.');
      isValid = false;
    }

    if (property === '' || isNaN(Number(property))) {
      setPropertyError('Property ID is required and must be a valid number.');
      isValid = false;
    }

    if (tenant === '' || isNaN(Number(tenant))) {
      setTenantError('Tenant ID is required and must be a valid number.');
      isValid = false;
    }

    if (!reason.trim()) {
      setReasonError('Reason is required.');
      isValid = false;
    }

    if (!selectedContactStatus) {
      setContactStatusError('Contact status is required.');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const generatedExternalId = `prms_org_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    const payload: CreateContactPayload = {
      unit: Number(unit),
      propertyId: Number(property),
      tenantId: Number(tenant),
      status: selectedContactStatus as ContactStatus,
      reason: reason,
      description: description || undefined,
      external_id: generatedExternalId,
    };

    await onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] font-sans">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md pt-8 px-6 pb-6 relative max-h-[85vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          &#10005;
        </button>

        <h2 className="text-xl font-semibold mb-4">Contact Management</h2>

        {message && (
          <div className={`p-3 mb-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
            {message.text}
          </div>
        )}

        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="property" className='block text-sm font-medium text-gray-700 mb-1'>
              Property <span className="text-red-500">*</span>
            </label>
            <select
              id="property"
              value={property}
              onChange={(e) => {
                const val = e.target.value;
                handlePropertyChange(val === '' ? '' : Number(val));
                if (propertyError) setPropertyError(null);
              }}
              className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${propertyError ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a property</option>
              {properties.map((prop) => (
                <option key={prop.id} value={prop.id}>
                  {prop.name} - {prop.location}
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
              value={unit}
              onChange={(e) => {
                const val = e.target.value;
                setUnit(val === '' ? '' : Number(val));
                if (unitError) setUnitError(null);
              }}
              className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${unitError ? 'border-red-500' : 'border-gray-300'}`}
              disabled={!property}
            >
              <option value="">Select a unit</option>
              {filteredUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.part_name} - {unit.status}
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
              value={tenant}
              onChange={(e) => {
                const val = e.target.value;
                setTenant(val === '' ? '' : Number(val));
                if (tenantError) setTenantError(null);
              }}
              className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${tenantError ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name} 
                </option>
              ))}
            </select>
            {tenantError && <p className="text-red-500 text-xs mt-1">{tenantError}</p>}
          </div>

          <div>
            <label htmlFor="reason" className='block text-sm font-medium text-gray-700 mb-1'>
              Reason <span className="text-red-500">*</span>
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (reasonError) setReasonError(null);
              }}
              className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${reasonError ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a reason</option>
              {contactReasons.map((r) => (
                <option key={r.id} value={r.label}>
                  {r.label}
                </option>
              ))}
            </select>
            {reasonError && <p className="text-red-500 text-xs mt-1">{reasonError}</p>}
          </div>

          <div>
            <label htmlFor="contactStatus" className='block text-sm font-medium text-gray-700 mb-1'>
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="contactStatus"
              value={selectedContactStatus}
              onChange={(e) => {
                setSelectedContactStatus(e.target.value as ContactStatus);
                if (contactStatusError) setContactStatusError(null);
              }}
              className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${contactStatusError ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Status</option>
              {contactStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {contactStatusError && <p className="text-red-500 text-xs mt-1">{contactStatusError}</p>}
          </div>

          <div>
            <label htmlFor="description" className='block text-sm font-medium text-gray-700 mb-1'>Additional Comments (Optional)</label>
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
              {loading ? 'Submitting...' : 'Submit Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContactModal;
