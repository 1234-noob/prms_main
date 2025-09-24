// Template Types
export interface TemplateType {
  id: number;
  type: 'Invoice' | 'Receipt';
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: number;
  organization_id: number;
  template_type_id: number;
  is_active: boolean;
  html_content: string;
  layout_type: string | null;
  logo_url: string | null;
  primary_color: string | null;
  font_family: string | null;
  show_discount: boolean;
  show_qr_code: boolean;
  custom_labels: { [key: string]: string } | null;
  footer_note: string | null;
  date_format: string | null;
  currency_format: string | null;
  receipt_background_url: string | null;
  created_at: string;
  updated_at: string;
  template_type?: TemplateType; // Optional nested template type data
}


export interface CreateTemplateTypePayload {
  type: 'Invoice' | 'Receipt';
  description: string;
}

export interface UpdateTemplateTypePayload {
  type?: 'Invoice' | 'Receipt';
  description?: string;
}


export interface CreateTemplatePayload {
  organization_id: number; 
  template_type_id: number;
  is_active: boolean;
  html_content: string;
  logo_url?: string;
  primary_color?: string;
  font_family?: string;
  show_discount?: boolean;
  show_qr_code?: boolean;
  custom_labels?: { [key: string]: string };
  footer_note?: string;
  date_format?: string;
  currency_format?: string;
  receipt_background_url?: string;
}

export interface UpdateTemplatePayload {
  organization_id?: number;
  template_type_id?: number;
  is_active?: boolean;
  html_content?: string;
  layout_type?: string | null;  
  logo_url?: string | null;
  primary_color?: string | null;
  font_family?: string | null;
  show_discount?: boolean;
  show_qr_code?: boolean;
  custom_labels?: { [key: string]: string } | null;
  footer_note?: string | null;
  date_format?: string | null;
  currency_format?: string | null;
  receipt_background_url?: string | null;
}


export type InvoiceStatus = 'pending' | 'paid' | 'overdue';
export type InvoiceFrequency = 'one-time' | 'monthly' | 'quarterly' | 'annually';

export interface SingleInvoicePayload {
  contract_id: number;
  property_part_id: number;
  amount: number;
  due_date: string; 
  status: InvoiceStatus;
  tenant_name: string;
  merchant: string;
  frequency: InvoiceFrequency;
  external_id: string;
}

export interface CreateInvoiceResponse {
  id: string; 
  message: string; 
  contract_id: number;
  property_part_id: number;
  amount: number;
  due_date: string;
  status: InvoiceStatus;
  tenant_name: string;
  merchant: string;
  frequency: InvoiceFrequency;
  external_id: string;
  created_at: string; 
  updated_at: string; 
}

export interface BulkUploadResponse {
  message: string;
  uploadedCount: number;
  failedCount: number;
}

export interface Invoice extends CreateInvoiceResponse {
  alias?: string; 
}

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  details?: any; 
}