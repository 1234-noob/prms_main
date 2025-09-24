import axios from 'axios';
import {CreateMaintenanceRequestPayload,
MaintenanceRequestAPIResponseData,
GetAllMaintenanceRequestsAPIResponse,
CreateMaintenanceRequestAPIResponse,
ApiErrorResponse,
UpdateMaintenanceRequestPayload,
UpdateMaintenanceRequestAPIResponse,
DeleteMaintenanceRequestResponse,
UpdateMaintenanceRequestAPIResponseData
} from './_model';

export class ApiResponseError extends Error {
 statusCode?: number;
 details?: any;

constructor(message: string, statusCode?: number, details?: any) {
super(message);
this.name = 'ApiResponseError';
this.statusCode = statusCode;
this.details = details;
 }
}

const API_URL = process.env.REACT_APP_API_URL_HELP_SUPPORT || 'http://localhost:3013';
const MAINTENANCE_URL = `${API_URL}/maintenance`;

export const getAllMaintenanceRequests = async (): Promise<MaintenanceRequestAPIResponseData[]> => {
 try {
const response = await axios.get<GetAllMaintenanceRequestsAPIResponse>(MAINTENANCE_URL);
return response.data.data;
 } catch (error: any) {
console.error('Error fetching all maintenance requests:', error);
if (axios.isAxiosError(error) && error.response) {
 const errorData: ApiErrorResponse = error.response.data;
 throw new ApiResponseError(
errorData.message || 'Failed to fetch maintenance requests',
error.response.status,
errorData.details
 );
}
throw new ApiResponseError(`Network error or unexpected issue: ${error.message}`);
 }
};

export const createMaintenanceRequest = async (
 payload: CreateMaintenanceRequestPayload
): Promise<MaintenanceRequestAPIResponseData> => {
 try {
const response = await axios.post<CreateMaintenanceRequestAPIResponse>(MAINTENANCE_URL, payload);
return response.data.data;
 } catch (error: any) {
console.error('Error creating maintenance request:', error);
if (axios.isAxiosError(error) && error.response) {
 const errorData: ApiErrorResponse = error.response.data;
 throw new ApiResponseError(
errorData.message || 'Failed to create maintenance request',
error.response.status,
errorData.details
 );
}
throw new ApiResponseError(`Network error or unexpected issue: ${error.message}`);
 }
};

export const updateMaintenanceRequest = async (
 requestId: number,
 payload: UpdateMaintenanceRequestPayload
): Promise<UpdateMaintenanceRequestAPIResponseData> => {
 try {
const response = await axios.put<UpdateMaintenanceRequestAPIResponse>(`${MAINTENANCE_URL}/${requestId}`, payload);
return response.data.data;
 } catch (error: any) {
console.error(`Error updating maintenance request ${requestId}:`, error);
if (axios.isAxiosError(error) && error.response) {
 const errorData: ApiErrorResponse = error.response.data;
 throw new ApiResponseError(
errorData.message || `Failed to update maintenance request ${requestId}`,
error.response.status,
errorData.details
 );
}
throw new ApiResponseError(`Network error or unexpected issue: ${error.message}`);
 }
};

export const deleteMaintenanceRequest = async (requestId: number): Promise<DeleteMaintenanceRequestResponse> => {
 try {
const response = await axios.delete<DeleteMaintenanceRequestResponse>(`${MAINTENANCE_URL}/${requestId}`);
return response.data;
 } catch (error: any) {
console.error(`Error deleting maintenance request ${requestId}:`, error);
if (axios.isAxiosError(error) && error.response) {
 
 if (error.response.status === 410) {

return { message: "Maintenance request deleted successfully" };
 }

 
 const errorData: ApiErrorResponse = error.response.data;
 throw new ApiResponseError(
errorData.message || `Failed to delete maintenance request ${requestId}`,
error.response.status,
errorData.details
 );
}
throw new ApiResponseError(`Network error or unexpected issue: ${error.message}`);
 }
};
