import React from 'react';
import { Contract } from '../core/_models';

interface ViewAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  agreementData: Contract | null;
}

const ViewAgreementModal: React.FC<ViewAgreementModalProps> = ({ isOpen, onClose, agreementData }) => {


  if (!isOpen || !agreementData) {
    return null;
  }

  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] font-inter">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-[50rem] max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex justify-between items-center pb-4">
          <h2 className="text-xl font-semibold">Rental Agreement Details</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth="2" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Removed targetRef from here, as we are not generating PDF from the modal itself */}
        <div className="flex-grow overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="font-medium text-slate-900">Unit:</p>
              <p>{agreementData.property_part_name || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Property:</p>
              <p>{agreementData.property_name || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Tenant(s):</p>
              <p>
                {agreementData.tenants && agreementData.tenants.length > 0 ? (
                  agreementData.tenants.map(tenant => (
                    <div key={tenant.id}>
                      {tenant.name} ({tenant.email})
                    </div>
                  ))
                ) : agreementData.tenant_id ? (
                    <span>Tenant ID: {agreementData.tenant_id}</span>
                ) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Contract ID:</p>
              <p>{agreementData.id || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Contract Duration:</p>
              <p>{`${formatDate(agreementData.start_date)} - ${formatDate(agreementData.end_date)}`}</p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Monthly Rent:</p>
              <p>
                  {agreementData.rent_amount
                      ? Number(agreementData.rent_amount).toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                      })
                      : "-"}
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-900">TDS Applicable:</p>
              <p>{typeof agreementData.tds_applicable === 'boolean' ? (agreementData.tds_applicable ? 'Yes' : 'No') : 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Is Active:</p>
              <p>{typeof agreementData.isActive === 'boolean' ? (agreementData.isActive ? 'Yes' : 'No') : 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">

          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAgreementModal;