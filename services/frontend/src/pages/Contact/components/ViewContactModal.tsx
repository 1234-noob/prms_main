import React from 'react';
import { Contact, ContactStatus } from '../core/_model';
import { Property } from '../../Properties/core/_models';
import { Unit } from '../../PropertyParts/core/_models';
import { Tenant } from '../../Tenant/core/_models';

interface ViewContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedContact: Contact | null;
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
}

const ViewContactModal: React.FC<ViewContactModalProps> = ({
  isOpen,
  onClose,
  selectedContact,
  properties,
  units,
  tenants,
}) => {
  const statusColors: Record<ContactStatus, string> = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
  };

  const getPropertyName = (propertyId: number) => {
    const prop = properties.find(p => p.id === propertyId);
    return prop ? prop.name : propertyId.toString();
  };

  const getUnitName = (unitId: number) => {
    const unit = units.find(u => u.id === unitId);
    return unit ? unit.part_name : unitId.toString();
  };

  const getTenantName = (tenantId: number) => {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : tenantId.toString();
  };

  if (!isOpen || !selectedContact) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] font-sans">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md pt-8 px-6 pb-6 relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close view modal"
        >
          &#10005;
        </button>
        
        <h2 className="text-xl font-semibold mb-4 text-center">Contact Details</h2>
        
        <div className="grid grid-cols-1 gap-3 text-gray-700">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Contact ID:</span>
            <span>{selectedContact.contactID}</span>
          </div>
          
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Property:</span>
            <span>{getPropertyName(selectedContact.propertyId)}</span>
          </div>
          
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Unit:</span>
            <span>{getUnitName(selectedContact.unit)}</span>
          </div>
          
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Tenant:</span>
            <span>{getTenantName(selectedContact.tenantId)}</span>
          </div>
          
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Reason:</span>
            <span>{selectedContact.reason}</span>
          </div>
          
          {selectedContact.description && (
            <div className="flex flex-col border-b pb-2">
              <span className="font-medium mb-1">Additional Comments:</span>
              <p className="text-sm bg-gray-50 p-2 rounded-md">{selectedContact.description}</p>
            </div>
          )}
          
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Submitted Date:</span>
            <span>{selectedContact.submittedDate}</span>
          </div>
          
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Status:</span>
            <span className={`${statusColors[selectedContact.contactStatus]} px-3 py-1 text-xs rounded-full font-medium`}>
              {selectedContact.contactStatus}
            </span>
          </div>
          
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">External ID:</span>
            <span className="text-sm">{selectedContact.externalId}</span>
          </div>
          
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Created:</span>
            <span className="text-sm">{new Date(selectedContact.createdAt).toLocaleDateString('en-GB', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Last Updated:</span>
            <span className="text-sm">{new Date(selectedContact.updatedAt).toLocaleDateString('en-GB', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewContactModal;