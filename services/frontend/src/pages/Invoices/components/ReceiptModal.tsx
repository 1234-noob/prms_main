import React, { FC } from 'react';
import { usePDF } from 'react-to-pdf';
import '../print-invoice.css';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

interface Invoice {
  id: string;
  contract_id: number;
  property_part_id: number;
  amount: number;
  due_date: string;
  status: string;
  tenant_name: string;
  merchant: string;
  frequency: string;
  external_id: string;
  created_at: string;
  updated_at: string;
  alias?: string;
  tenant_address?: string;
  tenant_email?: string;
  tenant_phone?: string;
  company_name?: string;
  company_address?: string;
  company_city_state_zip?: string;
  company_phone?: string;
  company_email_website?: string;
  ship_to_name?: string;
  ship_to_address?: string;
  ship_to_city_state_zip?: string;
}

const ReceiptModal: FC<ReceiptModalProps> = ({ isOpen, onClose, invoice }) => {
  const { toPDF, targetRef } = usePDF({
    filename: `Invoice_Receipt_${invoice?.id || 'UNKNOWN'}.pdf`,
    page: { orientation: 'portrait', margin: 10 },
  });

  if (!isOpen || !invoice) return null;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const invoiceNumber = String(invoice.id).toUpperCase();
  const invoiceDate = formatDate(invoice.created_at);
  const dueDate = formatDate(invoice.due_date);

  const tenantAddress = invoice.tenant_address || "Renton, WA 98055";
  const tenantEmail = invoice.tenant_email || "sigmund@you.mail";
  const tenantPhone = invoice.tenant_phone || "222 555 7777";

  const yourCompanyAddressFromTemplate = invoice.company_address || "Pittsburgh, PA 15201";
  const yourCompanyPhoneFromTemplate = invoice.company_phone || "222 555 7777";
  const yourCompanyEmailFromTemplate = invoice.company_email_website ? invoice.company_email_website.split(', ')[0] : "inquire@skeletime.mail";
  const yourCompanyWebsiteFromTemplate = invoice.company_email_website ? (invoice.company_email_website.split(', ')[1] || "Template.net") : "Template.net";

  const subTotal = parseFloat(invoice.amount.toString());
  const taxRate = 0.10;
  const taxAmount = parseFloat((subTotal * taxRate).toFixed(2));
  const totalAmount = parseFloat((subTotal + taxAmount).toFixed(2));

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'text-green-700',
    overdue: 'bg-red-100 text-red-700',
    approved: 'bg-blue-100 text-blue-700',
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000] font-inter">

      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] receipt-modal-content"> {/* Changed max-h-[90vh] to max-h-[85vh] */}

        {/* This header is for the *screen* modal, not for the PDF */}
        <div className="flex justify-between items-center pt-12 px-4 pb-4 border-b modal-header-controls">
          <h2 className="text-2xl font-bold text-gray-800">Invoice Receipt</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl leading-none">&times;</button>
        </div>


        <div className="flex-grow overflow-y-auto"> 

            <div className="receipt-content-area" ref={targetRef}>
              {/* This is the header for the PDF output */}
              <div className="modal-header-for-pdf">
                <h2 className="text-2xl font-bold text-gray-800">Invoice Receipt</h2>
              </div>

              <div className="relative pt-8 p-4 pb-12 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-shrink-0">
                    <div style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid #333', objectFit: 'cover', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', color: '#666' }} />
                  </div>
                  <div className="text-right flex-shrink-0 pr-12 relative">
                    <div className="relative z-10 text-gray-700">
                      <p className="text-xs">{yourCompanyEmailFromTemplate}</p>
                      <p className="text-xs">{yourCompanyAddressFromTemplate}</p>
                      <p className="text-xs">{yourCompanyPhoneFromTemplate}</p>
                      <p className="text-xs">{yourCompanyWebsiteFromTemplate}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 border border-gray-300">
                  <table className="min-w-full bg-white">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-1.5 px-2 text-left text-gray-700 w-1/2 text-sm">Invoice Number:</td>
                        <td className="py-1.5 px-2 text-left text-gray-700 w-1/2 text-sm">{invoiceNumber}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-1.5 px-2 text-left text-gray-700 text-sm">Invoice Date:</td>
                        <td className="py-1.5 px-2 text-left text-gray-700 text-sm">{invoiceDate}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-2 text-left text-gray-700 text-sm">Due Date:</td>
                        <td className="py-1.5 px-2 text-left text-gray-700 text-sm">{dueDate}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-800 text-white p-1.5 mb-0">
                  <p className="text-base font-bold uppercase pl-2">Bill To:</p>
                </div>

                <div className="mb-4 border border-gray-300 p-2">
                  <ul className="text-sm text-gray-700 space-y-1 bill-to-list"> 
                    <li><span className="font-semibold">Name:</span> {invoice.tenant_name}</li>
                    <li><span className="font-semibold">Address:</span> {tenantAddress}</li>
                    <li><span className="font-semibold">Email:</span> {tenantEmail}</li>
                    <li><span className="font-semibold">Phone:</span> {tenantPhone}</li>
                  </ul>
                </div>

                <hr className="border-t-2 border-gray-400 mb-4" />

                <div className="bg-gray-800 text-white p-1.5 mb-0">
                  <p className="text-base font-bold uppercase pl-2">Invoice Details:</p>
                </div>

                <table className="min-w-full bg-white border border-gray-300 mb-4 invoice-details-table">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 uppercase text-xs leading-normal">
                      <th className="py-2 px-2 text-left border-b border-gray-300 w-1/2">Detail</th>
                      <th className="py-2 px-2 text-left border-b border-gray-300 w-1/2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1.5 px-2 text-left text-gray-800 font-semibold text-sm">Contract ID:</td>
                      <td className="py-1.5 px-2 text-left text-gray-700 text-sm">{invoice.contract_id}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 text-left text-gray-800 font-semibold text-sm">Property Part ID:</td>
                      <td className="py-1.5 px-2 text-left text-gray-700 text-sm">{invoice.property_part_id}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 text-left text-gray-800 font-semibold text-sm">Frequency:</td>
                      <td className="py-1.5 px-2 text-left text-gray-700 text-sm">{invoice.frequency}</td>
                    </tr>
                    <tr className="invoice-status-row"> 
                      <td className={`py-1.5 px-2 text-left text-gray-800 font-semibold text-sm`}>Status:</td>
                      <td className={`py-1.5 px-2 text-left font-semibold text-sm ${statusColors[invoice.status]}`}>{invoice.status}</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 text-left text-gray-800 font-semibold text-sm">External ID:</td>
                      <td className="py-1.5 px-2 text-left text-gray-700 text-sm">{invoice.external_id}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="bg-gray-800 text-white p-1.5 mb-0">
                  <p className="text-base font-bold uppercase pl-2">Total Amounts:</p>
                </div>

                <div className="w-full mb-4 border border-gray-300">
                  <table className="min-w-full bg-white">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-1.5 px-2 text-left text-gray-700 text-sm">Subtotal:</td>
                        <td className="py-1.5 px-2 text-right text-gray-700 w-1/4 text-sm">₹{subTotal.toFixed(2)}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-1.5 px-2 text-left text-gray-700 text-sm">Tax (10%):</td>
                        <td className="py-1.5 px-2 text-right text-gray-700 w-1/4 text-sm">₹{taxAmount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-2 text-left text-gray-900 font-bold text-sm">Total:</td>
                        <td className="py-1.5 px-2 text-right text-gray-900 font-bold w-1/4 text-sm">₹{totalAmount.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-center text-gray-600 text-sm mt-4 italic font-medium">
                  It has been a pleasure doing business with you. Thank as you.
                </p>

                <div className="absolute bottom-4 right-4">
                  <img src="/images/web_icon.png" alt="Web Icon" className="w-8 h-8" />
                </div>
              </div>
            </div>
        </div> 

        
        <div className="p-4 border-t-2 border-gray-300 flex justify-end gap-4 print-action-buttons">
          <button
            onClick={() => toPDF()}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
          >
            Save as PDF
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-gray-900 font-bold px-6 py-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
