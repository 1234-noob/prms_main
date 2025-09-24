import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
// const API_BASE_URL = `${API_URL}/api/contracts/`; 
const TDS_URL = `${API_URL}/api/tds/`;
const TENANT_URL = `${API_URL}/api/tenants/`;

// Get all contracts
// export const getAllContracts = async () => {
//   try {
//     const response = await axios.get(CONTRACTS_URL, {
//       params: {
//         isActive: true,
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching contracts", error);
//     throw error;
//   }
// };
// export const getAllExpiredContracts = async () => {
//   try {
//     const response = await axios.get(CONTRACTS_URL, {
//       params: {
//         isActive: false,
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching contracts", error);
//     throw error;
//   }
// };
// export const getContractById = async (id: number) => {
//   try {
//     const response = await axios.get(CONTRACTS_URL + id);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching contract with ID ${id}`);
//     throw error;
//   }
// }

export const getTenantById = async (id: number) => {
    try {
        const response = await axios.get(TENANT_URL + id);
        return response.data;
    } catch (error) {
        console.error(`Error fetching tenant with ID ${id}`);
        throw error;
    }
}

// Create a new contract
export const submitTDS = async (data: {
    tenant_id: number;
    tenant_name: string;
    organization_id: number;
    organization_name: string;
    property_id: number;
    property_name: string;
    property_part_id?: number;
    property_part_name: string;
    tds_amount: number;
    date_submitted: Date;
    challan_number: string;
    tds_reference_number: string;
    receipt: File;
}) => {
    try {
        const formData = new FormData();

        // Format dates to YYYY-MM-DD strings
        // if (data.date_submitted instanceof Date) {
        //     const d = data.date_submitted;
        //     // @ts-ignore - We're intentionally converting Date to string
        //      = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        // }
        const d = data.date_submitted;
        const formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        formData.append("date_submitted", formattedDate);
        formData.append("tenant_id", data.tenant_id.toString());
        formData.append("tenant_name", data.tenant_name);
        formData.append("organization_id", data.organization_id.toString());
        formData.append("organization_name", data.organization_name);
        formData.append("property_id", data.property_id.toString());
        formData.append("property_name", data.property_name);
        if (data.property_part_id) {
            formData.append("property_part_id", data.property_part_id.toString());
        }
        formData.append("property_part_name", data.property_part_name);
        formData.append("tds_amount", data.tds_amount.toString());
        formData.append("challan_number", data.challan_number);
        formData.append("tds_reference_number", data.tds_reference_number);
        formData.append("receipt", data.receipt);

        // Use the formatted data in the request
        const response = await axios.post(TDS_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating contract", error);
        throw error;
    }
};

// // Update a contract
// export const updateContract = async (id: number, data: {
//   tenant_id?: number;
//   property_id?: number;
//   property_part_id?: number;
//   rent_amount?: number;
//   start_date?: Date;
//   end_date?: Date;
//   tds_applicable?: boolean;
//   property_name?: string;
//   property_part_name?: string;
//   organization_id?: number;
//   organization_name?: string;
// }) => {
//   try {
//     const response = await axios.put(CONTRACTS_URL + id, data);
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating contract with ID ${id}`, error);
//     throw error;
//   }
// };

