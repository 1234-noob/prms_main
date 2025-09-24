export type DisputeStatus = 'pending' | 'rejected' | 'resolved';

export interface Dispute {
  id: number;
  srNo: string;
  disputeID: string;
  submittedDate: string;
  disputeStatus: DisputeStatus;
  invoiceId: number;
  reason: string;
  comments?: string;
  filePath?: string;
  fileUrl?: string;
  externalId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DisputeResponse {
  id: number;
  tenantId: number;
  status: DisputeStatus;
  invoiceId: number;
  reason: string;
  filePath?: string;
  external_id: string;
  createdAt: string;
  updatedAt: string;
  comments?: string;
}

export interface InvoiceDropdown {
  id: string;
  contract_id: string;
  property_part_id: string;
  due_date: string;
  tenant_name: string;
  tenantId: number;
  merchant: string;
  frequency: string;
  external_id: string;
  amount: number;
  status: string;
  receipt?: string;
}

export interface CreateDisputePayload {
  tenantId: number;
  invoiceId: number;
  reason: string;
  status: DisputeStatus;
  external_id: string;
  comments?: string;
  filePath?: string;
}


export interface UpdateDisputePayload {
  tenantId: number; 
  invoiceId: number;
  reason: string;
  status: DisputeStatus;
  comments?: string;
  
}

export interface DeleteDisputeResponse {
  message: string;
}

export interface CreateDisputeAPIResponse {
  message: string;
  data: DisputeResponse;
}

export interface GetAllDisputesAPIResponse {
  message: string;
  data: DisputeResponse[];
}

export interface UpdateDisputeAPIResponse {
  message: string;
  data: DisputeResponse;
}

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  details?: any;
}