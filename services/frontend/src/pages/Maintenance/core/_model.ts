export interface MaintenanceRequest {
  id: number;
  srNo: string;
  requestID: string;
  submittedDate: string;
  issueType: string;
  unit: number;
  propertyId: number;
  TenantId: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaintenanceRequestPayload {
  unit: number;
  propertyId: number;
  TenantId: number;
  description?: string;
  issueType: string;
}

export interface UpdateMaintenanceRequestPayload {
  issueType?: string;
  unit?: number;
  propertyId?: number;
  TenantId?: number;
  description?: string;
}

export interface MaintenanceRequestAPIResponseData {
  id: number;
  issueType: string;
  unit: number;
  propertyId: number;
  TenantId: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMaintenanceRequestAPIResponseData {
  id: number;
  issueType: string;
  unit: number;
  propertyId: number;
  TenantId: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllMaintenanceRequestsAPIResponse {
  message: string;
  data: MaintenanceRequestAPIResponseData[];
}

export interface CreateMaintenanceRequestAPIResponse {
  message: string;
  data: MaintenanceRequestAPIResponseData;
}

export interface UpdateMaintenanceRequestAPIResponse {
  message: string;
  data: UpdateMaintenanceRequestAPIResponseData;
}

export interface DeleteMaintenanceRequestResponse {
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  details?: any;
}
