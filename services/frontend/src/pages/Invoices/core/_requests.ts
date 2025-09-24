import axios from 'axios';
import { 
  SingleInvoicePayload, 
  CreateInvoiceResponse, 
  BulkUploadResponse, 
  Invoice, 
  ApiErrorResponse,
  TemplateType,
  Template,
  CreateTemplateTypePayload,
  CreateTemplatePayload,
  UpdateTemplatePayload,
  UpdateTemplateTypePayload
} from './_model';

const API_URL = process.env.REACT_APP_API_URL_INOVICE_AND_PAYMENTS;
const INVOICES_URL = `${API_URL}/api/invoices`;
const BULK_UPLOAD_URL = `${API_URL}/api/invoices/upload-excel`;
const TEMPLATE_TYPES_URL = `${API_URL}/api/template-type`;
const TEMPLATES_URL = `${API_URL}/api/templates`;
export const INVOICE_RECEIPT_URL = `${INVOICES_URL}`;

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


const handleApiError = (error: any, defaultMessage: string) => {
  console.error(defaultMessage, error);
  
  if (axios.isAxiosError(error) && error.response) {
    const errorData: ApiErrorResponse = error.response.data;
    
   
    switch (error.response.status) {
      case 404:
        throw new ApiResponseError('Resource not found', 404, errorData.details);
      case 409:
        throw new ApiResponseError(errorData.message || 'Conflict - resource may be in use', 409, errorData.details);
      case 410:
       
        return;
      case 422:
        throw new ApiResponseError(errorData.message || 'Validation error', 422, errorData.details);
      default:
        throw new ApiResponseError(
          errorData.message || defaultMessage,
          error.response.status,
          errorData.details
        );
    }
  }
  
  throw new ApiResponseError(`Network error or unexpected issue: ${error.message}`);
};

// Template Type APIs
export const createTemplateType = async (payload: CreateTemplateTypePayload): Promise<TemplateType> => {
  try {
    const response = await axios.post<TemplateType>(TEMPLATE_TYPES_URL, payload);
    return response.data;
  } catch (error: any) {
    handleApiError(error, 'Failed to create template type');
    throw error; 
  }
};

export const getAllTemplateTypes = async (): Promise<TemplateType[]> => {
  try {
    const response = await axios.get<TemplateType[]>(TEMPLATE_TYPES_URL);
    return response.data;
  } catch (error: any) {
    handleApiError(error, 'Failed to fetch template types');
    throw error; 
  }
};

export const updateTemplateType = async (id: number, payload: UpdateTemplateTypePayload): Promise<TemplateType> => {
  try {
    const response = await axios.put<TemplateType>(`${TEMPLATE_TYPES_URL}/${id}`, payload);
    return response.data;
  } catch (error: any) {
    handleApiError(error, `Failed to update template type with ID ${id}`);
    throw error;
  }
};


export const createTemplate = async (payload: CreateTemplatePayload): Promise<Template> => {
  try {
    const response = await axios.post<Template>(TEMPLATES_URL, payload);
    return response.data;
  } catch (error: any) {
    handleApiError(error, 'Failed to create template');
    throw error;
  }
};

export const getAllTemplates = async (): Promise<Template[]> => {
  try {
    const response = await axios.get<{ status: string; data: Template[] }>(TEMPLATES_URL);

    const templates = response.data.data; // <-- extract the array

    if (!Array.isArray(templates)) {
      console.warn("Expected array but got:", templates);
      return []; // fallback to empty array
    }

    return templates;
  } catch (error: any) {
    handleApiError(error, "Failed to fetch templates");
    return []; // fallback so component doesn’t crash
  }
};


export const getTemplateById = async (id: number): Promise<string> => {
  try {
    const response = await axios.get(`${TEMPLATES_URL}/${id}`, {
      headers: {
        'Accept': 'text/html'
      }
    });
    return response.data;
  } catch (error: any) {
    handleApiError(error, `Template with ID ${id} not found`);
    throw error;
  }
};

export const getTemplateDataById = async (id: number): Promise<Template> => {
  try {
    const response = await axios.get<Template>(`${TEMPLATES_URL}/${id}/data`);
    return response.data;
  } catch (error: any) {
    handleApiError(error, `Template data with ID ${id} not found`);
    throw error;
  }
};

export const updateTemplate = async (id: number, payload: UpdateTemplatePayload): Promise<Template> => {
  try {
    const response = await axios.put<Template>(`${TEMPLATES_URL}/${id}`, payload);
    return response.data;
  } catch (error: any) {
    handleApiError(error, `Failed to update template with ID ${id}`);
    throw error;
  }
};

export const deleteTemplate = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${TEMPLATES_URL}/${id}`);
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 410) {
     
      console.log(`Template ${id} was already deleted`);
      return;
    }
    handleApiError(error, `Failed to delete template with ID ${id}`);
  }
};

export const deleteTemplateType = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${TEMPLATE_TYPES_URL}/${id}`);
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 410) {
      
      console.log(`Template type ${id} was already deleted`);
      return;
    }
    handleApiError(error, `Failed to delete template type with ID ${id}`);
  }
};

// Invoice APIs
export const createSingleInvoice = async (payload: SingleInvoicePayload): Promise<CreateInvoiceResponse> => {
  try {
    const response = await axios.post<CreateInvoiceResponse>(INVOICES_URL, payload);
    return response.data;
  } catch (error: any) {
    handleApiError(error, 'Failed to create invoice');
    throw error;
  }
};

export const uploadBulkInvoices = async (file: File, alias: string): Promise<BulkUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('alias', alias);

  try {
    const response = await axios.post<BulkUploadResponse>(BULK_UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
    return response.data;
  } catch (error: any) {
    handleApiError(error, 'Failed to upload invoices');
    throw error;
  }
};

export const getAllInvoices = async (params?: any): Promise<Invoice[]> => {
  try {
    const response = await axios.get<Invoice[]>(INVOICES_URL, { params });
    return response.data;
  } catch (error: any) {
    handleApiError(error, 'Failed to fetch invoices');
    throw error;
  }
};

export const getInvoiceById = async (id: string): Promise<Invoice> => {
  try {
    const response = await axios.get<Invoice>(`${INVOICES_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    handleApiError(error, `Invoice with ID ${id} not found`);
    throw error;
  }
};


