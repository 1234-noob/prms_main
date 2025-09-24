import axios from 'axios';
import {
    CreateDisputePayload,
    UpdateDisputePayload,
    DisputeResponse,
    DeleteDisputeResponse,
    CreateDisputeAPIResponse,
    GetAllDisputesAPIResponse,
    UpdateDisputeAPIResponse,
    ApiErrorResponse
} from './_model';

const getBaseApiUrl = () => {
    return process.env.REACT_APP_API_URL_HELP_SUPPORT || 'http://localhost:3013';
};

const api = axios.create({
    baseURL: getBaseApiUrl(),
    timeout: 30000,
});


api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
    (error) => {
        
        if (axios.isAxiosError(error) && error.response && error.response.status === 410) {
            
            return Promise.resolve({ data: { message: "Dispute deleted successfully" } });
        }

        console.error('API Error:', error);

        if (error.response?.data) {
            const errorData = error.response.data;

            if (typeof errorData === 'object' && errorData.message) {
                return Promise.reject(new Error(errorData.message));
            }

            if (typeof errorData === 'string') {
                return Promise.reject(new Error(errorData));
            }

            if (errorData.details) {
                return Promise.reject(new Error(`${errorData.message || 'Error'}: ${JSON.stringify(errorData.details)}`));
            }

            return Promise.reject(new Error(errorData.message || 'An error occurred'));
        }
       

        return Promise.reject(new Error(error.message || 'An unexpected error occurred'));
    }
);

export const createDispute = async (
    payload: CreateDisputePayload,
    file?: File
): Promise<DisputeResponse> => {
    try {
        const formData = new FormData();

        formData.append('tenantId', payload.tenantId.toString());
        formData.append('invoiceId', payload.invoiceId.toString());
        formData.append('reason', payload.reason);
        formData.append('status', payload.status);
        formData.append('external_id', payload.external_id);

        if (payload.comments) {
            formData.append('comments', payload.comments);
        }

        if (file) {
            formData.append('file', file);
        }

        const response = await api.post<CreateDisputeAPIResponse>('/disputes', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    } catch (error) {
        console.error('Error creating dispute:', error);
        throw error;
    }
};

export const getAllDisputes = async (): Promise<DisputeResponse[]> => {
    try {
        const response = await api.get<GetAllDisputesAPIResponse>('/disputes');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching disputes:', error);
        throw error;
    }
};

export const updateDispute = async (
    disputeId: number,
    payload: UpdateDisputePayload,
    file?: File
): Promise<DisputeResponse> => {
    try {
        const formData = new FormData();

        formData.append('tenantId', payload.tenantId.toString());
        formData.append('invoiceId', payload.invoiceId.toString());
        formData.append('reason', payload.reason);
        formData.append('status', payload.status);

        if (payload.comments) {
            formData.append('comments', payload.comments);
        }

        
        if (file) {
            formData.append('file', file);
        }

        const response = await api.put<UpdateDisputeAPIResponse>(`/disputes/${disputeId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    } catch (error) {
        console.error('Error updating dispute:', error);
        throw error;
    }
};

export const deleteDispute = async (disputeId: number): Promise<DeleteDisputeResponse> => {
    
    const response = await api.delete<DeleteDisputeResponse>(`/disputes/${disputeId}`);
    return response.data;
    
};


export const getDisputeById = async (disputeId: number): Promise<DisputeResponse> => {
    try {
        const response = await api.get<{ data: DisputeResponse }>(`/disputes/${disputeId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching dispute by ID:', error);
        throw error;
    }
};
