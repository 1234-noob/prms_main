import React, { FC, useState, useEffect, useCallback } from 'react';
import CreateInvoiceModal from './Invoices/components/CreateInvoicesModal';
import { ReactComponent as SortIcon } from './Invoices/invoice_table_filter.svg';
import { ReactComponent as EyeIcon } from './Invoices/eye-svgrepo-com.svg';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
//import ReceiptModal from './Invoices/components/ReceiptModal';
import { useAuth } from '../app/modules/auth/core/Auth';
import { getAllInvoices, ApiResponseError, INVOICE_RECEIPT_URL } from './Invoices/core/_requests'; 
import { Invoice, InvoiceStatus, InvoiceFrequency } from './Invoices/core/_model'; 
import './Invoices/Loader.css'; 


const DownloadIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3V15M12 15L16 11M12 15L8 11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 17V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


const RecurringInvoicesPage: FC = () => {
  const { currentUser } = useAuth();

  console.log(currentUser);

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [invoiceType, setInvoiceType] = useState('All');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('All');
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const statusColors: Record<InvoiceStatus, string> = { 
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
  };

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllInvoices();
      setInvoices(data);
    } catch (err: any) {
      console.error('Error fetching invoices:', err);
      if (err instanceof ApiResponseError) {
        setError(err.message);
        toast.error(`Failed to fetch invoices: ${err.message}`);
      } else {
        setError('An unexpected error occurred while fetching invoices.');
        toast.error('An unexpected error occurred while fetching invoices.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleInvoiceAdded = () => {
    fetchInvoices();
    setShowCreateInvoiceModal(false);
  };

  const handleViewReceipt = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowReceiptModal(true);
    
    window.open(`http://localhost:3010/api/invoices/${invoice.id}/receipt?template_type=Receipt`, "_blank");
  };

  const handleViewInvoice = (invoice: Invoice) => {
    window.open(`http://localhost:3010/api/invoices/${invoice.id}/invoice?template_type=Invoice`, "_blank");
  };

 const handleDownloadInvoice = async (invoice: Invoice) => {
  if (isDownloading === invoice.id) return;

  setIsDownloading(invoice.id);
  toast.info(`Downloading Invoice #${invoice.id}...`);

  try {
    const response = await fetch(
      `http://localhost:3010/api/invoices/${invoice.id}/invoice?template_type=Invoice`,
      {
        headers: {
          Accept: "application/pdf", // 👈 tell backend you want PDF
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch invoice: ${response.statusText}`);
    }

    // Check if backend actually returned a PDF
    const contentType = response.headers.get("Content-Type");
    if (!contentType || !contentType.includes("pdf")) {
      throw new Error(`Expected PDF but got ${contentType}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;

    // Always save as PDF
    const safeTenant = invoice.tenant_name.replace(/[^a-z0-9]/gi, "_"); // sanitize filename
    a.download = `Invoice-${invoice.id}-${safeTenant}.pdf`;

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast.success("Invoice downloaded successfully!");
  } catch (error) {
    console.error("Download failed:", error);
    toast.error("Failed to download the invoice.");
  } finally {
    setIsDownloading(null);
  }
};


const handleDownloadReceipt = async (invoice: Invoice) => {
  if (isDownloading === invoice.id + "-receipt") return;

  setIsDownloading(invoice.id + "-receipt");
  toast.info(`Downloading Receipt #${invoice.id}...`);

  try {
    const response = await fetch(
      `http://localhost:3010/api/invoices/${invoice.id}/receipt?template_type=Receipt`,
      {
        headers: {
          Accept: "application/pdf",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch receipt: ${response.statusText}`);
    }

    const contentType = response.headers.get("Content-Type");
    if (!contentType || !contentType.includes("pdf")) {
      throw new Error(`Expected PDF but got ${contentType}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;

    const safeTenant = invoice.tenant_name.replace(/[^a-z0-9]/gi, "_");
    a.download = `Receipt-${invoice.id}-${safeTenant}.pdf`;

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast.success("Receipt downloaded successfully!");
  } catch (error) {
    console.error("Download failed:", error);
    toast.error("Failed to download the receipt.");
  } finally {
    setIsDownloading(null);
  }
};



  const handleCloseReceiptModal = () => {
    setShowReceiptModal(false);
    setSelectedInvoice(null);
  };

  const sortItems = (items: Invoice[]) => {
    if (!sortKey) return items;
    return [...items].sort((a, b) => {
      const aValue = (a as any)[sortKey];
      const bValue = (b as any)[sortKey];

      if (typeof aValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.toLowerCase().localeCompare(bValue.toLowerCase())
          : bValue.toLowerCase().localeCompare(aValue.toLowerCase());
      }

      return 0;
    });
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder((prev: 'asc' | 'desc') => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredItems = invoices.filter((item) => {
    const matchesQuery =
      item.tenant_name?.toLowerCase().includes(query.toLowerCase()) ||
      item.merchant?.toLowerCase().includes(query.toLowerCase()) ||
      item.external_id?.toLowerCase().includes(query.toLowerCase()) ||
      item.status?.toLowerCase().includes(query.toLowerCase()) ||
      item.due_date?.toLowerCase().includes(query.toLowerCase()) ||
      item.contract_id.toString().includes(query.toLowerCase()) ||
      item.property_part_id.toString().includes(query.toLowerCase()) ||
      item.amount.toString().includes(query.toLowerCase()) ||
      item.alias?.toLowerCase().includes(query.toLowerCase());

    const matchesStatus =
      invoiceStatusFilter === 'All' ||
      item.status.toLowerCase() === invoiceStatusFilter.toLowerCase();

    const matchesType =
      invoiceType === 'All' ||
      item.frequency.toLowerCase() === invoiceType.toLowerCase();

    return matchesQuery && matchesStatus && matchesType;
  });

  const sortedItems = sortItems(filteredItems);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(sortedItems.length / rowsPerPage);

  const handleExport = () => {
    const exportData = sortedItems.map((invoice) => ({
      "Contract ID": invoice.contract_id,
      "Property Part ID": invoice.property_part_id,
      "Due Date": invoice.due_date,
      "Tenant Name": invoice.tenant_name,
      "Merchant": invoice.merchant,
      "Frequency": invoice.frequency,
      "External ID": invoice.external_id,
      "Amount (₹)": invoice.amount,
      "Invoice Status": invoice.status,
      "Alias": invoice.alias || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "Invoices.xlsx");
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center font-inter" style={{ backgroundColor: 'white' }}>
        <div className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center font-inter">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white overflow-hidden">
      <div className="px-6 pt-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-[#3248d6] font-extrabold">Invoices</h2>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:w-[280px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
            />
            <div className="relative w-full sm:w-auto">
              <select
                value={invoiceStatusFilter}
                onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                className="appearance-none w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer transition-all duration-200"
              >
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="paid">Paid</option>
                <option value="approved">Approved</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">

              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
            <div className="relative w-full sm:w-auto">
              <select
                value={invoiceType}
                onChange={(e) => setInvoiceType(e.target.value)}
                className="appearance-none w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer transition-all duration-200"
              >
                <option value="All">All Types</option>
                <option value="one-time">One Time</option>
                <option value="monthly">Recurring (Monthly)</option>
                <option value="quarterly">Recurring (Quarterly)</option>
                <option value="annually">Recurring (Annually)</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">

              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleExport}
                className="flex items-center justify-center px-5 py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15V3M12 3L16 7M12 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 15V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Export
              </button>
              <button
                onClick={() => setShowCreateInvoiceModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
              >
                + Create Invoice
              </button>
            </div>
          </div>
        </div>

      </div>

      <div className="overflow-x-auto px-6 py-4 max-w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-100 text-gray-700 text-left uppercase text-sm">
            <tr>
              <th className="py-3 px-2 text-center w-12 font-semibold">Sr No</th>
              {[
                { label: 'Contract ID', key: 'contract_id' },
                { label: 'Property Part ID', key: 'property_part_id' },
                { label: 'Due Date', key: 'due_date' },
                { label: 'Tenant Name', key: 'tenant_name' },
                { label: 'Merchant', key: 'merchant' },
                { label: 'Frequency', key: 'frequency' },
                { label: 'External ID', key: 'external_id' },
                { label: 'Amount', key: 'amount' },
              ].map((column, idx) => (
                <th
                  key={idx}
                  className="py-3 px-3 cursor-pointer select-none font-semibold"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    <SortIcon className="w-3 h-3 text-gray-500" />
                  </div>
                </th>
              ))}
              <th
                className="py-3 px-3 cursor-pointer select-none font-semibold"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Invoice Status
                  <SortIcon className="w-4 h-4 text-gray-500" />
                </div>
              </th>
              <th className="py-3 px-2 text-center w-16 font-semibold">Invoice</th>
              <th className="py-3 px-2 text-center w-16 font-semibold">Receipt</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedItems.length > 0 ? (
              paginatedItems.map((invoice, index) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-3 px-2 text-center text-sm">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                  <td className="py-3 px-3 font-medium text-sm">{invoice.contract_id}</td>
                  <td className="py-3 px-3 text-sm">{invoice.property_part_id}</td>
                  <td className="py-3 px-3 text-sm">{invoice.due_date}</td>
                  <td className="py-3 px-3 text-sm">{invoice.tenant_name}</td>
                  <td className="py-3 px-3 text-sm">{invoice.merchant}</td>
                  <td className="py-3 px-3 text-sm">{invoice.frequency}</td>
                  <td className="py-3 px-3 text-sm">{invoice.external_id}</td>
                  <td className="py-3 px-3 font-medium text-sm">₹{invoice.amount.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[invoice.status.toLowerCase() as InvoiceStatus]}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center gap-4">
                      {/* View Invoice Icon */}
                      <div
                        className="relative inline-block group"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <EyeIcon className="w-5 h-5 text-blue-500 cursor-pointer group-hover:text-blue-600 transition-colors" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-blue-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                          View Invoice
                        </span>
                      </div>
                      {/* Download Invoice Icon */}
                      <div
                        className="relative inline-block group"
                        onClick={() => handleDownloadInvoice(invoice)}
                      >
                        <DownloadIcon
                          className={`w-5 h-5 text-gray-600 cursor-pointer group-hover:text-gray-800 transition-colors ${
                            isDownloading === invoice.id ? 'animate-pulse cursor-not-allowed' : ''
                          }`}
                        />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                          {isDownloading === invoice.id ? 'Downloading...' : 'Download Invoice'}
                        </span>
                      </div>
                    </div>
                  </td>
<td className="py-3 px-2 text-center">
  {invoice.status.toLowerCase() === 'paid' && (
    <div className="flex items-center justify-center gap-4">
      {/* View Receipt */}
      <div
        className="relative inline-block group"
        onClick={() => handleViewReceipt(invoice)}
      >
        <EyeIcon className="w-5 h-5 text-green-500 cursor-pointer group-hover:text-green-600 transition-colors" />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-green-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          View Receipt
        </span>
      </div>

      {/* Download Receipt */}
      <div
        className="relative inline-block group"
        onClick={() => handleDownloadReceipt(invoice)}
      >
        <DownloadIcon
          className={`w-5 h-5 text-gray-600 cursor-pointer group-hover:text-gray-800 transition-colors ${
            isDownloading === invoice.id + "-receipt" ? 'animate-pulse cursor-not-allowed' : ''
          }`}
        />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          {isDownloading === invoice.id + "-receipt" ? 'Downloading...' : 'Download Receipt'}
        </span>
      </div>
    </div>
  )}
</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="py-6 text-center text-gray-500 text-lg">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3 mb-3 sm:mb-0 overflow-visible">
          <span className="text-sm text-gray-700">Rows per page:</span>
          <div className="relative">
            <select
              className="appearance-none border border-gray-300 rounded-md px-3 py-1 pr-8 text-sm focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer z-10"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">

            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-700">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md transition-colors duration-200 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed bg-gray-100' : 'hover:bg-blue-100 hover:text-blue-700'}`}
          >
            ◀ Previous
          </button>
          <span className="font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md transition-colors duration-200 ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed bg-gray-100' : 'hover:bg-blue-100 hover:text-blue-700'}`}
          >
            Next ▶
          </button>
        </div>
      </div>

      {showCreateInvoiceModal && (
        <CreateInvoiceModal
          isOpen={showCreateInvoiceModal}
          onClose={() => setShowCreateInvoiceModal(false)}
          onInvoiceAdded={handleInvoiceAdded}
        />
      )}

      
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        style={{ top: "100px" }}
      />
    </div>
  );
};

export default RecurringInvoicesPage;