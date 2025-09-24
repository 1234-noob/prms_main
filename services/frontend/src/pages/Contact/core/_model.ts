export type ContactStatus = 'approved' | 'pending' | 'rejected';

export interface Contact {
  id: number;
  srNo: string;
  contactID: string;
  submittedDate: string;
  contactStatus: ContactStatus;
  unit: number;
  propertyId: number;
  tenantId: number;
  reason: string;
  description?: string;
  externalId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactPayload {
  unit: number;
  propertyId: number;
  tenantId: number;
  status: ContactStatus;
  reason: string;
  description?: string;
  external_id: string;
}

export interface UpdateContactPayload {
  unit?: number;
  propertyId?: number;
  tenantId?: number;
  status?: ContactStatus;
  reason?: string;
  description?: string;
  external_id?: string;
}

export interface ContactResponse {
  id: number;
  tenantId: number;
  unit: number;
  propertyId: number;
  reason: string;
  description?: string;
  status: ContactStatus;
  externalId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllContactsAPIResponse {
  message: string;
  data: ContactResponse[];
}

export interface CreateContactAPIResponse {
  message: string;
  data: ContactResponse;
}

export interface UpdateContactAPIResponse {
  message: string;
  data: ContactResponse;
}

export interface DeleteContactResponse {
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  details?: any;
}
