import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL_RENTAL_AGREEMENT;
const CONTRACTS_URL = `${API_URL}/api/contracts/`;
const TENANT_URL = `${API_URL}/api/tenants/`;

export const getAllContracts = async () => {
  const response = await axios.get(CONTRACTS_URL);
  return response.data;
};

export const getAllActiveContracts = async () => {
  const response = await axios.get(CONTRACTS_URL, {
    params: {
      isActive: true,
    }
  });
  return response.data;
};

export const getAllExpiredContracts = async () => {
  const response = await axios.get(CONTRACTS_URL, {
    params: {
      isActive: false,
    }
  });
  return response.data;
};

export const getContractById = async (id: number) => {
  const response = await axios.get(CONTRACTS_URL + id);
  return response.data;
};

export const getTenantById = async (id: number) => {
  const response = await axios.get(TENANT_URL + id);
  return response.data;
};

export const createContract = async (data: {
  property_id: number;
  property_name: string;
  property_part_id?: number;
  property_part_name: string;
  rent_amount: number;
  start_date: Date;
  end_date: Date;
  tds_applicable: boolean;
  organization_id: number;
  organization_name: string;
}) => {
  const formattedData = { ...data };
  if (formattedData.start_date instanceof Date) {
    const d = formattedData.start_date;
    (formattedData.start_date as any) = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  if (formattedData.end_date instanceof Date) {
    const d = formattedData.end_date;
    (formattedData.end_date as any) = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  const response = await axios.post(CONTRACTS_URL, formattedData);
  return response.data;
};

export const updateContract = async (id: number, data: {
  tenant_id?: number;
  property_id?: number;
  property_part_id?: number;
  rent_amount?: number;
  start_date?: Date;
  end_date?: Date;
  tds_applicable?: boolean;
  property_name?: string;
  property_part_name?: string;
  organization_id?: number;
  organization_name?: string;
}) => {
  const response = await axios.put(CONTRACTS_URL + id, data);
  return response.data;
};

export const updateContractStatus = async (id: number, data: {
  isActive?: boolean;
}) => {
  const response = await axios.put(CONTRACTS_URL + id + "/status/", data);
  return response.data;
};

export const downloadContractAgreement = async (contractId: number) => {
  const response = await axios.get(`${CONTRACTS_URL}${contractId}/download/`, {
    responseType: 'blob',
  });

  return { data: response.data, headers: response.headers };
};