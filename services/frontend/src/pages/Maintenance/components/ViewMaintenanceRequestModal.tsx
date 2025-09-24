import React, { FC } from 'react';
import { MaintenanceRequest } from '../core/_model';
import { Property } from '../../Properties/core/_models';
import { Unit } from '../../PropertyParts/core/_models';
import { Tenant } from '../../Tenant/core/_models';

interface ViewMaintenanceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRequest: MaintenanceRequest | null;
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
}

const ViewMaintenanceRequestModal: FC<ViewMaintenanceRequestModalProps> = ({
  isOpen,
  onClose,
  selectedRequest,
  properties,
  units,
  tenants,
}) => {
  const getPropertyName = (propertyId: number) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : `Property ${propertyId}`;
  };

  const getUnitName = (unitId: number) => {
    const unit = units.find(u => u.id === unitId);
    return unit ? unit.part_name : `Unit ${unitId}`;
  };

  const getTenantName = (tenantId: number) => {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : `Tenant ${tenantId}`;
  };

  if (!isOpen || !selectedRequest) return null;

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
        
        <h2 className="text-xl font-semibold mb-4 text-center">Maintenance Request Details</h2>
        
        <div className="grid grid-cols-1 gap-3 text-gray-700">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Request ID:</span>
            <span>{selectedRequest.requestID}</span>
          </div>
          
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Issue Type:</span>
            <span>{selectedRequest.issueType}</span>
          </div>
          
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Unit:</span>
            <span>{getUnitName(selectedRequest.unit)}</span>
          </div>
          
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Property:</span>
            <span>{getPropertyName(selectedRequest.propertyId)}</span>
          </div>
          
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Tenant:</span>
            <span>{getTenantName(selectedRequest.TenantId)}</span>
          </div>
          
          {selectedRequest.description && (
            <div className="flex flex-col border-b pb-2">
              <span className="font-medium mb-1">Additional Comments:</span>
              <p className="text-sm bg-gray-50 p-2 rounded-md">{selectedRequest.description}</p>
            </div>
          )}
          
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Requested Date:</span>
            <span>{selectedRequest.submittedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMaintenanceRequestModal;