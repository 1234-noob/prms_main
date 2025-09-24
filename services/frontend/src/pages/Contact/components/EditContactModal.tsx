import React from 'react';
import { Contact, ContactStatus, UpdateContactPayload } from '../core/_model';
import { Property } from '../../Properties/core/_models';
import { Unit } from '../../PropertyParts/core/_models';
import { Tenant } from '../../Tenant/core/_models';

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, payload: UpdateContactPayload) => Promise<void>;
  selectedContact: Contact | null;
  properties: Property[];
  filteredUnits: Unit[];
  tenants: Tenant[];
  loading: boolean;
  unit: number | '';
  setUnit: (unit: number | '') => void;
  property: number | '';
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
}

const EditContactModal: React.FC<EditContactModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedContact,
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
    if (!selectedContact) return;

    // Reset errors
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

    const payload: UpdateContactPayload = {
      unit: Number(unit),
      propertyId: Number(property),
      tenantId: Number(tenant),
      status: selectedContactStatus as ContactStatus,
      reason: reason,
      description: description || undefined,
      external_id: selectedContact.externalId,
    };

    await onSubmit(selectedContact.id, payload);
  };

  if (!isOpen || !selectedContact) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-[100000] font-sans">
      <div className="bg-white w-full max-w-md pt-8 px-6 pb-6 relative h-full overflow-y-auto shadow-lg animate-slide-in-right">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors"
          onClick={onClose}
          aria-label="Close edit modal"
        >
          &#10005;
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Contact (ID: {selectedContact.contactID})</h2>

        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="editProperty" className='block text-sm font-medium text-gray-700 mb-1'>
              Property <span className="text-red-500">*</span>
            </label>
            <select
              id="editProperty"
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
            <label htmlFor="editUnit" className='block text-sm font-medium text-gray-700 mb-1'>
              Unit <span className="text-red-500">*</span>
            </label>
            <select
              id="editUnit"
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
            <label htmlFor="editTenant" className='block text-sm font-medium text-gray-700 mb-1'>
              Tenant <span className="text-red-500">*</span>
            </label>
            <select
              id="editTenant"
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
            <label htmlFor="editReason" className='block text-sm font-medium text-gray-700 mb-1'>
              Reason <span className="text-red-500">*</span>
            </label>
            <select
              id="editReason"
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
            <label htmlFor="editContactStatus" className='block text-sm font-medium text-gray-700 mb-1'>
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="editContactStatus"
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
            <label htmlFor="editDescription" className='block text-sm font-medium text-gray-700 mb-1'>Additional Comments (Optional)</label>
            <textarea
              id="editDescription"
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
              {loading ? 'Updating...' : 'Update Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContactModal;