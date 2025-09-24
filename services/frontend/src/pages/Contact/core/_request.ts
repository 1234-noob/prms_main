import axios from 'axios';
import {
 CreateContactPayload,
 ContactResponse,
 GetAllContactsAPIResponse,
 CreateContactAPIResponse,
 ApiErrorResponse,
 UpdateContactPayload,
 UpdateContactAPIResponse,
 DeleteContactResponse,
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
const CONTACT_URL = `${API_URL}/contact`;

export const getAllContacts = async (): Promise<ContactResponse[]> => {
 try {
  const response = await axios.get<GetAllContactsAPIResponse>(CONTACT_URL);
  return response.data.data;
 } catch (error: any) {
  console.error('Error fetching all contacts:', error);
  if (axios.isAxiosError(error) && error.response) {
   const errorData: ApiErrorResponse = error.response.data;
   throw new ApiResponseError(
    errorData.message || 'Failed to fetch contacts',
    error.response.status,
    errorData.details
   );
  }
  throw new ApiResponseError(`Network error or unexpected issue: ${error.message}`);
 }
};

export const createContact = async (
 payload: CreateContactPayload
): Promise<ContactResponse> => {
 try {
  const response = await axios.post<CreateContactAPIResponse>(CONTACT_URL, payload);
  return response.data.data;
 } catch (error: any) {
  console.error('Error creating contact:', error);
  if (axios.isAxiosError(error) && error.response) {
   const errorData: ApiErrorResponse = error.response.data;
   throw new ApiResponseError(
    errorData.message || 'Failed to create contact',
    error.response.status,
    errorData.details
   );
  }
  throw new ApiResponseError(`Network error or unexpected issue: ${error.message}`);
 }
};

export const updateContact = async (
 contactId: number,
 payload: UpdateContactPayload
): Promise<ContactResponse> => {
 try {
  const response = await axios.put<UpdateContactAPIResponse>(`${CONTACT_URL}/${contactId}`, payload);
  return response.data.data;
 } catch (error: any) {
  console.error(`Error updating contact ${contactId}:`, error);
  if (axios.isAxiosError(error) && error.response) {
   const errorData: ApiErrorResponse = error.response.data;
   throw new ApiResponseError(
    errorData.message || `Failed to update contact ${contactId}`,
    error.response.status,
    errorData.details
   );
  }
  throw new ApiResponseError(`Network error or unexpected issue: ${error.message}`);
 }
};

export const deleteContact = async (contactId: number): Promise<DeleteContactResponse> => {
 try {
  const response = await axios.delete<DeleteContactResponse>(`${CONTACT_URL}/${contactId}`);
  return response.data;
 } catch (error: any) {
  console.error(`Error deleting contact ${contactId}:`, error);
  if (axios.isAxiosError(error) && error.response) {
   
   if (error.response.status === 410) {
    
    return { message: "Contact deleted successfully" };
   }

   
   const errorData: ApiErrorResponse = error.response.data;
   throw new ApiResponseError(
    errorData.message || `Failed to delete contact ${contactId}`,
    error.response.status,
    errorData.details
   );
  }
  throw new ApiResponseError(`Network error or unexpected issue: ${error.message}`);
 }
};
